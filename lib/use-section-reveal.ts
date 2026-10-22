"use client";

import type { RefObject } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

export function useSectionReveal(ref: RefObject<HTMLElement | null>, revision = "") {
  useGSAP(() => {
    const section = ref.current;
    if (!section) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      // Each item enters at its own position, including on long mobile layouts.
      section.querySelectorAll<HTMLElement>("[data-reveal]").forEach((element) => {
        gsap.from(element, {
          y: 24, opacity: 0, duration: 0.7,
          delay: Math.min(Number(element.dataset.revealDelay) || 0, 0.3),
          ease: "power3.out", clearProps: "transform,opacity",
          scrollTrigger: { trigger: element, start: "top 92%", once: true },
        });
      });
      section.querySelectorAll<HTMLElement>("[data-reveal-image]").forEach((element) => {
        gsap.from(element, {
          scale: 1.06, duration: 1.25, ease: "power2.out", clearProps: "transform",
          scrollTrigger: { trigger: element.parentElement, start: "top 90%", once: true },
        });
      });
      section.querySelectorAll<HTMLElement>("[data-reveal-line]").forEach((element) => {
        gsap.from(element, {
          scaleX: 0, transformOrigin: "left center", duration: 1, ease: "power3.inOut",
          clearProps: "transform,transformOrigin",
          scrollTrigger: { trigger: element, start: "top 92%", once: true },
        });
      });
    });
    return () => media.revert();
  }, { scope: ref, dependencies: [revision], revertOnUpdate: true });
}
