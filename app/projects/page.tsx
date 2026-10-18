"use client";

import { useMemo, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Globe2, Layers3, LayoutGrid, PanelsTopLeft, ShoppingBag } from "lucide-react";
import { allProjects, ProjectCard } from "@/components/ProjectsSection/ProjectsSection";
import { useProjects } from "@/lib/firestore-hooks";
import { useTechnologies } from "@/lib/technologies";
import { getProjectCategory, projectCategories, type ProjectCategoryId } from "@/lib/project-categories";
import { Button } from "@/components/ui/button";

const categoryIcons = {
  websites: Globe2,
  ecommerce: ShoppingBag,
  "web-apps": PanelsTopLeft,
  "ui-motion": Layers3,
  other: LayoutGrid,
};

export default function ProjectsPage() {
  const pageRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<ProjectCategoryId | "all">("all");
  const projects = useProjects(allProjects);
  const { technologies } = useTechnologies();

  const categorizedProjects = useMemo(
    () => projects.map((project) => ({ project, category: getProjectCategory(project).id })),
    [projects],
  );
  const availableCategories = useMemo(
    () => projectCategories
      .map((category) => ({
        ...category,
        count: categorizedProjects.filter((item) => item.category === category.id).length,
      }))
      .filter((category) => category.count > 0),
    [categorizedProjects],
  );
  // A live update can remove the selected category's last project.
  const selectedCategory = availableCategories.find((category) => category.id === activeCategory);
  const selectedId = selectedCategory?.id ?? "all";
  const filtered = selectedId === "all"
    ? projects
    : categorizedProjects.filter((item) => item.category === selectedId).map((item) => item.project);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.from(".projects-heading", {
        y: 18, opacity: 0, duration: 0.5, ease: "power2.out",
        clearProps: "transform,opacity",
      });
    });
    return () => media.revert();
  }, { scope: pageRef });

  // Run after React has rendered the selected projects.
  useGSAP(() => {
    if (!gridRef.current) return;
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const cards = gridRef.current?.querySelectorAll(".project-card");
      if (!cards?.length) return;
      gsap.from(cards, {
        y: 12, opacity: 0, duration: 0.3, stagger: { amount: 0.12 },
        ease: "power2.out", clearProps: "transform,opacity",
      });
    });
    return () => media.revert();
  }, { scope: gridRef, dependencies: [selectedId], revertOnUpdate: true });

  return (
    <main ref={pageRef} className="min-h-screen bg-[#0a0a0a] pb-8">
      <div className="site-container pt-28 sm:pt-36">
        <Link href="/" className="mb-10 inline-flex min-h-9 items-center gap-2 text-sm text-[#9bb6c1] transition-colors hover:text-[#67dbe8]">
          <ArrowLeft size={15} /> Strona główna
        </Link>

        <header className="projects-heading mb-10 max-w-3xl sm:mb-14">
          <p className="section-eyebrow">Portfolio</p>
          <h1 className="mb-5 text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-[1.08] tracking-tight">
            Moje <span className="text-gradient">projekty.</span>
          </h1>
          <p className="readable-copy max-w-xl">
            Wybierz rodzaj realizacji i znajdź projekty podobne do tego, czego potrzebujesz.
          </p>
        </header>

        <section aria-labelledby="project-filters-heading" className="border-b border-white/10 pb-7">
          <h2 id="project-filters-heading" className="mb-4 text-sm font-medium text-[#c6d6db]">Rodzaj realizacji</h2>
          <div role="group" aria-labelledby="project-filters-heading" className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              aria-pressed={selectedId === "all"}
              aria-controls="project-results"
              onClick={() => setActiveCategory("all")}
              className={filterClassName(selectedId === "all")}
            >
              <LayoutGrid aria-hidden="true" />
              Wszystkie
              <span className="ml-1 text-xs tabular-nums opacity-65" aria-label={`Liczba projektów: ${projects.length}`}>{projects.length}</span>
            </Button>
            {availableCategories.map((category) => {
              const Icon = categoryIcons[category.id];
              return (
                <Button
                  key={category.id}
                  type="button"
                  variant="outline"
                  aria-pressed={selectedId === category.id}
                  aria-controls="project-results"
                  onClick={() => setActiveCategory(category.id)}
                  className={filterClassName(selectedId === category.id)}
                >
                  <Icon aria-hidden="true" />
                  {category.label}
                  <span className="ml-1 text-xs tabular-nums opacity-65" aria-label={`Liczba projektów: ${category.count}`}>{category.count}</span>
                </Button>
              );
            })}
          </div>
        </section>

        <section id="project-results" aria-label="Projekty" className="py-8 sm:py-10">
          <div role="status" aria-atomic="true" className="mb-7 flex flex-col justify-between gap-2 text-sm sm:flex-row sm:items-baseline sm:gap-6">
            <p className="text-[#aebbc3]">{selectedCategory?.description ?? "Strony, aplikacje i interfejsy — zobacz wybrane realizacje."}</p>
            <p className="shrink-0 text-xs tabular-nums text-[#82939e]">Wyświetlane projekty: {filtered.length} z {projects.length}</p>
          </div>
          <div ref={gridRef} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} technologies={technologies} />
            ))}
          </div>
          {filtered.length === 0 && <p className="py-16 text-center text-[#9bb6c1]">Nowe realizacje pojawią się tutaj wkrótce.</p>}
        </section>

        <section className="mt-6 flex flex-col items-start justify-between gap-6 border-t border-white/10 py-12 sm:mt-10 sm:flex-row sm:items-center">
          <div>
            <p className="section-eyebrow">Twój kolejny projekt</p>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Stwórzmy coś dla Twojej marki.</h2>
          </div>
          <Button asChild size="lg" className="min-h-12 rounded-full bg-[#04b2d9] text-[#071014] hover:bg-[#67dbe8]">
            <Link href="/contact">Porozmawiajmy <ArrowRight /></Link>
          </Button>
        </section>
        <p className="pt-6 text-xs text-[#82939e]">© {new Date().getFullYear()} Jan Żółkiewski · CreativePath</p>
      </div>
    </main>
  );
}

function filterClassName(active: boolean) {
  return `h-auto min-h-11 max-w-full rounded-full px-4 py-2.5 text-xs sm:text-sm transition-colors focus-visible:ring-[#67dbe8]/50 ${active
    ? "border-[#67dbe8] bg-[#67dbe8] text-[#071014] hover:bg-[#86e5ee] hover:text-[#071014]"
    : "border-white/15 bg-transparent text-[#b5c5cd] hover:border-white/30 hover:bg-white/5 hover:text-white"
  }`;
}
