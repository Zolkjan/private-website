"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { deleteObject, ref as storageRef } from "firebase/storage";
import { ArrowUpRight, FolderKanban, Image as ImageIcon, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { allProjects, type Project } from "@/components/ProjectsSection/ProjectsSection";
import { useAdminAuth } from "@/components/admin/AdminShell";
import { useProjects } from "@/lib/firestore-hooks";
import { db, storage } from "@/lib/firebase";

export default function AdminProjectsPage() {
  const projects = useProjects(allProjects);
  const { user } = useAdminAuth();
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!user || !db) return;
    const firestore = db;
    let cancelled = false;
    const seedProjects = async () => {
      try {
        const existing = await getDocs(collection(firestore, "projects"));
        if (cancelled || !existing.empty) return;
        await Promise.all(allProjects.map((project, order) => {
          const { id, ...fields } = project;
          return setDoc(doc(firestore, "projects", String(id)), { ...fields, order });
        }));
      } catch {
        if (!cancelled) setNotice("Nie udało się przygotować listy projektów w Firestore.");
      }
    };
    void seedProjects();
    return () => { cancelled = true; };
  }, [user]);

  const removeProject = async (project: Project) => {
    if (!db || !window.confirm(`Usunąć projekt „${project.title}”?`)) return;
    try {
      await deleteDoc(doc(db, "projects", String(project.id)));
      const imagePaths = new Set([
        project.imagePath,
        ...(project.images ?? []).map((image) => image.path),
      ].filter((path): path is string => Boolean(path)));
      if (storage && imagePaths.size) {
        const projectStorage = storage;
        await Promise.all(
          [...imagePaths].map((path) => deleteObject(storageRef(projectStorage, path)).catch(() => undefined)),
        );
      }
      setNotice("Projekt został usunięty.");
    } catch {
      setNotice("Nie udało się usunąć projektu. Sprawdź uprawnienia Firestore.");
    }
  };

  const orderedProjects = [...projects].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="mb-2 text-[10px] uppercase tracking-[0.24em] text-[#04b2d9]">Zarządzanie portfolio</p>
          <h1 className="text-3xl font-bold sm:text-4xl">Projekty</h1>
          <p className="mt-2 text-sm text-[#8ea4ab]">Dodawaj i aktualizuj pozycje wyświetlane w portfolio.</p>
        </div>
        <Button asChild className="uppercase tracking-[0.1em]">
          <Link href="/admin/projects/new"><Plus /> Dodaj projekt</Link>
        </Button>
      </div>

      {notice && <p role="status" className="mb-5 border border-[#23515b] bg-[#0b2024] px-4 py-3 text-sm text-[#a5e8f2]">{notice}</p>}

      <Card className="gap-0 border-[#22363c] bg-[#0d1315]">
        <CardHeader className="border-b border-[#1c2a2e] px-5 py-5 sm:px-7">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center border border-[#04b2d9]/25 bg-[#04b2d9]/10 text-[#05dbf2]"><FolderKanban size={18} /></div>
              <div>
                <CardTitle className="text-base">Wszystkie projekty</CardTitle>
                <CardDescription className="mt-1 text-[#789099]">{orderedProjects.length} pozycji</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {orderedProjects.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="mb-2 font-medium">Lista jest pusta</p>
              <p className="mb-5 text-sm text-[#8ea4ab]">Dodaj pierwszy projekt do swojego portfolio.</p>
              <Button asChild variant="outline"><Link href="/admin/projects/new"><Plus /> Dodaj projekt</Link></Button>
            </div>
          ) : (
            <ul className="divide-y divide-[#1c2a2e]">
              {orderedProjects.map((project) => (
                <li key={project.id} className="flex flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-7">
                  <Link href={`/admin/projects/${project.id}`} className="group flex min-w-0 flex-1 items-center gap-4">
                    <span className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden border border-[#26373d] bg-[#090e10] sm:size-20">
                      {(project.images?.[0]?.url || project.imageUrl) ? (
                        <Image src={project.images?.[0]?.url || project.imageUrl || ""} alt="" fill unoptimized sizes="80px" className="object-cover" />
                      ) : (
                        <ImageIcon size={18} className="text-[#526b73]" />
                      )}
                    </span>
                    <span className="size-2 shrink-0" style={{ backgroundColor: project.accent }} />
                    <span className="min-w-0">
                      <span className="block truncate font-medium text-[#e6f7fb] transition-colors group-hover:text-[#05dbf2]">{project.title}</span>
                      <span className="mt-1 block truncate text-xs text-[#789099]">{project.subtitle} · {project.year} · {project.tags.join(", ")}</span>
                    </span>
                    {project.featured && <span className="hidden border border-[#04b2d9]/25 px-2 py-1 text-[10px] uppercase tracking-wider text-[#65dbea] sm:inline">Wyróżniony</span>}
                  </Link>
                  <div className="flex items-center gap-2">
                    {project.link && <Button asChild variant="ghost" size="icon" aria-label="Otwórz projekt"><a href={project.link} target="_blank" rel="noreferrer"><ArrowUpRight /></a></Button>}
                    <Button asChild variant="outline" size="sm"><Link href={`/admin/projects/${project.id}`}>Edytuj</Link></Button>
                    <Button variant="ghost" size="icon" aria-label={`Usuń ${project.title}`} onClick={() => void removeProject(project)} className="text-rose-300 hover:bg-rose-950/40 hover:text-rose-200"><Trash2 /></Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}