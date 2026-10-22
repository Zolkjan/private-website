"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref as storageRef, uploadBytes } from "firebase/storage";
import { ArrowLeft, LoaderCircle, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { NativeSelect } from "@/components/ui/native-select";
import { allProjects } from "@/components/ProjectsSection/ProjectsSection";
import { useProjects } from "@/lib/firestore-hooks";
import { db, storage } from "@/lib/firebase";
import { getVideoSource, isHttpsUrl, readVideoProject, videoCategories, videoFormats, videoServices, type VideoProject } from "@/lib/video";

type Fields = Omit<VideoProject, "id">;
const initialDraft: Fields = {
  title: "", description: "", category: "reels", format: "portrait",
  services: ["filming", "editing"], videoUrl: "", posterUrl: "", posterPath: "",
  captionsUrl: "", client: "", year: new Date().getFullYear().toString(), duration: "",
  relatedProjectId: "", featured: false, published: false, order: 0,
};
const fieldClass = "border-[#2a3b40] bg-[#090e10] focus-visible:border-[#04b2d9] focus-visible:ring-[#04b2d9]/30";

export default function VideoForm({ videoId }: { videoId?: string }) {
  const router = useRouter();
  const projects = useProjects(allProjects);
  const [draft, setDraft] = useState<Fields>(initialDraft);
  const [recordId, setRecordId] = useState(videoId ?? "");
  const [loading, setLoading] = useState(Boolean(videoId));
  const [loadFailed, setLoadFailed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [originalPosterPath, setOriginalPosterPath] = useState("");
  const [originalPosterUrl, setOriginalPosterUrl] = useState("");

  useEffect(() => {
    if (!coverFile) { setPreview(""); return; }
    const url = URL.createObjectURL(coverFile);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [coverFile]);

  useEffect(() => {
    if (!videoId) return;
    if (!db) {
      setError("Firebase nie jest skonfigurowany.");
      setLoadFailed(true); setLoading(false); return;
    }
    let cancelled = false;
    getDoc(doc(db, "videos", videoId)).then((snapshot) => {
      if (cancelled) return;
      const video = snapshot.exists() ? readVideoProject({ ...snapshot.data(), id: snapshot.id }) : null;
      if (!video) {
        setLoadFailed(true);
        setError("Nie znaleziono realizacji lub jej dane są niekompletne.");
        return;
      }
      const { id: _id, ...fields } = video;
      setDraft(fields);
      setOriginalPosterPath(video.posterPath);
      setOriginalPosterUrl(video.posterUrl);
    }).catch(() => {
      if (!cancelled) {
        setLoadFailed(true);
        setError("Nie udało się pobrać realizacji. Sprawdź połączenie i reguły kolekcji videos w Firestore.");
      }
    }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [videoId]);

  const setField = <K extends keyof Fields>(key: K, value: Fields[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving || loadFailed) return;
    if (!db) { setError("Firebase nie jest skonfigurowany."); return; }
    if (!draft.title.trim() || !draft.description.trim()) { setError("Uzupełnij tytuł i opis realizacji."); return; }
    if (!getVideoSource(draft.videoUrl.trim())) { setError("Podaj link HTTPS do YouTube (także Shorts), Vimeo albo pliku MP4/WebM."); return; }
    if (!coverFile && draft.posterUrl && !isHttpsUrl(draft.posterUrl)) { setError("Okładka musi mieć poprawny adres HTTPS."); return; }
    if (draft.captionsUrl && (!isHttpsUrl(draft.captionsUrl) || !new URL(draft.captionsUrl).pathname.toLowerCase().endsWith(".vtt"))) { setError("Podaj adres HTTPS do napisów w formacie .vtt."); return; }
    if (!draft.services.length) { setError("Wybierz przynajmniej jeden element zakresu realizacji."); return; }
    if (!Number.isInteger(draft.order) || draft.order < 0 || draft.order > 10000) { setError("Kolejność musi być liczbą całkowitą od 0 do 10000."); return; }
    setError(""); setSaving(true);
    const id = videoId ?? (recordId || crypto.randomUUID());
    if (!recordId) setRecordId(id);
    let uploadedPath = "";
    let saved = false;
    try {
      let posterUrl = draft.posterUrl.trim();
      let posterPath = draft.posterPath || (posterUrl === originalPosterUrl ? originalPosterPath : "");
      if (coverFile) {
        if (!storage) throw new Error("Storage unavailable");
        const coverRef = storageRef(storage, "videos/" + id + "/" + crypto.randomUUID() + "-" + coverFile.name.replace(/[^a-zA-Z0-9._-]/g, "-"));
        await uploadBytes(coverRef, coverFile, { contentType: coverFile.type });
        uploadedPath = coverRef.fullPath;
        posterUrl = await getDownloadURL(coverRef);
        posterPath = coverRef.fullPath;
      }
      const payload: Fields = {
        ...draft, title: draft.title.trim(), description: draft.description.trim(),
        videoUrl: draft.videoUrl.trim(), client: draft.client.trim(), duration: draft.duration.trim(),
        captionsUrl: draft.captionsUrl.trim(), posterUrl, posterPath,
      };
      await setDoc(doc(db, "videos", id), payload);
      saved = true;
      if (storage && originalPosterPath.startsWith("videos/" + id + "/") && originalPosterPath !== posterPath) {
        await deleteObject(storageRef(storage, originalPosterPath)).catch(() => undefined);
      }
      router.push("/admin/videos");
    } catch {
      if (!saved && storage && uploadedPath) await deleteObject(storageRef(storage, uploadedPath)).catch(() => undefined);
      setError("Nie udało się zapisać realizacji. Sprawdź połączenie oraz opublikowanie reguł Firestore i Storage dla videos.");
    } finally { setSaving(false); }
  };

  if (loading) return <p role="status" className="flex items-center gap-2 py-12 text-sm text-[#9bb6c1]"><LoaderCircle className="size-4 animate-spin" /> Wczytywanie realizacji…</p>;

  return (
    <div className="max-w-4xl">
      <Link href="/admin/videos" className="mb-6 inline-flex items-center gap-2 text-sm text-[#9bb6c1]"><ArrowLeft size={15} /> Wszystkie filmy</Link>
      <h1 className="mb-3 text-3xl font-bold">{videoId ? "Edytuj realizację wideo" : "Dodaj realizację wideo"}</h1>
      <p className="mb-7 text-sm leading-6 text-[#8ea4ab]">Dodaj film, okładkę i zakres prac. Szkic jest widoczny tylko w panelu; publikację włączysz na dole formularza.</p>
      {loadFailed ? <p role="alert" className="text-rose-200">{error}</p> : (
        <Card className="gap-0 border-[#22363c] bg-[#0d1315]">
          <CardHeader className="border-b border-[#1c2a2e] px-6 py-5">
            <CardTitle>Informacje o filmie</CardTitle><CardDescription className="text-[#8ea4ab]">Pola oznaczone gwiazdką są wymagane.</CardDescription>
          </CardHeader>
          <CardContent className="px-6 py-6">
            <form onSubmit={save}>
              <fieldset disabled={saving} className="grid min-w-0 gap-5 sm:grid-cols-2 disabled:opacity-70">
                <div className="space-y-2 sm:col-span-2"><Label htmlFor="video-title">Tytuł *</Label><Input id="video-title" required maxLength={120} value={draft.title} onChange={(e) => setField("title", e.target.value)} className={fieldClass} /></div>
                <div className="space-y-2"><Label htmlFor="video-category">Rodzaj realizacji *</Label><NativeSelect id="video-category" value={draft.category} onChange={(e) => setField("category", e.target.value as Fields["category"])} className={fieldClass}>{videoCategories.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</NativeSelect></div>
                <div className="space-y-2"><Label htmlFor="video-orientation">Format *</Label><NativeSelect id="video-orientation" value={draft.format} onChange={(e) => setField("format", e.target.value as Fields["format"])} className={fieldClass}>{videoFormats.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</NativeSelect></div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="video-url">Link do filmu *</Label>
                  <Input id="video-url" type="url" required maxLength={2048} value={draft.videoUrl} onChange={(e) => setField("videoUrl", e.target.value)} placeholder="https://www.youtube.com/watch?v=…" aria-describedby="video-url-help" className={fieldClass} />
                  <p id="video-url-help" className="text-xs leading-5 text-[#789099]">YouTube, Shorts, Vimeo lub bezpośredni link HTTPS do MP4/WebM. Film musi umożliwiać odtwarzanie bez logowania i osadzanie na stronie. Materiały z Instagrama lub TikToka dodaj jako plik MP4 albo opublikuj w YouTube/Vimeo.</p>
                </div>
                <div className="space-y-2"><Label htmlFor="video-client">Marka / klient</Label><Input id="video-client" maxLength={120} value={draft.client} onChange={(e) => setField("client", e.target.value)} className={fieldClass} /></div>
                <div className="space-y-2"><Label htmlFor="video-year">Rok *</Label><Input id="video-year" required inputMode="numeric" pattern="[0-9]{4}" maxLength={4} value={draft.year} onChange={(e) => setField("year", e.target.value)} className={fieldClass} /></div>
                <div className="space-y-2"><Label htmlFor="video-duration">Czas trwania</Label><Input id="video-duration" placeholder="0:30" maxLength={16} value={draft.duration} onChange={(e) => setField("duration", e.target.value)} className={fieldClass} /></div>
                <div className="space-y-2"><Label htmlFor="video-order">Kolejność (mniejsze liczby pierwsze)</Label><Input id="video-order" type="number" min={0} max={10000} step={1} required value={draft.order} onChange={(e) => setField("order", Number(e.target.value))} className={fieldClass} /></div>
                <div className="space-y-2 sm:col-span-2"><Label htmlFor="video-description">Opis realizacji *</Label><Textarea id="video-description" required maxLength={4000} rows={5} value={draft.description} onChange={(e) => setField("description", e.target.value)} placeholder="Cel filmu, pomysł i wykonana praca." className={fieldClass} /></div>
                <fieldset className="space-y-3 sm:col-span-2"><legend className="mb-3 text-sm font-medium">Zakres naszej pracy *</legend><div className="flex flex-wrap gap-x-6 gap-y-3">{videoServices.map((service) => <div key={service.id} className="flex items-center gap-2"><Checkbox id={"service-" + service.id} checked={draft.services.includes(service.id)} onCheckedChange={(checked) => setField("services", checked === true ? [...draft.services, service.id] : draft.services.filter((id) => id !== service.id))} /><Label htmlFor={"service-" + service.id} className="font-normal">{service.label}</Label></div>)}</div></fieldset>
                <div className="space-y-3 sm:col-span-2">
                  <Label htmlFor="video-cover">Okładka filmu</Label>
                  {(preview || isHttpsUrl(draft.posterUrl)) && <div className="relative aspect-video max-w-sm overflow-hidden rounded-lg bg-black"><Image src={preview || draft.posterUrl} alt="Podgląd okładki" fill unoptimized sizes="384px" className="object-contain" /></div>}
                  <Input id="video-cover" type="file" accept="image/jpeg,image/png,image/webp" className={fieldClass} onChange={(e) => {
                    const file = e.target.files?.[0]; e.target.value = "";
                    if (!file) return;
                    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size >= 10 * 1024 * 1024) { setError("Wybierz JPG, PNG lub WebP mniejszy niż 10 MB."); return; }
                    setError(""); setCoverFile(file);
                  }} />
                  {coverFile && <div className="flex items-center gap-2 text-xs text-[#aebbc3]"><span className="truncate">{coverFile.name}</span><Button type="button" variant="ghost" size="icon-sm" aria-label="Anuluj wybór okładki" onClick={() => setCoverFile(null)}><X /></Button></div>}
                  <Label htmlFor="video-poster-url">Lub adres HTTPS okładki</Label>
                  <Input id="video-poster-url" type="url" disabled={Boolean(coverFile)} maxLength={4096} value={draft.posterUrl} onChange={(e) => setDraft((current) => ({ ...current, posterUrl: e.target.value, posterPath: "" }))} className={fieldClass} />
                  <p className="text-xs leading-5 text-[#789099]">JPG, PNG lub WebP, do 10 MB. Na liście ładowana jest tylko okładka; odtwarzacz uruchamia się po kliknięciu.</p>
                </div>
                <div className="space-y-2 sm:col-span-2"><Label htmlFor="video-related">Powiązana strona lub aplikacja</Label><NativeSelect id="video-related" value={draft.relatedProjectId} onChange={(e) => setField("relatedProjectId", e.target.value)} className={fieldClass}>
                  <option value="">Bez powiązania</option>
                  {draft.relatedProjectId && !projects.some((project) => String(project.id) === draft.relatedProjectId) && <option value={draft.relatedProjectId}>Obecne powiązanie: {draft.relatedProjectId}</option>}
                  {projects.map((project) => <option key={project.id} value={String(project.id)}>{project.title}</option>)}
                </NativeSelect><p className="text-xs text-[#789099]">Przy filmie pojawi się link do projektu strony lub aplikacji.</p></div>
                <div className="space-y-2 sm:col-span-2"><Label htmlFor="video-captions">Napisy do MP4/WebM — adres pliku .vtt</Label><Input id="video-captions" type="url" maxLength={2048} value={draft.captionsUrl} onChange={(e) => setField("captionsUrl", e.target.value)} className={fieldClass} /><p className="text-xs leading-5 text-[#789099]">Opcjonalne. Dla YouTube i Vimeo dodaj napisy w danym serwisie. Przy zewnętrznych napisach serwery filmu i napisów muszą zezwalać na odczyt przez stronę (CORS).</p></div>
                <div className="flex items-center gap-3 sm:col-span-2"><Checkbox id="video-featured" checked={draft.featured} onCheckedChange={(checked) => setField("featured", checked === true)} /><Label htmlFor="video-featured" className="font-normal">Wyróżnij na stronie głównej (maksymalnie 3 opublikowane filmy)</Label></div>
                <div className="flex items-center gap-3 sm:col-span-2"><Checkbox id="video-published" checked={draft.published} onCheckedChange={(checked) => setField("published", checked === true)} /><Label htmlFor="video-published" className="font-normal">Opublikuj w portfolio</Label></div>
                {error && <p role="alert" className="rounded-lg border border-rose-500/30 bg-rose-500/5 p-4 text-sm text-rose-200 sm:col-span-2">{error}</p>}
                <div className="flex flex-wrap gap-3 border-t border-white/10 pt-6 sm:col-span-2"><Button type="submit">{saving ? <LoaderCircle className="animate-spin" /> : <Save />}{saving ? "Zapisywanie…" : draft.published ? "Zapisz i opublikuj" : "Zapisz szkic"}</Button><Button type="button" variant="outline" onClick={() => router.push("/admin/videos")}>Anuluj</Button></div>
              </fieldset>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
