"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProfile } from "@/lib/profile";
import { defaultSiteContent, useSiteContent } from "@/lib/firestore-hooks";

const SplineScene = dynamic(() => import("./SplineScene"), { ssr: false });

export default function HeroSection() {
  const [loadScene, setLoadScene] = useState(false);
  const profile = useProfile();
  const content = useSiteContent(defaultSiteContent);
  const idleRef = useRef<number | null>(null);

  useEffect(() => {
    const idleSupported = typeof window.requestIdleCallback === "function";
    const frame = requestAnimationFrame(() => {
      idleRef.current = idleSupported
        ? window.requestIdleCallback(() => setLoadScene(true), { timeout: 800 })
        : window.setTimeout(() => setLoadScene(true), 0);
    });
    return () => {
      cancelAnimationFrame(frame);
      if (idleRef.current !== null) {
        if (idleSupported) window.cancelIdleCallback(idleRef.current);
        else window.clearTimeout(idleRef.current);
      }
    };
  }, []);

  return (
    <section className="relative h-[100svh] min-h-[560px] overflow-hidden bg-[#0a0a0a] lg:min-h-[640px]">
      <div className="spline-container absolute inset-0 h-full w-full">
        {loadScene && <SplineScene />}
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[38%]"
        style={{ background: "linear-gradient(to top, rgba(10,10,10,0.99) 0%, rgba(10,10,10,0.84) 40%, rgba(10,10,10,0.3) 76%, transparent 100%)" }} />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2]">
        <div className="site-container pb-7 sm:pb-9">
          <div className="grid gap-5 border-t border-white/20 pt-5 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="min-w-0">
              <p className="mb-2 text-xs font-medium tracking-wide text-white drop-shadow-[0_1px_3px_rgba(0,0,0,.9)]">{profile.displayName} · CreativePath</p>
              <h1 className="text-[clamp(1.55rem,3.4vw,2.8rem)] font-semibold leading-[1.12] tracking-[-0.045em] text-white">
                Strony internetowe<br className="sm:hidden" /> i aplikacje webowe.
              </h1>
              <p className="mt-3 max-w-xl text-xs leading-relaxed text-[#c0cdd2] sm:text-sm">{content.heroDescription}</p>
            </div>
            <div className="pointer-events-auto flex flex-wrap items-center gap-3">
              <Button asChild className="h-11 rounded-full bg-[#67dbe8] px-5 text-[#071014] hover:bg-[#a0edf4]">
                <a href="#projekty">Zobacz projekty <ArrowDown /></a>
              </Button>
              <Button asChild variant="outline" className="h-11 rounded-full border-white/30 bg-transparent px-5 text-white hover:bg-white/10 hover:text-white">
                <Link href="/contact">Porozmawiajmy <ArrowUpRight /></Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
