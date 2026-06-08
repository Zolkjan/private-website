"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const HOVER_SELECTOR = "a, button, [data-cursor-hover]";

    const onMove = (e: MouseEvent) => {
      gsap.to(dot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.05,
        ease: "none",
      });
      gsap.to(ring, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.18,
        ease: "power2.out",
      });
    };

    // Event delegation — single listener on document instead of one per element
    const onOver = (e: MouseEvent) => {
      if ((e.target as Element).closest(HOVER_SELECTOR)) {
        gsap.to(dot, { scale: 0, duration: 0.2 });
        ring.classList.add("is-hovering");
      }
    };

    const onOut = (e: MouseEvent) => {
      if ((e.target as Element).closest(HOVER_SELECTOR)) {
        gsap.to(dot, { scale: 1, duration: 0.2 });
        ring.classList.remove("is-hovering");
      }
    };

    const onMouseDown = () =>
      gsap.to([dot, ring], { scale: 0.7, duration: 0.1 });
    const onMouseUp = () => gsap.to([dot, ring], { scale: 1, duration: 0.15 });

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseout", onOut, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div
        ref={ringRef}
        className="cursor-ring transition-[width,height,border-color,background] duration-200"
      />
    </>
  );
};

export default CustomCursor;
