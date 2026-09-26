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
      <div className="relative h-screen overflow-hidden">
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

        {/* Bottom gradient — covers legs area */}
        <div
          className="absolute bottom-0 left-0 right-0 z-[1] pointer-events-none"
          style={{
            height: "45%",
            background:
              "linear-gradient(to top, rgba(10,10,10,1) 0%, rgba(10,10,10,0.85) 40%, transparent 100%)",
          }}
        />
        {/* Top fade */}
        <div className="absolute top-0 left-0 right-0 h-32 z-[1] bg-gradient-to-b from-[#0a0a0a] to-transparent pointer-events-none" />

        {/* ── TOP: role badge centered ── */}
        <div className="absolute top-0 left-0 right-0 z-[2] flex justify-center pt-28 sm:pt-32 px-4">
          <div className="hero-role animate-float flex items-center gap-3">
            <span className="hidden sm:inline-block w-8 h-px bg-[#04b2d9]" />
            <span className="text-[10px] sm:text-xs tracking-[0.35em] text-[#04b2d9] uppercase font-medium text-center">
              {profile.role}
            </span>
            <span className="hidden sm:inline-block w-8 h-px bg-[#04b2d9]" />
          </div>
        </div>

        {/* Scroll indicator — mouse icon */}
        <div className="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-[3]">
          <span className="text-[9px] tracking-[0.5em] text-[#9bb6c1] uppercase">
            Scroll
          </span>
          <div className="w-5 h-8 rounded-full border border-[rgba(5,219,242,0.45)] flex justify-center pt-1.5">
            <span className="w-0.5 h-2 rounded-full bg-[#04b2d9] animate-bounce-slow block" />
          </div>
        </div>
      </div>

      {/* ── BELOW SPLINE ── */}
      <div className="glow-line" />

      {/* Big heading */}
      <div className="hero-heading relative z-[2] w-full px-4 pt-16 sm:pt-20 pb-4 text-center">
        <h1 className="font-bold leading-[0.85] tracking-tight uppercase">
          {nameWords.map((word) => (
            <div key={word}>
              <span className="hero-word inline-block whitespace-nowrap text-[clamp(2.2rem,8vw,7.5rem)]">
                {word}
              </span>
            </div>
          ))}
          <div>
            <span className="hero-word inline-block whitespace-nowrap text-[clamp(2.2rem,8vw,7.5rem)] text-shimmer glow-text">
              PORTFOLIO
            </span>
          </div>
        </h1>
      </div>

      <div className="relative z-[2] w-full max-w-7xl mx-auto px-6 lg:px-12 py-12 sm:py-16">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-10 lg:gap-20">
          {/* Description + tech badges */}
          <div className="max-w-lg">
            <p className="hero-desc text-[#9bb6c1] text-base sm:text-lg leading-relaxed mb-6">
              {content.heroDescription}
            </p>
            <div className="flex flex-wrap gap-2">
              {["Next.js 15", "GSAP", "Three.js", "TypeScript"].map((tech) => (
                <span
                  key={tech}
                  className="hero-cta text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 rounded-full border border-[rgba(5,219,242,0.15)] text-[#9bb6c1] hover:border-[rgba(5,219,242,0.4)] hover:text-[#e6f7fb] transition-colors duration-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 lg:flex-col lg:items-start flex-shrink-0">
            <Link
              href="/projects"
              className="hero-cta group flex items-center gap-3 px-8 py-4 bg-[#04b2d9] text-[#0a0a0a] font-bold text-xs tracking-[0.2em] uppercase rounded-full hover:bg-[#05dbf2] transition-colors duration-150 glow-sm"
            >
              MOJE PROJEKTY
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
            <Link
              href="/contact"
              className="hero-cta group flex items-center gap-3 px-8 py-4 border border-[rgba(5,219,242,0.3)] text-[#e6f7fb] font-bold text-xs tracking-[0.2em] uppercase rounded-full hover:border-[#04b2d9] hover:text-[#05dbf2] transition-[border-color,color] duration-150"
            >
              KONTAKT
            </Link>
          </div>
        </div>

        {/* Animated separator */}
        <div
          className="hero-line mt-12 h-px"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(255,255,255,0.08) 50%, transparent)",
          }}
        />

        {/* Stats */}
        <div className="flex flex-wrap gap-8 sm:gap-16 pt-10">
          {[
            { num: profile.experience, label: "Lata doświadczenia" },
            { num: profile.projectCount, label: "Projektów" },
            { num: profile.commitment, label: "Zaangażowania" },
          ].map((stat) => (
            <div key={stat.label} className="hero-stat">
              <p className="text-3xl sm:text-4xl font-bold text-gradient">
                {stat.num}
              </p>
              <p className="text-xs tracking-[0.2em] text-[#9bb6c1] uppercase mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
