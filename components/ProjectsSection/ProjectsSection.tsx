"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { ArrowRight, ExternalLink, Github } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export interface Project {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  year: string;
  link?: string;
  github?: string;
  featured?: boolean;
  accent: string;
}

export const allProjects: Project[] = [
  {
    id: 1,
    title: "CreativePath",
    subtitle: "Portfolio Website",
    description:
      "Moje osobiste portfolio — zbudowane z&nbsp;Next.js, GSAP i&nbsp;Spline 3D. Skupiam się na płynnych animacjach, niestandardowym kursorze i&nbsp;immersyjnym interfejsie.",
    tags: ["Next.js", "GSAP", "Spline", "TypeScript", "Tailwind"],
    year: "2025",
    accent: "#04b2d9",
    featured: true,
  },
  {
    id: 2,
    title: "NexaShop",
    subtitle: "E-commerce Platform",
    description:
      "Pełnoprawna platforma e-commerce z&nbsp;kartą produktów, koszykiem, płatnościami Stripe i&nbsp;panelem administracyjnym. Optymalizacja SEO i&nbsp;wydajności.",
    tags: ["Next.js", "TypeScript", "Stripe", "Prisma", "PostgreSQL"],
    year: "2024",
    accent: "#7c3aed",
    featured: true,
  },
  {
    id: 3,
    title: "MotionUI",
    subtitle: "Component Library",
    description:
      "Biblioteka komponentów React z&nbsp;wbudowanymi animacjami GSAP. Drag & drop, parallax, split-text, magnetic buttons — wszystko gotowe do użycia.",
    tags: ["React", "GSAP", "TypeScript", "Storybook"],
    year: "2024",
    accent: "#f59e0b",
    featured: true,
  },
  {
    id: 4,
    title: "DataPulse",
    subtitle: "Analytics Dashboard",
    description:
      "Interaktywny dashboard analityczny z&nbsp;wykresami w&nbsp;czasie rzeczywistym, zaawansowanymi filtrami i&nbsp;responsywnym layoutem.",
    tags: ["React", "D3.js", "Node.js", "WebSockets"],
    year: "2024",
    accent: "#10b981",
    featured: false,
  },
  {
    id: 5,
    title: "ArtVision",
    subtitle: "Creative Agency",
    description:
      "Strona agencji kreatywnej z&nbsp;intensywnym użyciem WebGL, animacji scroll-trigger i&nbsp;trójwymiarowych efektów tła.",
    tags: ["Next.js", "Three.js", "GSAP", "GLSL"],
    year: "2023",
    accent: "#ec4899",
    featured: false,
  },
  {
    id: 6,
    title: "Tasker",
    subtitle: "Project Manager App",
    description:
      "Aplikacja do zarządzania projektami z&nbsp;drag & drop, powiadomieniami w&nbsp;czasie rzeczywistym i&nbsp;integrację kalendarza.",
    tags: ["React", "TypeScript", "WebSockets", "Redux"],
    year: "2023",
    accent: "#f97316",
    featured: false,
  },
];

const featuredProjects = allProjects.filter((p) => p.featured);

const ProjectsSection = () => {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".projects-label", {
        x: -30,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        },
      });

      gsap.from(".projects-heading", {
        y: 50,
        opacity: 0,
        duration: 0.9,
        ease: "power4.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 72%",
        },
      });

      gsap.from(".project-card", {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".projects-grid",
          start: "top 80%",
        },
      });
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      id="projekty"
      className="section-padding relative bg-[#0a0a0a] overflow-hidden"
    >
      <span className="absolute top-12 right-8 text-[8rem] font-bold text-[#0f0f0f] leading-none select-none pointer-events-none">
        03
      </span>

      <div className="glow-line mb-0" />

      <div className="relative z-[1] max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16">
          <div>
            <div className="projects-label flex items-center gap-3 mb-6">
              <span className="inline-block w-8 h-px bg-[#04b2d9]" />
              <span className="text-xs tracking-[0.4em] text-[#04b2d9] uppercase">
                Projekty
              </span>
            </div>
            <h2 className="projects-heading text-[clamp(2.5rem,6vw,5rem)] font-bold leading-[0.95] uppercase tracking-tight">
              Wybrane <span className="text-gradient">prace</span>
            </h2>
          </div>

          <Link
            href="/projects"
            className="group inline-flex items-center gap-3 text-sm tracking-[0.2em] uppercase text-[#04b2d9] hover:text-[#05dbf2] transition-colors duration-300 mt-6 lg:mt-0"
          >
            Wszystkie projekty
            <ArrowRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-1.5"
            />
          </Link>
        </div>

        {/* Featured projects — large cards */}
        <div className="projects-grid grid lg:grid-cols-3 gap-6">
          {featuredProjects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ProjectCard = ({
  project,
  index,
}: {
  project: Project;
  index: number;
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const onEnter = () => {
    gsap.to(cardRef.current, {
      y: -8,
      borderColor: `${project.accent}40`,
      duration: 0.4,
      ease: "power2.out",
    });
    gsap.to(cardRef.current?.querySelector(".card-glow"), {
      opacity: 1,
      duration: 0.4,
    });
  };

  const onLeave = () => {
    gsap.to(cardRef.current, {
      y: 0,
      borderColor: "rgba(26,26,26,1)",
      duration: 0.4,
      ease: "power2.out",
    });
    gsap.to(cardRef.current?.querySelector(".card-glow"), {
      opacity: 0,
      duration: 0.4,
    });
  };

  return (
    <div
      ref={cardRef}
      className="project-card relative rounded-2xl bg-[#0d0d0d] border border-[#1a1a1a] overflow-hidden transition-colors duration-400 flex flex-col"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {/* Glow blob */}
      <div
        className="card-glow absolute -top-20 -right-20 w-52 h-52 rounded-full blur-3xl opacity-0 pointer-events-none"
        style={{ backgroundColor: project.accent }}
      />

      {/* Header bar */}
      <div
        className="h-1 w-full"
        style={{
          background: `linear-gradient(to right, ${project.accent}, transparent)`,
        }}
      />

      <div className="relative z-[1] p-8 flex flex-col flex-1">
        {/* Index */}
        <span className="text-xs tracking-[0.3em] text-[#9bb6c1] mb-6 block">
          {String(index + 1).padStart(2, "0")}
        </span>

        {/* Title */}
        <h3 className="text-2xl font-bold text-[#e6f7fb] mb-1 leading-tight">
          {project.title}
        </h3>
        <p
          className="text-xs tracking-[0.2em] uppercase mb-5 font-medium"
          style={{ color: project.accent }}
        >
          {project.subtitle}
        </p>

        <p
          className="text-sm text-[#9bb6c1] leading-relaxed mb-8 flex-1"
          dangerouslySetInnerHTML={{ __html: project.description }}
        />

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-[10px] tracking-[0.15em] uppercase text-[#9bb6c1] border border-[#1a1a1a] rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Links */}
        <div className="flex items-center justify-between pt-4 border-t border-[#1a1a1a]">
          <span className="text-xs text-[#9bb6c1]">{project.year}</span>
          <div className="flex gap-3">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#9bb6c1] hover:text-[#e6f7fb] transition-colors"
              >
                <Github size={16} />
              </a>
            )}
            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#9bb6c1] hover:text-[#05dbf2] transition-colors"
              >
                <ExternalLink size={16} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export { ProjectCard };
export default ProjectsSection;
