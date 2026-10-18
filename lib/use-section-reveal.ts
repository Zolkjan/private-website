"use client";

import type { RefObject } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

export function useSectionReveal(ref: RefObject<HTMLElement | null>) {
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from("[data-reveal]", {
        y: 20, opacity: 0, duration: 0.55, stagger: 0.07,
        ease: "power2.out", clearProps: "transform,opacity",
        scrollTrigger: { trigger: ref.current, start: "top 88%", once: true },
      });
    });
    return () => media.revert();
  }, { scope: ref });
}
