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

    let mouseX = 0;
    let mouseY = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      gsap.to(dot, { x: mouseX, y: mouseY, duration: 0.05, ease: "none" });
      gsap.to(ring, {
        x: mouseX,
        y: mouseY,
        duration: 0.18,
        ease: "power2.out",
      });
    };

    const onEnterLink = () => {
      gsap.to(dot, { scale: 0, duration: 0.2 });
      ring.classList.add("is-hovering");
    };

    const onLeaveLink = () => {
      gsap.to(dot, { scale: 1, duration: 0.2 });
      ring.classList.remove("is-hovering");
    };

    const onMouseDown = () => {
      gsap.to([dot, ring], { scale: 0.7, duration: 0.1 });
    };

    const onMouseUp = () => {
      gsap.to([dot, ring], { scale: 1, duration: 0.15 });
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    const addHoverListeners = () => {
      const links = document.querySelectorAll("a, button, [data-cursor-hover]");
      links.forEach((el) => {
        el.addEventListener("mouseenter", onEnterLink);
        el.addEventListener("mouseleave", onLeaveLink);
      });
    };

    addHoverListeners();

    // Re-attach on DOM mutations
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      observer.disconnect();
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
