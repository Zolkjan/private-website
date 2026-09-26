"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { doc, onSnapshot } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, Github, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { allProjects, type Project, type ProjectImage } from "@/components/ProjectsSection/ProjectsSection";
import { db } from "@/lib/firebase";
import { getTechnology, useTechnologies } from "@/lib/technologies";

export default function ProjectDetails({ projectId }: { projectId: string }) {
  const router = useRouter();
  const fallbackProject = allProjects.find((item) => String(item.id) === projectId) ?? null;
  const [project, setProject] = useState<Project | null>(fallbackProject);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const { technologies } = useTechnologies();
  const containerRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }
    return onSnapshot(
      doc(db, "projects", projectId),
      (snapshot) => {
        if (!snapshot.exists()) {
          setProject(null);
        } else {
          const data = snapshot.data() as Omit<Project, "id">;
          setProject({ ...data, id: snapshot.id });
        }
        setActiveIndex(0);
        setLoading(false);
      },
      () => {
        setProject(fallbackProject);
        setLoading(false);
      },
    );
  }, [fallbackProject, projectId]);

  const images: ProjectImage[] = project?.images?.length
    ? project.images
    : project?.imageUrl
      ? [{ url: project.imageUrl, path: project.imagePath }]
      : [];
  const activeImage = images[activeIndex];

  useGSAP(
    () => {
      if (loading || !project) return;
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".detail-back", { x: -16, opacity: 0, duration: 0.45 })
        .from(".detail-heading", { y: 26, opacity: 0, duration: 0.65 }, "-=0.2")
        .from(".detail-gallery", { y: 24, opacity: 0, duration: 0.7 }, "-=0.25")
        .from(".detail-copy", { y: 20, opacity: 0, duration: 0.6 }, "-=0.25");
    },
    { scope: containerRef, dependencies: [loading, project?.id], revertOnUpdate: true },
  );

  useGSAP(
    () => {
      if (loading || !project || !imageRef.current) return;
      gsap.fromTo(
        imageRef.current,
        { autoAlpha: 0.35, scale: 1.025 },
        { autoAlpha: 1, scale: 1, duration: 0.5, ease: "power3.out" },
      );
    },
    { scope: containerRef, dependencies: [activeIndex, loading, project?.id], revertOnUpdate: true },
  );

  const moveImage = (direction: -1 | 1) => {
    if (!images.length) return;
    setActiveIndex((current) => (current + direction + images.length) % images.length);
  };

  return (
    <main
      ref={containerRef}
      className={`min-h-screen overflow-hidden bg-[#0a0a0a] text-[#e6f7fb] ${loading ? "grid place-items-center text-sm text-[#9bb6c1]" : !project ? "grid place-items-center px-6 text-center" : "pb-20"}`}
    >
      {loading ? (
        <p role="status">Ładowanie projektu...</p>
      ) : !project ? (
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.24em] text-[#04b2d9]">Portfolio</p>
          <h1 className="mb-5 text-3xl font-bold">Nie znaleziono projektu</h1>
          <Button asChild variant="outline"><Link href="/projects"><ArrowLeft /> Wróć do projektów</Link></Button>
        </div>
      ) : (
      <div className="mx-auto max-w-7xl px-5 pt-28 sm:px-8 lg:px-12 lg:pt-36">
        <Link href="/projects" className="detail-back mb-9 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[#9bb6c1] transition-colors hover:text-[#05dbf2]">
          <ArrowLeft size={14} /> Wszystkie projekty
        </Link>

        <header className="detail-heading mb-8 flex flex-col justify-between gap-6 border-b border-[#1d2a2e] pb-8 md:flex-row md:items-end">
          <div className="max-w-3xl">
            <p className="mb-4 flex items-center gap-3 text-[10px] uppercase tracking-[0.28em]" style={{ color: project.accent }}>
              <span className="h-px w-8" style={{ backgroundColor: project.accent }} />
              {project.subtitle}
            </p>
            <h1 className="text-4xl font-bold uppercase leading-[0.95] sm:text-6xl lg:text-7xl">{project.title}</h1>
          </div>
          <div className="flex items-center gap-4 text-xs uppercase tracking-[0.16em] text-[#9bb6c1]">
            <span className="text-2xl font-light text-[#e6f7fb]">{project.year}</span>
            {images.length > 0 && <span className="border-l border-[#29383d] pl-4">{String(images.length).padStart(2, "0")} ujęć</span>}
          </div>
        </header>

        <section className="detail-gallery" aria-label="Galeria projektu">
          <div className="relative aspect-[16/10] overflow-hidden border border-[#1b292d] bg-[#0d1315] sm:aspect-[2/1]">
            {activeImage ? (
              <Image
                ref={imageRef}
                key={activeImage.url}
                src={activeImage.url}
                alt={`${project.title} — zdjęcie ${activeIndex + 1} z ${images.length}`}
                fill
                priority
                unoptimized
                sizes="(max-width: 1280px) 100vw, 1200px"
                className="object-contain"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-[#60777e]" style={{ background: `radial-gradient(ellipse at 50% 100%, ${project.accent}1a, transparent 65%)` }}>
                <ImageIcon size={32} strokeWidth={1.25} />
                <span className="text-xs uppercase tracking-[0.2em]">Brak wizualizacji</span>
              </div>
            )}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#080c0e]/70 to-transparent" />
            {images.length > 1 && (
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <span className="mr-2 text-xs tabular-nums text-white">{String(activeIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</span>
                <Button type="button" variant="outline" size="icon" aria-label="Poprzednie zdjęcie" onClick={() => moveImage(-1)} className="border-white/25 bg-black/40 text-white hover:bg-black/70 hover:text-white"><ArrowLeft /></Button>
                <Button type="button" variant="outline" size="icon" aria-label="Następne zdjęcie" onClick={() => moveImage(1)} className="border-white/25 bg-black/40 text-white hover:bg-black/70 hover:text-white"><ArrowRight /></Button>
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5 lg:grid-cols-7" role="list" aria-label="Wybierz zdjęcie">
              {images.map((image, index) => (
                <button
                  key={`${image.path ?? image.url}-${index}`}
                  type="button"
                  role="listitem"
                  aria-label={`Pokaż zdjęcie ${index + 1}`}
                  aria-pressed={index === activeIndex}
                  onClick={() => setActiveIndex(index)}
                  className={`group relative aspect-[16/10] overflow-hidden border transition-colors ${index === activeIndex ? "border-[#05dbf2]" : "border-[#1b292d] opacity-65 hover:border-[#527078] hover:opacity-100"}`}
                >
                  <Image src={image.url} alt="" fill unoptimized sizes="(max-width: 640px) 33vw, 180px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  <span className="absolute bottom-1.5 left-2 text-[10px] tabular-nums text-white drop-shadow">{String(index + 1).padStart(2, "0")}</span>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="detail-copy mt-12 grid gap-12 border-t border-[#1d2a2e] pt-9 md:grid-cols-[1.4fr_0.6fr] lg:mt-16 lg:gap-20">
          <div>
            <p className="mb-4 text-[10px] uppercase tracking-[0.24em] text-[#04b2d9]">O projekcie</p>
            <p className="max-w-3xl whitespace-pre-line text-base leading-8 text-[#aec0c5] sm:text-lg">
              {project.description.replaceAll("&nbsp;", "\u00a0")}
            </p>
            {(project.link || project.github) && (
              <div className="mt-8 flex flex-wrap gap-3">
                {project.link && (
                  <Button asChild className="uppercase tracking-[0.1em]">
                    <a href={project.link} target="_blank" rel="noopener noreferrer">Zobacz projekt <ArrowUpRight /></a>
                  </Button>
                )}
                {project.github && (
                  <Button asChild variant="outline" className="uppercase tracking-[0.1em]">
                    <a href={project.github} target="_blank" rel="noopener noreferrer"><Github /> Kod źródłowy</a>
                  </Button>
                )}
              </div>
            )}
          </div>

          <aside>
            <p className="mb-4 text-[10px] uppercase tracking-[0.24em] text-[#04b2d9]">Technologie</p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => {
                const technology = getTechnology(tag, technologies);
                return (
                  <span key={tag} className="inline-flex items-center gap-2 border px-3 py-2 text-xs" style={{ color: technology.color, borderColor: `${technology.color}45`, backgroundColor: `${technology.color}10` }}>
                    <span className="size-1.5 rounded-full" style={{ backgroundColor: technology.color }} />
                    {tag}
                  </span>
                );
              })}
            </div>
            <div className="mt-8 border-t border-[#1d2a2e] pt-5">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[#789099]">Rok realizacji</p>
              <p className="mt-2 text-xl font-semibold">{project.year}</p>
            </div>
          </aside>
        </section>

        <div className="mt-16 border-t border-[#1d2a2e] pt-6">
          <Button variant="ghost" asChild className="pl-0 text-[#9bb6c1] hover:bg-transparent hover:text-[#05dbf2]">
            <Link href="/projects"><ArrowLeft /> Wróć do wszystkich projektów</Link>
          </Button>
        </div>
      </div>
      )}
    </main>
  );
}