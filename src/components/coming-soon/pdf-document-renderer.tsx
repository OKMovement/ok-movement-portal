"use client";

import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs?v=${pdfjs.version}`;

const DEFAULT_PAGE_RATIO = 1.414;
const PAGE_PRERENDER_COUNT = 2;

type PdfDocumentRendererProps = {
  fileLabel: string;
  fileUrl: string;
};

type PdfPageItemProps = {
  devicePixelRatio: number;
  onMeasure?: (ratio: number) => void;
  pageNumber: number;
  pageRatio: number;
  pageWidth: number;
  rootRef: React.RefObject<HTMLDivElement | null>;
};

function LoadingState({ message }: { message: string }) {
  return (
    <div className="flex min-h-72 items-center justify-center px-6 py-12 text-center text-sm text-white/75 sm:text-base">
      {message}
    </div>
  );
}

function PdfPageItem({ devicePixelRatio, onMeasure, pageNumber, pageRatio, pageWidth, rootRef }: PdfPageItemProps) {
  const pageWrapperRef = useRef<HTMLDivElement | null>(null);
  const [shouldRender, setShouldRender] = useState(pageNumber <= PAGE_PRERENDER_COUNT);

  useEffect(() => {
    if (shouldRender || !pageWrapperRef.current || !rootRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => { if (entries[0]?.isIntersecting) setShouldRender(true); },
      { root: rootRef.current, rootMargin: "900px 0px" },
    );

    observer.observe(pageWrapperRef.current);
    return () => observer.disconnect();
  }, [rootRef, shouldRender]);

  return (
    <div
      ref={pageWrapperRef}
      className="overflow-hidden bg-white"
      style={{ minHeight: pageWidth > 0 ? `${Math.round(pageWidth * pageRatio)}px` : undefined }}
    >
      {shouldRender && pageWidth > 0 ? (
        <Page
          className="mx-auto"
          devicePixelRatio={devicePixelRatio}
          loading={<LoadingState message={`Rendering page ${pageNumber}...`} />}
          pageNumber={pageNumber}
          renderAnnotationLayer={false}
          renderTextLayer={false}
          width={pageWidth}
          onLoadSuccess={(page) => {
            if (!onMeasure) return;
            const viewport = page.getViewport({ scale: 1 });
            onMeasure(viewport.height / viewport.width);
          }}
        />
      ) : null}
    </div>
  );
}

export default function PdfDocumentRenderer({ fileLabel, fileUrl }: PdfDocumentRendererProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollRootRef = useRef<HTMLDivElement | null>(null);
  const [devicePixelRatio, setDevicePixelRatio] = useState(1.5);
  const [numPages, setNumPages] = useState(0);
  const [pageRatio, setPageRatio] = useState(DEFAULT_PAGE_RATIO);
  const [pageWidth, setPageWidth] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || typeof window === "undefined") return;

    const updateMetrics = () => {
      setPageWidth(Math.floor(container.clientWidth));
      const viewportWidth = window.innerWidth;
      const currentDpr = window.devicePixelRatio || 1;
      setDevicePixelRatio(viewportWidth < 640 ? Math.min(currentDpr, 2.5) : Math.min(currentDpr, 1.75));
    };

    updateMetrics();

    const resizeObserver = new ResizeObserver(() => updateMetrics());
    resizeObserver.observe(container);
    window.addEventListener("resize", updateMetrics);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateMetrics);
    };
  }, []);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div ref={scrollRootRef} className="min-h-0 flex-1 overflow-y-auto bg-neutral-900/80 px-0 py-0 sm:px-2 sm:py-3">
        <div ref={containerRef} className="mx-auto w-full max-w-[88rem]">
          <Document
            error={
              <div className="rounded-[20px] border border-red-500/35 bg-red-950/40 px-5 py-6 text-sm text-red-100">
                We couldn&apos;t render {fileLabel} right now.
              </div>
            }
            file={fileUrl}
            loading={<LoadingState message={`Loading ${fileLabel}...`} />}
            noData={<LoadingState message="No PDF file was provided." />}
            onLoadSuccess={({ numPages: loadedPages }) => setNumPages(loadedPages)}
          >
            <div className="space-y-0">
              {Array.from({ length: numPages }, (_, index) => (
                <PdfPageItem
                  devicePixelRatio={devicePixelRatio}
                  key={`page_${index + 1}`}
                  onMeasure={index === 0 ? setPageRatio : undefined}
                  pageNumber={index + 1}
                  pageRatio={pageRatio}
                  pageWidth={pageWidth}
                  rootRef={scrollRootRef}
                />
              ))}
            </div>
          </Document>
        </div>
      </div>
    </div>
  );
}