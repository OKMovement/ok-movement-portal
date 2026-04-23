"use client";

import dynamic from "next/dynamic";

const PdfDocumentRenderer = dynamic(() => import("./pdf-document-renderer"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-72 items-center justify-center px-6 py-12 text-center text-sm text-white/75 sm:text-base">
      Preparing document preview...
    </div>
  ),
});

type PdfPreviewModalProps = {
  fileLabel: string;
  fileUrl: string;
  onClose: () => void;
};

export default function PdfPreviewModal({
  fileLabel,
  fileUrl,
  onClose,
}: PdfPreviewModalProps) {
  return (
    <div
      aria-labelledby="pdf-preview-title"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 px-2 py-2 backdrop-blur-sm sm:items-center sm:px-5 sm:py-5 lg:px-8 lg:py-6"
      role="dialog"
      onClick={onClose}
    >
      <div
        className="relative flex h-[calc(100dvh-1rem)] w-full max-w-none flex-col overflow-hidden rounded-[18px] border border-white/10 bg-neutral-950 shadow-[0_20px_60px_rgba(0,0,0,0.4)] sm:h-[90dvh] sm:max-w-[70rem] sm:rounded-[24px] sm:border-white/20 sm:shadow-[0_32px_120px_rgba(0,0,0,0.55)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-white/10 px-3 py-3 sm:gap-4 sm:px-6 sm:py-4">
          <div>
            <h2 id="pdf-preview-title" className="text-base font-semibold text-white sm:text-xl">
              {fileLabel}
            </h2>
          </div>

          <button
            aria-label="Close PDF preview"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 text-lg text-white/85 transition hover:border-white/50 hover:bg-white/10 hover:text-white sm:h-11 sm:w-11 sm:text-xl"
            type="button"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="min-h-0 flex-1">
          <PdfDocumentRenderer key={fileUrl} fileLabel={fileLabel} fileUrl={fileUrl} />
        </div>
      </div>
    </div>
  );
}
