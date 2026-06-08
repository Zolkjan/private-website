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

      // Parallax on scroll
      gsap.to(".spline-container", {
        y: 120,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    },
    { scope: containerRef },
  );

  const nameWords = ["JAN", "ŻÓŁKIEWSKI"];

  return (
    <section
      ref={containerRef}
      className="grain relative min-h-screen flex items-center overflow-hidden bg-[#0a0a0a]"
    >
      {/* ── FULL-WIDTH Spline background ── */}
      <div className="spline-container absolute inset-0 z-0 w-full h-full">
        <Spline
          scene="https://prod.spline.design/jTqzWip9Z57AcMU7/scene.splinecode"
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* Gradient veil — left side only, so Spline remains visible on the right */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.75) 40%, rgba(10,10,10,0.25) 65%, transparent 100%)",
        }}
      />
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 z-[1] bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none" />

      {/* Decorative horizontal line */}
      <div
        className="hero-line absolute left-0 right-0 top-1/2 h-px z-[1] origin-left pointer-events-none"
        style={{
          background:
            "linear-gradient(to right, transparent, rgba(5,219,242,0.1) 30%, rgba(5,219,242,0.04) 70%, transparent)",
        }}
      />

      {/* ── Text content — overlaid on left ── */}
      <div className="relative z-[2] w-full max-w-7xl mx-auto px-6 lg:px-12 pt-32 pb-24">
        {/* Pre-title badge */}
        <div className="hero-role flex items-center gap-3 mb-8">
          <span className="inline-block w-8 h-px bg-[#04b2d9]" />
          <span className="text-xs tracking-[0.4em] text-[#04b2d9] uppercase font-medium">
            Frontend Developer & Creative Coder
          </span>
        </div>

        {/* Main heading — word-by-word fade-up reveal */}
        <h1 className="text-[clamp(2.2rem,7vw,8rem)] font-bold leading-[0.9] tracking-tight uppercase mb-4">
          {nameWords.map((word) => (
            <div key={word}>
              <span className="hero-word inline-block whitespace-nowrap">
                {word}
              </span>
            </div>
          ))}
          <div>
            <span className="hero-word inline-block whitespace-nowrap text-gradient glow-text">
              PORTFOLIO
            </span>
          </div>
        </h1>

        {/* Description — narrow */}
        <p className="hero-desc text-[#9bb6c1] text-lg max-w-sm leading-relaxed mb-10 mt-8">
          Tworzę cyfrowe doświadczenia, które łączą nowoczesny design
          z&nbsp;zaawansowanymi animacjami i&nbsp;perfekcyjnym kodem.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-4 mb-16">
          <Link
            href="/projects"
            className="hero-cta group flex items-center gap-3 px-8 py-4 bg-[#04b2d9] text-[#0a0a0a] font-bold text-sm tracking-[0.2em] uppercase rounded-full hover:bg-[#05dbf2] transition-colors duration-300 glow-sm"
          >
            MOJE PROJEKTY
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
          <Link
            href="/contact"
            className="hero-cta group flex items-center gap-3 px-8 py-4 border border-[rgba(5,219,242,0.3)] text-[#e6f7fb] font-bold text-sm tracking-[0.2em] uppercase rounded-full hover:border-[#04b2d9] hover:text-[#05dbf2] transition-all duration-300"
          >
            KONTAKT
          </Link>
        </div>

        {/* Stats row */}
        <div className="hero-role flex flex-wrap gap-10 pt-8 border-t border-[rgba(255,255,255,0.08)] max-w-lg">
          {[
            { num: "3+", label: "Lata doświadczenia" },
            { num: "20+", label: "Projektów" },
            { num: "100%", label: "Zaangażowania" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-4xl font-bold text-gradient">{stat.num}</p>
              <p className="text-xs tracking-[0.2em] text-[#9bb6c1] uppercase mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-[2]">
        <span className="text-[10px] tracking-[0.4em] text-[#9bb6c1] uppercase">
          Scroll
        </span>
        <ChevronDown size={16} className="text-[#04b2d9] animate-bounce-slow" />
      </div>
    </section>
  );
};

export default HeroSection;
