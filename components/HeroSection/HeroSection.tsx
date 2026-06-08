"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";

const Spline = dynamic(() => import("@splinetool/react-spline"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#0a0a0a]" aria-hidden="true" />
  ),
});

gsap.registerPlugin(ScrollTrigger);

const HeroSection = () => {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ delay: 0.2 });

      // Word-by-word fade-up reveal
      tl.from(".hero-word", {
        y: 60,
        opacity: 0,
        duration: 1.0,
        stagger: 0.15,
        ease: "power4.out",
      })
        .from(
          ".hero-role",
          { y: 20, opacity: 0, duration: 0.7, ease: "power3.out" },
          "-=0.6",
        )
        .from(
          ".hero-desc",
          { y: 20, opacity: 0, duration: 0.7, ease: "power3.out" },
          "-=0.4",
        )
        .from(
          ".hero-cta",
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
            stagger: 0.12,
            ease: "power3.out",
          },
          "-=0.4",
        )
        .from(".hero-scroll", { opacity: 0, duration: 0.6 }, "-=0.2")
        .from(
          ".hero-line",
          { scaleX: 0, duration: 1.4, ease: "power4.inOut" },
          0,
        );

      // Note: Spline parallax removed — ScrollTrigger scrub + WebGL RAF caused frame drops
    },
    { scope: containerRef },
  );

  const nameWords = ["JAN", "ŻÓŁKIEWSKI"];

  return (
    <section
      ref={containerRef}
      className="grain relative bg-[#0a0a0a]"
    >
      {/* ── SPLINE VIEWPORT ── */}
      <div className="relative h-screen overflow-hidden flex flex-col justify-between">
        {/* Spline background */}
        <div
          className="spline-container absolute inset-0 z-0 w-full h-full"
          style={{
            willChange: "transform",
            transform: "translateZ(0)",
            contain: "strict",
          }}
        >
          <Spline
            scene="https://prod.spline.design/jTqzWip9Z57AcMU7/scene.splinecode"
            style={{ width: "100%", height: "100%" }}
          />
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
        <div className="relative z-[2] flex justify-center pt-28 sm:pt-32 px-4">
          <div className="hero-role flex items-center gap-3">
            <span className="hidden sm:inline-block w-8 h-px bg-[#04b2d9]" />
            <span className="text-[10px] sm:text-xs tracking-[0.35em] text-[#04b2d9] uppercase font-medium text-center">
              Frontend Developer &amp; Creative Coder
            </span>
            <span className="hidden sm:inline-block w-8 h-px bg-[#04b2d9]" />
          </div>
        </div>

        {/* Spacer — pushes heading to bottom */}
        <div className="flex-1" />

        {/* ── BOTTOM: big centered heading overlaying legs ── */}
        <div className="relative z-[2] w-full px-4 pb-16 sm:pb-20 text-center">
          <h1 className="font-bold leading-[0.85] tracking-tight uppercase">
            {nameWords.map((word) => (
              <div key={word}>
                <span className="hero-word inline-block whitespace-nowrap text-[clamp(2.2rem,8vw,7.5rem)]">
                  {word}
                </span>
              </div>
            ))}
            <div>
              <span className="hero-word inline-block whitespace-nowrap text-[clamp(2.2rem,8vw,7.5rem)] text-gradient glow-text">
                PORTFOLIO
              </span>
            </div>
          </h1>
        </div>

        {/* Scroll indicator */}
        <div className="hero-scroll absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-[3]">
          <span className="text-[10px] tracking-[0.4em] text-[#9bb6c1] uppercase">
            Scroll
          </span>
          <ChevronDown size={16} className="text-[#04b2d9] animate-bounce-slow" />
        </div>
      </div>

      {/* ── BELOW SPLINE: description, CTAs, stats ── */}
      <div className="relative z-[2] w-full max-w-7xl mx-auto px-6 lg:px-12 py-16 sm:py-20">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-10 sm:gap-16">
          {/* Description */}
          <p className="hero-desc text-[#9bb6c1] text-base sm:text-lg max-w-md leading-relaxed">
            Tworzę cyfrowe doświadczenia, które łączą nowoczesny design
            z&nbsp;zaawansowanymi animacjami i&nbsp;perfekcyjnym kodem.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 sm:flex-shrink-0">
            <Link
              href="/projects"
              className="hero-cta group flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-[#04b2d9] text-[#0a0a0a] font-bold text-xs sm:text-sm tracking-[0.2em] uppercase rounded-full hover:bg-[#05dbf2] transition-colors duration-300 glow-sm"
            >
              MOJE PROJEKTY
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
            <Link
              href="/contact"
              className="hero-cta group flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 border border-[rgba(5,219,242,0.3)] text-[#e6f7fb] font-bold text-xs sm:text-sm tracking-[0.2em] uppercase rounded-full hover:border-[#04b2d9] hover:text-[#05dbf2] transition-all duration-300"
            >
              KONTAKT
            </Link>
          </div>
        </div>

        {/* Stats row */}
        <div className="hero-role flex flex-wrap gap-8 sm:gap-12 pt-10 mt-10 border-t border-[rgba(255,255,255,0.08)]">
          {[
            { num: "3+", label: "Lata doświadczenia" },
            { num: "20+", label: "Projektów" },
            { num: "100%", label: "Zaangażowania" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-3xl sm:text-4xl font-bold text-gradient">{stat.num}</p>
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
