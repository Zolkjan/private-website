"use client";

import { useEffect, useRef } from "react";

const ScrollProgress = () => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      const total = scrollHeight - clientHeight;
      const pct = total > 0 ? (scrollTop / total) * 100 : 0;
      bar.style.width = `${pct}%`;
      bar.style.boxShadow = pct > 1 ? "0 0 10px rgba(5,219,242,0.6)" : "none";
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      ref={barRef}
      aria-hidden="true"
      className="fixed top-0 left-0 z-[200] h-[2px] pointer-events-none"
      style={{
        width: "0%",
        background: "linear-gradient(to right, #04b2d9, #05dbf2)",
      }}
    />
  );
};

export default ScrollProgress;
