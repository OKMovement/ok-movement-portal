"use client";

import { type SlideItem } from "./coming-soon-constants";

type BackgroundSlideshowProps = {
  activeSlide: number;
  slides: SlideItem[];
};

export default function BackgroundSlideshow({ activeSlide, slides }: BackgroundSlideshowProps) {
  return (
    <>
      <div className="absolute inset-0 bg-[#080f1e]" />

      {slides.map((slide, index) => (
        <div
          key={slide.id}
          aria-hidden="true"
          className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${
            index === activeSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide.src}
            alt={slide.alt}
            className="h-full w-full object-cover object-center"
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-black/80" />
      <div aria-hidden="true" className="coming-soon__grain absolute inset-0" />
    </>
  );
}