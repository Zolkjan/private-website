"use client";

import { useRef } from "react";
import Link from "next/link";
import { PortfolioImage } from "@/components/PortfolioImage";
import { useSectionReveal } from "@/lib/use-section-reveal";
import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink, Github } from "lucide-react";
import { useProjects } from "@/lib/firestore-hooks";
import { getTechnology, useTechnologies, type Technology } from "@/lib/technologies";
import { Card } from "@/components/ui/card";
import { getProjectCategory, type ProjectCategoryId } from "@/lib/project-categories";
export interface Project {
  id: string | number;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  category?: ProjectCategoryId;
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
    category: "websites",
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
    category: "ecommerce",
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
    category: "ui-motion",
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
    category: "web-apps",
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
    category: "websites",
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
    category: "web-apps",
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
  const featured = projects.filter((project) => project.featured);
  const featuredProjects = (featured.length ? featured : projects).slice(0, 3);
  useSectionReveal(containerRef);

  return (
    <section ref={containerRef} id="projekty" className="section-padding">
      <div className="site-container">
        <div data-reveal className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div><p className="section-eyebrow">Wybrane projekty</p><h2 className="section-heading">Pomysły zamienione w działanie.</h2></div>
          <Button asChild variant="link" className="h-auto shrink-0 justify-start p-0 text-[#67dbe8]">
            <Link href="/projects">Wszystkie projekty <ArrowRight /></Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} technologies={technologies} />
          ))}
        </div>
        {featuredProjects.length === 0 && <p className="readable-copy">Nowe realizacje pojawią się tutaj wkrótce.</p>}
      </div>
    </section>
  );
};

const ProjectCard = ({ project, index, technologies }: { project: Project; index: number; technologies: Technology[] }) => {
  const image = project.images?.[0]?.url || project.imageUrl;
  return (
    <Card className="project-card group gap-0 overflow-hidden rounded-2xl border-white/10 bg-[#10171b] py-0 shadow-none transition-colors hover:border-white/25">
      <Link href={`/projects/${project.id}`} tabIndex={-1} aria-hidden="true" className="relative block aspect-[4/3] overflow-hidden border-b border-white/10 bg-[#16232c]">
        {image ? (
          <PortfolioImage src={image} alt={`Podgląd projektu ${project.title}`} fill
            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 390px"
            className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.025]" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden" style={{ background: `linear-gradient(135deg, ${project.accent}20, #0b1218)` }}>
            <div className="absolute h-[125%] w-[90%] rotate-[-30deg] rounded-[50%] border border-white/10" />
            <div className="absolute size-40 rotate-45 rounded-3xl border" style={{ borderColor: `${project.accent}60` }} />
            <span className="relative text-5xl font-semibold tracking-tighter text-white/85">{project.title.slice(0, 2)}</span>
            <span className="absolute bottom-5 left-5 text-[10px] uppercase tracking-[0.2em] text-white/45">{project.subtitle}</span>
          </div>
        )}
        <span className="absolute right-4 top-4 rounded-full bg-black/55 px-3 py-1.5 text-xs text-white">{project.year}</span>
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-baseline justify-between gap-4">
          <h3 className="text-xl font-semibold tracking-tight">
            <Link href={`/projects/${project.id}`} className="transition-colors hover:text-[#67dbe8]">{project.title}</Link>
          </h3>
          <span className="text-xs tabular-nums text-[#70818c]">{String(index + 1).padStart(2, "0")}</span>
        </div>
        <p className="mb-2 text-xs text-[#67dbe8]">{getProjectCategory(project).projectLabel}</p>
        <p className="mb-5 line-clamp-2 text-sm leading-6 text-[#aebbc3]">{project.description.replaceAll("&nbsp;", " ")}</p>
        <div className="mb-6 flex flex-wrap items-center gap-2" aria-label="Technologie projektu">
          {project.tags.length > 0 && <span className="w-full text-[11px] text-[#82939e]">Technologie</span>}
          {project.tags.slice(0, 3).map((tag) => <TechnologyBadge key={tag} name={tag} technologies={technologies} />)}
          {project.tags.length > 3 && <span className="text-xs text-[#82939e]" aria-label={`Jeszcze ${project.tags.length - 3} technologie w szczegółach projektu`}>+{project.tags.length - 3}</span>}
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-4">
          <Link href={`/projects/${project.id}`} className="inline-flex min-h-8 items-center gap-2 text-sm text-white hover:text-[#67dbe8]" aria-label={`Zobacz projekt ${project.title}`}>Zobacz projekt <ArrowRight size={15} /></Link>
          <div className="flex gap-1">
            {project.github && <Button asChild size="icon" variant="ghost"><a href={project.github} target="_blank" rel="noopener noreferrer" aria-label={`Kod projektu ${project.title}`}><Github size={16} /></a></Button>}
            {project.link && <Button asChild size="icon" variant="ghost"><a href={project.link} target="_blank" rel="noopener noreferrer" aria-label={`Otwórz stronę ${project.title}`}><ExternalLink size={16} /></a></Button>}
          </div>
        </div>
      </div>
    </Card>
  );
};

function TechnologyBadge({ name, technologies }: { name: string; technologies: Technology[] }) {
  const technology = getTechnology(name, technologies);
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-[#aebbc3]">
      <span className="size-1 rounded-full" style={{ backgroundColor: technology.color }} />{name}
    </span>
  );
}

export { ProjectCard };
export default ProjectsSection;
