"use client";

import { useEffect, useRef } from "react";

/**
 * Adds `data-revealed` to every `.reveal` descendant as it enters the viewport,
 * so sections cascade in instead of mounting all at once.
 *
 * Elements start hidden via CSS, so anything that never intersects — or any
 * visitor who prefers reduced motion — is revealed immediately rather than
 * being left invisible.
 */
export function useReveal<T extends HTMLElement>() {
  const containerRef = useRef<T | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const targets = Array.from(container.querySelectorAll<HTMLElement>(".reveal"));
    if (targets.length === 0) return;

    const revealAll = () => {
      for (const target of targets) target.dataset.revealed = "true";
    };

    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      revealAll();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.revealed = "true";
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );

    for (const target of targets) observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return containerRef;
}
