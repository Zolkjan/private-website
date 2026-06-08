"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const skills = [
  "React",
  "Next.js",
  "TypeScript",
  "GSAP",
  "Three.js",
  "Tailwind CSS",
  "Node.js",
  "Figma",
];

const AboutSection = () => {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Left column
      gsap.from(".about-label", {
        x: -30,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        },
      });

      gsap.from(".about-heading", {
        y: 50,
        opacity: 0,
        duration: 0.9,
        ease: "power4.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 72%",
        },
      });

      gsap.from(".about-text", {
        y: 25,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 65%",
        },
      });

      gsap.from(".about-skill-tag", {
        scale: 0.8,
        opacity: 0,
        duration: 0.4,
        stagger: 0.06,
        ease: "back.out(1.5)",
        scrollTrigger: {
          trigger: ".about-skills-grid",
          start: "top 80%",
        },
      });

      // Image / right panel reveal
      gsap.from(".about-image-panel", {
        x: 60,
        opacity: 0,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 68%",
        },
      });
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      id="o-mnie"
      className="section-padding relative bg-[#0a0a0a] overflow-hidden"
    >
      {/* Section number */}
      <span className="absolute top-12 right-8 text-[8rem] font-bold text-[#111] leading-none select-none pointer-events-none z-0">
        01
      </span>

      <div className="relative z-[1] max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left column */}
          <div>
            <div className="about-label flex items-center gap-3 mb-6">
              <span className="inline-block w-8 h-px bg-[#04b2d9]" />
              <span className="text-xs tracking-[0.4em] text-[#04b2d9] uppercase">
                O Mnie
              </span>
            </div>

            <h2 className="about-heading text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[0.95] uppercase tracking-tight mb-8">
              Tworzę z <span className="text-gradient">pasją</span>
              <br />i precyzją
            </h2>

            <p className="about-text text-[#9bb6c1] leading-relaxed mb-5 max-w-md">
              Jestem frontend developerem z&nbsp;zamiłowaniem do interaktywnych
              animacji i&nbsp;nowoczesnych interfejsów. Łączę technologię
              z&nbsp;designem, aby tworzyć wyjątkowe cyfrowe doświadczenia.
            </p>

            <p className="about-text text-[#9bb6c1] leading-relaxed mb-10 max-w-md">
              Specjalizuję się w&nbsp;React, Next.js i&nbsp;GSAP — narzędziach,
              które pozwalają mi budować strony, które nie tylko wyglądają
              świetnie, ale też zachwycają płynność animacji i&nbsp;interakcji.
            </p>

            {/* Skills tags */}
            <div className="about-skills-grid flex flex-wrap gap-2 mb-10">
              {skills.map((s) => (
                <span
                  key={s}
                  className="about-skill-tag px-4 py-2 border border-[rgba(5,219,242,0.2)] text-[#9bb6c1] text-xs tracking-[0.15em] uppercase rounded-full hover:border-[#04b2d9] hover:text-[#05dbf2] transition-all duration-300"
                >
                  {s}
                </span>
              ))}
            </div>

            <Link
              href="/about-me"
              className="about-text group inline-flex items-center gap-3 text-sm tracking-[0.2em] uppercase text-[#04b2d9] hover:text-[#05dbf2] transition-colors duration-300"
            >
              Więcej o mnie
              <ArrowRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-1.5"
              />
            </Link>
          </div>

          {/* Right column – decorative card */}
          <div className="about-image-panel relative">
            <div className="relative glass-card rounded-2xl p-8 overflow-hidden">
              {/* Glow blob */}
              <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-[#04b2d9] opacity-10 blur-3xl pointer-events-none" />

              <div className="grid grid-cols-2 gap-6">
                {[
                  { icon: "⚡", label: "Animacje", val: "GSAP / Motion" },
                  { icon: "🎨", label: "Design", val: "Figma / Framer" },
                  { icon: "⚙️", label: "Framework", val: "Next.js 15" },
                  { icon: "🌐", label: "3D & WebGL", val: "Three.js / Spline" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="p-5 rounded-xl bg-[#111] border border-[#1a1a1a] hover:border-[rgba(5,219,242,0.2)] transition-colors duration-300"
                  >
                    <div className="text-2xl mb-3">{item.icon}</div>
                    <p className="text-[10px] tracking-[0.2em] text-[#9bb6c1] uppercase mb-1">
                      {item.label}
                    </p>
                    <p className="text-sm font-medium text-[#e6f7fb]">
                      {item.val}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-[#1a1a1a] flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#04b2d9] to-[#0a8cbf] flex items-center justify-center text-[#0a0a0a] font-bold text-sm">
                  JŻ
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#e6f7fb]">
                    Jan Żółkiewski
                  </p>
                  <p className="text-xs text-[#9bb6c1]">Frontend Developer</p>
                </div>
                <div className="ml-auto flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs text-[#9bb6c1]">Dostępny</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
