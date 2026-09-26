"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ExternalLink, Github } from "lucide-react";
import { useProjects } from "@/lib/firestore-hooks";
import { getTechnology, useTechnologies, type Technology } from "@/lib/technologies";

gsap.registerPlugin(ScrollTrigger);

export interface Project {
  id: string | number;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  year: string;
  link?: string;
  github?: string;
  featured?: boolean;
  accent: string;
  order?: number;
  imageUrl?: string;
  imagePath?: string;
  images?: ProjectImage[];
}

export interface ProjectImage {
  url: string;
  path?: string;
  name?: string;
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

const ProjectsSection = () => {
  const containerRef = useRef<HTMLElement>(null);
  const projects = useProjects(allProjects);
  const { technologies } = useTechnologies();
  const featuredProjects = projects.filter((project) => project.featured);

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
          once: true,
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
          once: true,
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
          once: true,
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
            <ProjectCard key={project.id} project={project} index={i} technologies={technologies} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ProjectCard = ({
  project,
  index,
  technologies,
}: {
  project: Project;
  index: number;
  technologies: Technology[];
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const rotateXRef = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const rotateYRef = useRef<ReturnType<typeof gsap.quickTo> | null>(null);

  const onEnter = () => {
    if (cardRef.current && !rotateXRef.current) {
      gsap.set(cardRef.current, { transformPerspective: 900 });
      rotateXRef.current = gsap.quickTo(cardRef.current, "rotateX", {
        duration: 0.25,
        ease: "power2.out",
      });
      rotateYRef.current = gsap.quickTo(cardRef.current, "rotateY", {
        duration: 0.25,
        ease: "power2.out",
      });
    }
    gsap.to(cardRef.current, {
      y: -10,
      borderColor: `${project.accent}40`,
      duration: 0.4,
      ease: "power2.out",
    });
    const glow = cardRef.current?.querySelector(".card-glow") ?? null;
    if (glow) gsap.to(glow, { opacity: 1, duration: 0.4 });
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    rotateXRef.current?.(-y * 10);
    rotateYRef.current?.(x * 10);
  };

  const onLeave = () => {
    gsap.to(cardRef.current, {
      y: 0,
      rotateX: 0,
      rotateY: 0,
      borderColor: "rgba(26,26,26,1)",
      duration: 0.5,
      ease: "power3.out",
    });
    const glow = cardRef.current?.querySelector(".card-glow") ?? null;
    if (glow) gsap.to(glow, { opacity: 0, duration: 0.4 });
  };

  return (
    <div
      ref={cardRef}
      className="project-card relative rounded-2xl bg-[#0d0d0d] border border-[#1a1a1a] overflow-hidden flex flex-col"
      onMouseEnter={onEnter}
      onMouseMove={onMouseMove}
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

      {(project.images?.[0]?.url || project.imageUrl) && (
        <div className="group relative aspect-[16/10] w-full overflow-hidden border-b border-[#1a1a1a] bg-[#080c0e]">
          <Image
            src={project.images?.[0]?.url || project.imageUrl || ""}
            alt={`Podgląd projektu ${project.title}`}
            fill
            unoptimized
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/35 to-transparent" />
        </div>
      )}

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
        >
          {project.description.replaceAll("&nbsp;", "\u00a0")}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-8">
          {project.tags.map((tag) => (
            <TechnologyBadge key={tag} name={tag} technologies={technologies} />
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
            <Link
              href={`/projects/${project.id}`}
              aria-label={`Zobacz szczegóły projektu ${project.title}`}
              title="Zobacz projekt"
              className="text-[#9bb6c1] transition-colors hover:text-[#05dbf2]"
            >
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

function TechnologyBadge({ name, technologies }: { name: string; technologies: Technology[] }) {
  const technology = getTechnology(name, technologies);
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-1 text-[10px] font-medium tracking-[0.1em] uppercase"
      style={{
        color: technology.color,
        borderColor: `${technology.color}45`,
        backgroundColor: `${technology.color}10`,
      }}
    >
      <span className="size-1.5 rounded-full" style={{ backgroundColor: technology.color }} />
      {name}
    </span>
  );
}

export { ProjectCard };
export default ProjectsSection;
