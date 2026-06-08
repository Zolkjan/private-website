"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import {
  allProjects,
  ProjectCard,
  type Project,
} from "@/components/ProjectsSection/ProjectsSection";

gsap.registerPlugin(ScrollTrigger);

const allTags = [
  "Wszystkie",
  "Next.js",
  "React",
  "GSAP",
  "Three.js",
  "TypeScript",
];

export default function ProjectsPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [activeTag, setActiveTag] = useState("Wszystkie");

  const filtered: Project[] =
    activeTag === "Wszystkie"
      ? allProjects
      : allProjects.filter((p) => p.tags.includes(activeTag));

  useGSAP(
    () => {
      const tl = gsap.timeline({ delay: 0.1 });
      tl.from(".page-hero-label", {
        x: -30,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      }).from(
        ".page-hero-title",
        { y: 80, opacity: 0, duration: 1, ease: "power4.out" },
        "-=0.3",
      );
    },
    { scope: pageRef },
  );

  // Re-animate cards when filter changes
  const gridRef = useRef<HTMLDivElement>(null);
  const onFilterChange = (tag: string) => {
    setActiveTag(tag);
    if (gridRef.current) {
      gsap.from(gridRef.current.querySelectorAll(".project-card"), {
        y: 30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: "power3.out",
      });
    }
  };

  return (
    <div ref={pageRef} className="min-h-screen bg-[#0a0a0a]">
      <div className="pt-32 pb-0 max-w-7xl mx-auto px-6 lg:px-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs tracking-[0.3em] text-[#9bb6c1] uppercase hover:text-[#04b2d9] transition-colors duration-300 mb-16"
        >
          <ArrowLeft size={12} />
          Powrót
        </Link>

        {/* Page hero */}
        <div className="mb-16">
          <div className="page-hero-label flex items-center gap-3 mb-6">
            <span className="inline-block w-8 h-px bg-[#04b2d9]" />
            <span className="text-xs tracking-[0.4em] text-[#04b2d9] uppercase">
              Portfolio
            </span>
          </div>
          <h1 className="page-hero-title text-[clamp(3rem,9vw,8rem)] font-bold leading-[0.9] uppercase tracking-tight mb-6">
            Moje <span className="text-gradient">Projekty</span>
          </h1>
          <p className="text-[#9bb6c1] text-lg max-w-lg leading-relaxed">
            Wybrane prace z&nbsp;zakresu web developmentu, animacji i&nbsp;
            interaktywnych doświadczeń cyfrowych.
          </p>
        </div>

        {/* Filter tags */}
        <div className="flex flex-wrap gap-3 mb-12">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => onFilterChange(tag)}
              className={`px-5 py-2 text-xs tracking-[0.15em] uppercase rounded-full border transition-all duration-300 ${
                activeTag === tag
                  ? "border-[#04b2d9] text-[#05dbf2] bg-[rgba(5,219,242,0.08)]"
                  : "border-[#1a1a1a] text-[#9bb6c1] hover:border-[rgba(5,219,242,0.3)] hover:text-[#e6f7fb]"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="glow-line" />

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-[#9bb6c1] py-20">
            Brak projektów dla wybranego filtra.
          </p>
        )}
      </div>

      {/* CTA */}
      <div className="glow-line" />
      <div className="section-padding max-w-7xl mx-auto px-6 lg:px-12 text-center">
        <p className="text-xs tracking-[0.4em] text-[#04b2d9] uppercase mb-4">
          Masz projekt?
        </p>
        <h2 className="text-[clamp(2rem,4vw,3.5rem)] font-bold uppercase tracking-tight mb-8">
          Porozmawiajmy o&nbsp;<span className="text-gradient">współpracy</span>
        </h2>
        <Link
          href="/contact"
          className="inline-flex items-center gap-3 px-10 py-4 bg-[#04b2d9] text-[#0a0a0a] font-bold text-sm tracking-[0.25em] uppercase rounded-full hover:bg-[#05dbf2] transition-colors duration-300 glow-sm"
        >
          Skontaktuj się
        </Link>
      </div>

      <p className="text-center text-xs text-[#9bb6c1]/30 pb-8 tracking-widest uppercase">
        © {new Date().getFullYear()} Jan Żółkiewski — CreativePath
      </p>
    </div>
  );
}
