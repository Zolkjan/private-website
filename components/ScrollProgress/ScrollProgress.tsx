"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    let frame = 0;
    let total = 0;
    const draw = () => {
      frame = 0;
      const progress = total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0;
      bar.style.transform = `scaleX(${progress})`;
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(draw); };
    const measure = () => {
      total = document.documentElement.scrollHeight - window.innerHeight;
      schedule();
    };
    const resize = new ResizeObserver(measure);
    resize.observe(document.body);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", measure);
    measure();
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", measure);
    };
  }, [pathname]);

  if (pathname.startsWith("/admin")) return null;
  return <div ref={barRef} aria-hidden="true" className="pointer-events-none fixed inset-x-0 top-0 z-[80] h-0.5 origin-left bg-[#67dbe8]" style={{ transform: "scaleX(0)" }} />;
}
