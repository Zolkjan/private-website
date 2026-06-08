"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

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
        },
      });

      // Category cards stagger
      gsap.from(".skills-category", {
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".skills-grid",
          start: "top 78%",
        },
      });

      // Tech pill stagger
      gsap.from(".tech-pill", {
        scale: 0.7,
        opacity: 0,
        duration: 0.4,
        stagger: 0.04,
        ease: "back.out(1.8)",
        scrollTrigger: {
          trigger: ".tech-marquee-wrap",
          start: "top 85%",
        },
      });

      // Animated progress bars
      gsap.from(".skill-bar-fill", {
        scaleX: 0,
        duration: 1.2,
        stagger: 0.08,
        ease: "power3.inOut",
        transformOrigin: "left center",
        scrollTrigger: {
          trigger: ".skills-grid",
          start: "top 70%",
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
            <div
              key={cat.title}
              className="skills-category glass-card rounded-2xl p-8 hover:border-[rgba(5,219,242,0.2)] transition-all duration-400 group"
            >
              <h3 className="text-xs tracking-[0.3em] uppercase text-[#04b2d9] mb-6 group-hover:text-[#05dbf2] transition-colors duration-300">
                {cat.title}
              </h3>
              <ul className="space-y-4">
                {cat.items.map((item, idx) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1.5">
                        <span className="text-sm text-[#e6f7fb] font-medium">
                          {item}
                        </span>
                        <span className="text-xs text-[#9bb6c1]">
                          {[95, 90, 88, 80, 75][idx] || 80}%
                        </span>
                      </div>
                      <div className="h-px bg-[#1a1a1a] rounded-full overflow-hidden">
                        <div
                          className="skill-bar-fill h-full rounded-full origin-left"
                          style={{
                            width: `${[95, 90, 88, 80, 75][idx] || 80}%`,
                            background:
                              "linear-gradient(to right, #04b2d9, #05dbf2)",
                          }}
                        />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
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
                className="tech-pill flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#1a1a1a] bg-[#0d0d0d] text-sm whitespace-nowrap text-[#9bb6c1] hover:border-[rgba(5,219,242,0.3)] hover:text-[#e6f7fb] transition-all duration-300"
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
