"use client";

import { useEffect, useState } from "react";

const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      const total = scrollHeight - clientHeight;
      setProgress(total > 0 ? (scrollTop / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 z-[200] h-[2px] pointer-events-none"
      style={{
        width: `${progress}%`,
        background: "linear-gradient(to right, #04b2d9, #05dbf2)",
        boxShadow: progress > 1 ? "0 0 10px rgba(5,219,242,0.6)" : "none",
        transition: "width 80ms linear",
      }}
    />
  );
};

export default ScrollProgress;
