"use client";

import { useEffect, useMemo, useState } from "react";
import BackgroundSlideshow from "./background-slideshow";
import ComingSoonFooter from "./coming-soon-footer";
import ComingSoonHeader from "./coming-soon-header";
import ComingSoonHero from "./coming-soon-hero";
import PdfPreviewModal from "./pdf-preview-modal";
import { SLIDE_INTERVAL, type SlideItem } from "./coming-soon-constants";

type ComingSoonPageProps = {
  slides: SlideItem[];
};

export default function ComingSoonPage({ slides }: ComingSoonPageProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activePdf, setActivePdf] = useState<{ label: string; url: string } | null>(null);

  const availableSlides = useMemo(
    () => slides.filter((slide) => Boolean(slide.src)),
    [slides]
  );
  const canChangeSlide = availableSlides.length > 1;

  useEffect(() => {
    if (!canChangeSlide) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setActiveSlide((currentSlide) => (currentSlide + 1) % availableSlides.length);
    }, SLIDE_INTERVAL);

    return () => window.clearInterval(intervalId);
  }, [availableSlides.length, canChangeSlide]);

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }

    const closeMenu = () => setMobileMenuOpen(false);
    window.addEventListener("resize", closeMenu);

    return () => window.removeEventListener("resize", closeMenu);
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (!activePdf) {
      return;
    }

    const { overflow } = document.body.style;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActivePdf(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activePdf]);

  const nextSlide = () => {
    if (!canChangeSlide) {
      return;
    }

    setActiveSlide((currentSlide) => (currentSlide + 1) % availableSlides.length);
  };

  return (
    <main className="relative min-h-dvh overflow-x-hidden text-white">
      <BackgroundSlideshow activeSlide={activeSlide} slides={availableSlides} />

      <div className="relative z-10 flex min-h-dvh flex-col">
        <ComingSoonHeader
          mobileMenuOpen={mobileMenuOpen}
          onCloseMenu={() => setMobileMenuOpen(false)}
          onOpenPdf={(fileUrl, label) => setActivePdf({ label, url: fileUrl })}
          onToggleMenu={() => setMobileMenuOpen((state) => !state)}
        />

        <ComingSoonHero canChangeSlide={canChangeSlide} onNextSlide={nextSlide} />
        <ComingSoonFooter />
      </div>

      {activePdf ? (
        <PdfPreviewModal
          fileLabel={activePdf.label}
          fileUrl={activePdf.url}
          onClose={() => setActivePdf(null)}
        />
      ) : null}
    </main>
  );
}
