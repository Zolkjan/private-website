"use client";

import { Component, useRef, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { Application } from "@splinetool/runtime";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { defaultSiteContent, useSiteContent } from "@/lib/firestore-hooks";
import { useProfile } from "@/lib/profile";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#0a0a0a]" aria-hidden="true" />
  ),
});

const SplineFallback = () => (
  <div
    className="w-full h-full"
    style={{
      background:
        "radial-gradient(ellipse 80% 60% at 50% 40%, rgba(4,178,217,0.08) 0%, rgba(10,10,10,0) 70%), #0a0a0a",
    }}
    aria-hidden="true"
  />
);

// Last-resort boundary for unexpected runtime errors after the pre-check
class SplineErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? <SplineFallback /> : this.props.children;
  }
}

// Pre-checks WebGL availability before loading Spline so THREE.js never
// runs (and never logs console errors) when WebGL is unavailable/blocked.
// Also pauses the Spline render loop when the section is off-screen to
// free up GPU resources during page scroll.
const SplineScene = () => {
  const [status, setStatus] = useState<"pending" | "ok" | "unavailable">(
    "pending",
  );
  const appRef = useRef<Application | null>(null);
  const isVisibleRef = useRef(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check API presence only — no context created, no side effects.
    // SplineErrorBoundary handles runtime failures if a context later fails.
    const ok =
      typeof WebGLRenderingContext !== "undefined" ||
      typeof WebGL2RenderingContext !== "undefined";
    setStatus(ok ? "ok" : "unavailable");
  }, []);

  // Pause Spline render loop when scrolled out of view → frees GPU for scroll
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
        const app = appRef.current;
        if (!app) return;
        if (entry.isIntersecting) {
          if (app.isStopped) app.play();
        } else {
          if (!app.isStopped) app.stop();
        }
      },
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [status]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const installWheelBridge = () => {
      const frame = container.querySelector("iframe");
      const html = frame?.srcdoc;
      if (!frame || !html || html.includes("__portfolioSplineWheel")) return;

      const document = new DOMParser().parseFromString(html, "text/html");
      const script = document.createElement("script");
      script.textContent = `window.addEventListener("wheel", (event) => {
        event.preventDefault();
        window.parent.postMessage({ type: "__portfolioSplineWheel", deltaX: event.deltaX, deltaY: event.deltaY, deltaMode: event.deltaMode }, "*");
      }, { passive: false });`;
      document.body.appendChild(script);
      frame.srcdoc = `<!doctype html>\n${document.documentElement.outerHTML}`;
    };

    const onMessage = (event: MessageEvent) => {
      const frame = container.querySelector("iframe");
      if (
        event.source !== frame?.contentWindow ||
        event.data?.type !== "__portfolioSplineWheel"
      )
        return;

      const { deltaX, deltaY, deltaMode } = event.data;
      if (!Number.isFinite(deltaX) || !Number.isFinite(deltaY)) return;
      const unit =
        deltaMode === 1 ? 16 : deltaMode === 2 ? window.innerHeight : 1;
      window.scrollBy(deltaX * unit, deltaY * unit);
    };

    const observer = new MutationObserver(installWheelBridge);
    observer.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["srcdoc"],
    });
    window.addEventListener("message", onMessage);
    installWheelBridge();
    return () => {
      observer.disconnect();
      window.removeEventListener("message", onMessage);
    };
  }, [status]);

  if (status === "unavailable") return <SplineFallback />;
  if (status === "pending")
    return <div className="w-full h-full bg-[#0a0a0a]" aria-hidden="true" />;

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      onWheelCapture={(event) => event.stopPropagation()}
    >
      <SplineErrorBoundary>
        <Spline
          scene="https://prod.spline.design/ugrRUma4IHA2tD4s/scene.splinecode"
          style={{ width: "100%", height: "100%" }}
          onLoad={(app) => {
            appRef.current = app;
            if (!isVisibleRef.current) app.stop();
          }}
        />
      </SplineErrorBoundary>
    </div>
  );
};

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const containerRef = useRef<HTMLElement>(null);
  const content = useSiteContent(defaultSiteContent);
  const profile = useProfile();

  useGSAP(
    () => {
      // On-load: above-fold elements only
      gsap
        .timeline({ delay: 0.2 })
        .from(".hero-role", {
          y: 20,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
        })
        .from(".hero-scroll", { opacity: 0, duration: 0.6 }, "-=0.2");

      // Single ScrollTrigger timeline — replaces 4 separate triggers
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".hero-heading",
            start: "top 85%",
            once: true,
          },
          onComplete() {
            gsap.set(".hero-word,.hero-desc,.hero-cta,.hero-line,.hero-stat", {
              clearProps: "all",
            });
          },
        })
        .from(".hero-word", {
          y: 60,
          opacity: 0,
          stagger: 0.15,
          duration: 1.0,
          ease: "power4.out",
        })
        .from(
          ".hero-desc",
          {
            y: 20,
            opacity: 0,
            duration: 0.7,
            ease: "power3.out",
          },
          "-=0.4",
        )
        .from(
          ".hero-cta",
          {
            y: 20,
            opacity: 0,
            stagger: 0.08,
            duration: 0.6,
            ease: "power3.out",
          },
          "-=0.4",
        )
        .from(
          ".hero-line",
          {
            scaleX: 0,
            transformOrigin: "left center",
            duration: 0.9,
            ease: "power4.inOut",
          },
          "<",
        )
        .from(
          ".hero-stat",
          {
            y: 20,
            opacity: 0,
            stagger: 0.1,
            duration: 0.5,
            ease: "power3.out",
          },
          "-=0.3",
        );
    },
    { scope: containerRef },
  );

  const nameParts = profile.displayName.trim().toLocaleUpperCase("pl").split(/\s+/).filter(Boolean);
  const nameWords = nameParts.length > 1 ? [nameParts[0], nameParts.slice(1).join(" ")] : nameParts;

  return (
    <section ref={containerRef} className="grain relative bg-[#0a0a0a]">
      {/* ── SPLINE VIEWPORT ── */}
      <div className="relative h-[100svh] min-h-[520px] overflow-hidden sm:min-h-[600px] lg:h-screen">
        {/* Spline background */}
        <div
          className="spline-container absolute inset-0 z-0 w-full h-full"
          style={{
            willChange: "transform",
            transform: "translateZ(0)",
            contain: "strict",
          }}
        >
          <SplineScene />
        </div>

        {/* Fade and labels are kept along the bottom edge so the Spline scene stays visible and interactive. */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 z-[1]"
          style={{
            height: "38%",
            background:
              "linear-gradient(to top, rgba(10,10,10,0.99) 0%, rgba(10,10,10,0.84) 40%, rgba(10,10,10,0.3) 76%, transparent 100%)",
          }}
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2]">
          <div className="mx-auto max-w-7xl px-6 pb-7 sm:px-10 sm:pb-9 lg:px-12">
            <div className="hero-role grid gap-4 border-t border-white/20 pt-4 sm:pt-5 md:grid-cols-[1fr_auto] md:items-end md:gap-8">
              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="size-1.5 rounded-full bg-[#05dbf2] shadow-[0_0_12px_rgba(5,219,242,.7)]" />
                  <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#05dbf2] sm:text-[10px]">Projektowanie stron · Frontend development</span>
                  {profile.location && <span className="text-[9px] uppercase tracking-[0.14em] text-[#a8bdc3] sm:text-[10px]">/ {profile.location}</span>}
                </div>
                <p className="max-w-3xl text-base font-semibold leading-snug text-white drop-shadow-[0_2px_12px_rgba(0,0,0,.8)] sm:text-xl">
                  Strony internetowe i aplikacje webowe
                </p>
                <p className="mt-1.5 text-[11px] leading-relaxed text-[#d0dcdf] drop-shadow-[0_1px_8px_rgba(0,0,0,.9)] sm:text-xs">
                  Nowoczesne interfejsy, responsywny frontend i animacje GSAP.
                </p>
              </div>

              <div className="flex items-center justify-between gap-5 md:flex-col md:items-end md:pb-0.5">
                {profile.availability && (
                  <span className="inline-flex items-center gap-2 text-[9px] text-[#e0e9eb] drop-shadow-[0_1px_8px_rgba(0,0,0,.9)] sm:text-[10px]">
                    <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,.6)]" />
                    {profile.availability}
                  </span>
                )}
                <a href="#o-mnie" className="hero-scroll pointer-events-auto group inline-flex shrink-0 items-center gap-2 text-[9px] font-medium uppercase tracking-[0.17em] text-white drop-shadow-[0_1px_8px_rgba(0,0,0,.9)] transition-colors hover:text-[#05dbf2]">
                  Poznaj mnie
                  <ArrowRight size={13} className="rotate-90 text-[#05dbf2] transition-transform group-hover:translate-y-0.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="glow-line" />

      <div className="hero-heading relative z-[2] mx-auto w-full max-w-7xl px-6 pb-10 pt-14 sm:px-10 sm:pb-12 sm:pt-16 lg:px-12 lg:pt-20">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-16">
          <div>
            <div className="hero-role mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-[#05dbf2]" />
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#05dbf2]">Portfolio / {profile.location || "Creative development"}</span>
            </div>
            <h1 className="font-bold uppercase leading-[0.88] tracking-[-0.055em]">
              {nameWords.map((word) => (
                <span key={word} className="block overflow-hidden pb-1">
                  <span className="hero-word inline-block max-w-full break-words text-[clamp(2.2rem,7.5vw,6.8rem)]">{word}</span>
                </span>
              ))}
            </h1>
          </div>

          <div className="lg:pb-2">
            <p className="hero-desc max-w-xl text-sm leading-7 text-[#a8bdc3] sm:text-base sm:leading-8">
              {content.heroDescription}
            </p>
            <div className="hero-cta mt-6 flex flex-wrap gap-2">
              {["Next.js", "GSAP", "Three.js", "TypeScript"].map((tech) => (
                <span key={tech} className="rounded-full border border-white/10 bg-white/[0.025] px-3 py-1.5 text-[9px] uppercase tracking-[0.16em] text-[#a8bdc3]">{tech}</span>
              ))}
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button asChild className="hero-cta group h-11 rounded-full bg-[#05dbf2] px-5 font-semibold text-[#071014] hover:bg-[#7cecf7]">
                <Link href="/projects">Wybrane projekty <ArrowRight className="transition-transform group-hover:translate-x-1" /></Link>
              </Button>
              <Button asChild variant="outline" className="hero-cta h-11 rounded-full border-white/15 bg-white/[0.03] px-5 text-[#dce5e7] hover:border-[#05dbf2]/45 hover:bg-white/[0.06] hover:text-white">
                <Link href="/contact">Kontakt</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="hero-line mt-10 h-px bg-gradient-to-r from-[#05dbf2]/50 via-white/10 to-transparent sm:mt-12" />

        <div className="flex flex-wrap gap-x-10 gap-y-5 pt-6 sm:gap-x-16 sm:pt-8">
          {[
            { num: profile.experience, label: "Lata doświadczenia" },
            { num: profile.projectCount, label: "Projektów" },
            { num: profile.commitment, label: "Zaangażowania" },
          ].map((stat) => (
            <div key={stat.label} className="hero-stat">
              <p className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{stat.num}</p>
              <p className="mt-1 text-[9px] uppercase tracking-[0.17em] text-[#819399] sm:text-[10px]">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
