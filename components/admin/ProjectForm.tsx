"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref as storageRef, uploadBytes } from "firebase/storage";
import Image from "next/image";
import { ArrowLeft, ImagePlus, LoaderCircle, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import TechnologyPicker from "@/components/admin/TechnologyPicker";
import type { Project, ProjectImage } from "@/components/ProjectsSection/ProjectsSection";
import { db, storage } from "@/lib/firebase";

type ProjectFields = Omit<Project, "id">;

const newProject: ProjectFields = {
  title: "",
  subtitle: "",
  description: "",
  tags: [],
  year: new Date().getFullYear().toString(),
  link: "",
  github: "",
  featured: false,
  accent: "#04b2d9",
  imageUrl: "",
  imagePath: "",
  images: [],
};

export default function ProjectForm({ projectId }: { projectId?: string }) {
  const router = useRouter();
  const [draft, setDraft] = useState<ProjectFields>(newProject);
  const [loading, setLoading] = useState(Boolean(projectId));
  const [saving, setSaving] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [originalImagePaths, setOriginalImagePaths] = useState<string[]>([]);
  const [recordId, setRecordId] = useState(projectId ?? "");
  const [error, setError] = useState("");

  useEffect(() => {
    const objectUrls = selectedImages.map((image) => URL.createObjectURL(image));
    setPreviewUrls(objectUrls);
    return () => objectUrls.forEach((url) => URL.revokeObjectURL(url));
  }, [selectedImages]);

  useEffect(() => {
    if (!projectId || !db) return;
    let cancelled = false;
    getDoc(doc(db, "projects", projectId))
      .then((snapshot) => {
        if (cancelled) return;
        if (!snapshot.exists()) {
          setError("Nie znaleziono tego projektu.");
          return;
        }
        const project = { ...newProject, ...snapshot.data() } as ProjectFields;
        if (!project.images?.length && project.imageUrl) {
          project.images = [{ url: project.imageUrl, path: project.imagePath }];
        }
        setDraft(project);
        setOriginalImagePaths(
          (project.images ?? []).flatMap((image) => image.path ? [image.path] : []),
        );
      })
      .catch(() => {
        if (!cancelled) setError("Nie udało się pobrać projektu z Firestore.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [projectId]);

  const setField = <K extends keyof ProjectFields>(
    field: K,
    value: ProjectFields[K],
  ) => setDraft((current) => ({ ...current, [field]: value }));

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (!files.length) return;
    const validFiles = files.filter(
      (file) => file.type.startsWith("image/") && file.size < 10 * 1024 * 1024,
    );
    const availableSlots = Math.max(0, 12 - (draft.images?.length ?? 0) - selectedImages.length);
    const acceptedFiles = validFiles.slice(0, availableSlots);
    if (acceptedFiles.length !== files.length) {
      setError("Możesz dodać maksymalnie 12 zdjęć. Każde musi być obrazem mniejszym niż 10 MB.");
    } else {
      setError("");
    }
    if (acceptedFiles.length) setSelectedImages((current) => [...current, ...acceptedFiles]);
  };

  const removeSavedImage = (index: number) => {
    setDraft((current) => ({
      ...current,
      images: (current.images ?? []).filter((_, imageIndex) => imageIndex !== index),
    }));
  };

  const removeSelectedImage = (index: number) => {
    setSelectedImages((current) => current.filter((_, imageIndex) => imageIndex !== index));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!db) {
      setError("Firebase nie jest skonfigurowany.");
      return;
    }
    setSaving(true);
    setError("");
    const uploadedImagePaths: string[] = [];
    try {
      const id = projectId ?? (recordId || crypto.randomUUID());
      if (!recordId) setRecordId(id);
      const existing = projectId ? await getDoc(doc(db, "projects", projectId)) : null;
      const uploadedImages: ProjectImage[] = [];

      for (const image of selectedImages) {
        if (!storage) throw new Error("Firebase Storage nie jest skonfigurowany.");
        const safeName = image.name.replace(/[^a-zA-Z0-9._-]/g, "-");
        const imageRef = storageRef(
          storage,
          `projects/${id}/${crypto.randomUUID()}-${safeName}`,
        );
        await uploadBytes(imageRef, image, {
          contentType: image.type,
        });
        uploadedImagePaths.push(imageRef.fullPath);
        uploadedImages.push({
          url: await getDownloadURL(imageRef),
          path: imageRef.fullPath,
          name: image.name,
        });
      }

      const images = [...(draft.images ?? []), ...uploadedImages];
      const coverImage = images[0];
      await setDoc(doc(db, "projects", id), {
        ...draft,
        images,
        imageUrl: coverImage?.url ?? "",
        imagePath: coverImage?.path ?? "",
        order: existing?.data()?.order ?? Date.now(),
      });

      const retainedPaths = new Set(images.flatMap((image) => image.path ? [image.path] : []));
      const removedPaths = originalImagePaths.filter((path) => !retainedPaths.has(path));
      if (storage && removedPaths.length) {
        const imageStorage = storage;
        await Promise.all(
          removedPaths.map((path) => deleteObject(storageRef(imageStorage, path)).catch(() => undefined)),
        );
      }
      router.push("/admin/projects");
    } catch {
      if (storage && uploadedImagePaths.length) {
        const imageStorage = storage;
        await Promise.all(
          uploadedImagePaths.map((path) => deleteObject(storageRef(imageStorage, path)).catch(() => undefined)),
        );
      }
      setError("Nie udało się zapisać projektu. Sprawdź logowanie i reguły Firestore.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div role="status" className="flex items-center gap-2 py-12 text-sm text-[#9bb6c1]">
        <LoaderCircle className="size-4 animate-spin" /> Wczytywanie projektu...
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <Link href="/admin/projects" className="mb-6 inline-flex items-center gap-2 text-sm text-[#9bb6c1] transition-colors hover:text-[#05dbf2]">
        <ArrowLeft size={15} /> Wszystkie projekty
      </Link>
      <div className="mb-7">
        <p className="mb-2 text-[10px] uppercase tracking-[0.24em] text-[#04b2d9]">Portfolio / Projekty</p>
        <h1 className="text-3xl font-bold sm:text-4xl">{projectId ? "Edytuj projekt" : "Dodaj projekt"}</h1>
        <p className="mt-2 text-sm text-[#8ea4ab]">Wypełnij dane, które będą widoczne w portfolio.</p>
      </div>

      <Card className="gap-0 border-[#22363c] bg-[#0d1315]">
        <CardHeader className="border-b border-[#1c2a2e] px-6 py-5 sm:px-8">
          <CardTitle className="text-lg">Informacje o projekcie</CardTitle>
          <CardDescription className="text-[#8ea4ab]">Pola oznaczone gwiazdką są wymagane.</CardDescription>
        </CardHeader>
        <CardContent className="px-6 py-6 sm:px-8">
          <form onSubmit={handleSubmit} className="space-y-7">
            <div className="grid gap-5 sm:grid-cols-2">
              <FormInput label="Nazwa projektu *" value={draft.title} onChange={(value) => setField("title", value)} required />
              <FormInput label="Podtytuł *" value={draft.subtitle} onChange={(value) => setField("subtitle", value)} required />
              <FormInput label="Rok *" value={draft.year} onChange={(value) => setField("year", value)} required />
              <FormInput label="Kolor akcentu" type="color" value={draft.accent} onChange={(value) => setField("accent", value)} />
              <FormInput label="Link do projektu" type="url" value={draft.link ?? ""} onChange={(value) => setField("link", value)} />
              <FormInput label="Link do GitHub" type="url" value={draft.github ?? ""} onChange={(value) => setField("github", value)} />
              <div className="space-y-3 sm:col-span-2">
                <div className="space-y-1.5">
                  <Label htmlFor="project-image">Wizualizacja projektu</Label>
                  <p className="text-xs text-[#789099]">Dodaj do 12 zrzutów ekranu aplikacji. Każde zdjęcie może mieć maksymalnie 10 MB.</p>
                </div>
                {((draft.images?.length ?? 0) > 0 || previewUrls.length > 0) && (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {(draft.images ?? []).map((image, index) => (
                      <div key={image.path ?? image.url} className="group relative aspect-[16/10] overflow-hidden border border-[#26373d] bg-[#090e10]">
                        <Image src={image.url} alt={`Zdjęcie ${index + 1}: ${draft.title || "projekt"}`} fill unoptimized sizes="(max-width: 640px) 50vw, 240px" className="object-cover" />
                        <span className="absolute left-2 top-2 bg-black/70 px-2 py-1 text-[10px] text-white">{index === 0 ? "Okładka" : `Zdjęcie ${index + 1}`}</span>
                        <Button type="button" variant="destructive" size="icon-sm" aria-label={`Usuń zdjęcie ${index + 1}`} onClick={() => removeSavedImage(index)} className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"><Trash2 /></Button>
                      </div>
                    ))}
                    {previewUrls.map((url, index) => (
                      <div key={url} className="group relative aspect-[16/10] overflow-hidden border border-dashed border-[#04b2d9]/60 bg-[#090e10]">
                        <Image src={url} alt={`Nowe zdjęcie ${index + 1}`} fill unoptimized sizes="(max-width: 640px) 50vw, 240px" className="object-cover" />
                        <span className="absolute left-2 top-2 bg-[#04b2d9] px-2 py-1 text-[10px] font-medium text-[#061014]">Nowe</span>
                        <Button type="button" variant="destructive" size="icon-sm" aria-label={`Usuń nowe zdjęcie ${index + 1}`} onClick={() => removeSelectedImage(index)} className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"><Trash2 /></Button>
                      </div>
                    ))}
                  </div>
                )}
                <Input
                  id="project-image"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  multiple
                  onChange={handleImageChange}
                  disabled={(draft.images?.length ?? 0) + selectedImages.length >= 12}
                  className="max-w-2xl border-[#2a3b40] bg-[#090e10] file:mr-3 file:rounded-sm file:border-0 file:bg-[#17323a] file:px-3 file:py-1 file:text-xs file:font-medium file:text-[#9eeaf4]"
                />
                <p className="text-xs text-[#789099]">{(draft.images?.length ?? 0) + selectedImages.length}/12 zdjęć · pierwsze zdjęcie będzie okładką projektu.</p>
              </div>
              <TechnologyPicker selected={draft.tags} onChange={(technologies) => setField("tags", technologies)} />
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="project-description">Opis *</Label>
                <Textarea id="project-description" required value={draft.description} onChange={(event) => setField("description", event.target.value)} className="min-h-36 resize-y border-[#2a3b40] bg-[#090e10] focus-visible:border-[#04b2d9] focus-visible:ring-[#04b2d9]/30" />
              </div>
              <div className="flex items-center gap-3 sm:col-span-2">
                <Checkbox id="project-featured" checked={Boolean(draft.featured)} onCheckedChange={(checked) => setField("featured", checked === true)} />
                <Label htmlFor="project-featured" className="font-normal text-[#c6d6db]">Wyróżnij na stronie głównej</Label>
              </div>
            </div>

            {error && <p role="alert" className="border border-rose-500/30 bg-rose-500/5 px-4 py-3 text-sm text-rose-200">{error}</p>}
            <div className="flex flex-wrap gap-3 border-t border-[#1c2a2e] pt-6">
              <Button type="submit" disabled={saving} className="uppercase tracking-[0.12em]">
                {saving ? <LoaderCircle className="animate-spin" /> : <Save />} {saving ? "Zapisywanie..." : projectId ? "Zapisz projekt" : "Dodaj projekt"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push("/admin/projects")}>Anuluj</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function FormInput({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  className?: string;
}) {
  const inputId = `project-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={inputId}>{label}</Label>
      <Input id={inputId} type={type} value={value} onChange={(event) => onChange(event.target.value)} required={required} className="border-[#2a3b40] bg-[#090e10] focus-visible:border-[#04b2d9] focus-visible:ring-[#04b2d9]/30" />
    </div>
  );
}