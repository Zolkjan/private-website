"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Card } from "@/components/ui/card";

gsap.registerPlugin(ScrollTrigger);

const techStack = [
  { name: "React", color: "#61DAFB" },
  { name: "Next.js", color: "#ffffff" },
  { name: "TypeScript", color: "#3178C6" },
  { name: "JavaScript", color: "#F7DF1E" },
  { name: "GSAP", color: "#88CE02" },
  { name: "Three.js", color: "#ffffff" },
  { name: "Tailwind CSS", color: "#06B6D4" },
  { name: "Node.js", color: "#339933" },
  { name: "Python", color: "#3776AB" },
  { name: "Figma", color: "#F24E1E" },
  { name: "Git", color: "#F05032" },
  { name: "Spline", color: "#04b2d9" },
];

const categories = [
  {
    title: "Frontend",
    items: ["React", "Next.js", "TypeScript", "JavaScript", "HTML & CSS"],
  },
  {
    title: "Animacje",
    items: ["GSAP", "Framer Motion", "CSS Animations", "Three.js", "Spline"],
  },
  {
    title: "Narzędzia",
    items: ["Figma", "Git / GitHub", "VS Code", "Vercel", "Node.js"],
  },
];

const SkillsSection = () => {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // Heading reveal
      gsap.from(".skills-label", {
        x: -30,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
          once: true,
        },
      });

      gsap.from(".skills-heading", {
        y: 50,
        opacity: 0,
        duration: 0.9,
        ease: "power4.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 72%",
          once: true,
        },
      });

      // Category cards stagger
      gsap.from(".skills-category", {
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: "power3.out",
        onComplete() {
          gsap.set(".skills-category", { clearProps: "y,opacity" });
        },
        scrollTrigger: {
          trigger: ".skills-grid",
          start: "top 78%",
          once: true,
        },
      });

      // Tech pill stagger
      gsap.from(".tech-pill", {
        scale: 0.7,
        opacity: 0,
        duration: 0.4,
        stagger: 0.04,
        ease: "back.out(1.8)",
        onComplete() {
          // Clear inline GSAP transforms so pills don’t create separate GPU layers
          // inside the will-change:transform marquee container
          gsap.set(".tech-pill", { clearProps: "scale,opacity,transform" });
        },
        scrollTrigger: {
          trigger: ".tech-marquee-wrap",
          start: "top 85%",
          once: true,
        },
      });

    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      id="umiejetnosci"
      className="section-padding relative bg-[#050505] overflow-hidden"
    >
      {/* Section number */}
      <span className="absolute top-12 right-8 text-[8rem] font-bold text-[#0f0f0f] leading-none select-none pointer-events-none">
        02
      </span>

      <div className="glow-line mb-0" />

      <div className="relative z-[1] max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16">
          <div>
            <div className="skills-label flex items-center gap-3 mb-6">
              <span className="inline-block w-8 h-px bg-[#04b2d9]" />
              <span className="text-xs tracking-[0.4em] text-[#04b2d9] uppercase">
                Umiejętności
              </span>
            </div>
            <h2 className="skills-heading text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[0.95] uppercase tracking-tight">
              Mój <span className="text-gradient">stack</span>
              <br />
              technologiczny
            </h2>
          </div>

          <p className="text-[#9bb6c1] max-w-xs leading-relaxed mt-6 lg:mt-0 text-sm">
            Narzędzia i&nbsp;technologie, których używam na co dzień, aby
            budować szybkie, piękne i&nbsp;interaktywne strony.
          </p>
        </div>

        {/* Categories grid */}
        <div className="skills-grid grid md:grid-cols-3 gap-6 mb-16">
          {categories.map((cat) => (
            <Card
              key={cat.title}
              className="skills-category glass-card group gap-0 rounded-2xl p-8"
            >
              <h3 className="text-xs tracking-[0.3em] uppercase text-[#04b2d9] mb-5 group-hover:text-[#05dbf2] transition-colors duration-300">
                {cat.title}
              </h3>
              <ul className="space-y-0 divide-y divide-white/[0.07]">
                {cat.items.map((item, idx) => (
                  <li key={item} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                    <span className="font-mono text-[10px] tabular-nums text-[#55717a]">0{idx + 1}</span>
                    <span className="text-sm font-medium text-[#e6f7fb]">{item}</span>
                    <span className="ml-auto size-1.5 rounded-full bg-[#05dbf2]/70 shadow-[0_0_10px_rgba(5,219,242,.35)]" />
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>

        {/* Tech pill marquee */}
        <div className="tech-marquee-wrap relative overflow-hidden py-4">
          <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-[#050505] to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-[#050505] to-transparent pointer-events-none" />
          <div className="flex gap-4 animate-marquee w-max">
            {[...techStack, ...techStack].map((tech, i) => (
              <span
                key={i}
                className="tech-pill flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#1a1a1a] bg-[#0d0d0d] text-sm whitespace-nowrap text-[#9bb6c1] hover:border-[rgba(5,219,242,0.3)] hover:text-[#e6f7fb] transition-colors duration-300"
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: tech.color }}
                />
                {tech.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
