"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { deleteObject, ref as storageRef } from "firebase/storage";
import { Film, Plus, Trash2, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAdminAuth } from "@/components/admin/AdminShell";
import { db, storage } from "@/lib/firebase";
import { getVideoCategory, getVideoFormat, readVideoProject, type VideoProject } from "@/lib/video";

export default function AdminVideosPage() {
  const { user } = useAdminAuth();
  const [videos, setVideos] = useState<VideoProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!db || !user) { setLoading(false); setError("Zaloguj się i sprawdź konfigurację Firebase."); return; }
    return onSnapshot(collection(db, "videos"), (snapshot) => {
      setVideos(snapshot.docs.map((item) => readVideoProject({ ...item.data(), id: item.id }))
        .filter((video): video is VideoProject => video !== null)
        .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, "pl")));
      setLoading(false); setError("");
    }, () => {
      setLoading(false);
      setError("Nie udało się pobrać filmów. Opublikuj aktualne reguły firestore.rules z dostępem do kolekcji videos i sprawdź połączenie.");
    });
  }, [user]);

  const remove = async (video: VideoProject) => {
    if (!db || deleting || !window.confirm("Usunąć realizację „" + video.title + "” z portfolio? Film w zewnętrznym serwisie pozostanie dostępny.")) return;
    setDeleting(video.id); setError(""); setNotice("");
    try {
      await deleteDoc(doc(db, "videos", video.id));
      if (storage && video.posterPath.startsWith("videos/" + video.id + "/")) {
        await deleteObject(storageRef(storage, video.posterPath)).catch(() => undefined);
      }
      setNotice("Realizacja została usunięta z portfolio.");
    } catch { setError("Nie udało się usunąć realizacji. Sprawdź połączenie i uprawnienia."); }
    finally { setDeleting(null); }
  };

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
        <div><p className="section-eyebrow">Portfolio / Wideo</p><h1 className="text-3xl font-bold">Realizacje wideo</h1><p className="mt-3 max-w-xl text-sm leading-6 text-[#8ea4ab]">Zarządzaj filmami, filtrami i okładkami. Opublikowane realizacje pojawiają się w portfolio; wyróżnione także na stronie głównej.</p></div>
        <Button asChild><Link href="/admin/videos/new"><Plus /> Dodaj film</Link></Button>
      </div>
      <Button asChild variant="link" className="mb-5 h-auto p-0 text-[#67dbe8]"><Link href="/video">Otwórz portfolio wideo <ArrowUpRight /></Link></Button>
      {notice && <p role="status" className="mb-5 text-sm text-[#a5e8f2]">{notice}</p>}
      {error && <p role="alert" className="mb-5 rounded-lg border border-rose-500/30 p-4 text-sm text-rose-200">{error}</p>}
      <Card className="gap-0 border-[#22363c] bg-[#0d1315] py-0">
        {loading ? <p role="status" className="p-8 text-sm text-[#9bb6c1]">Wczytywanie realizacji…</p>
          : videos.length ? <ul className="divide-y divide-white/10">
            {videos.map((video) => <li key={video.id} className="flex flex-wrap items-center justify-between gap-4 p-5">
              <Link href={"/admin/videos/" + encodeURIComponent(video.id)} className="flex min-w-0 flex-1 items-center gap-4">
                <Film className="size-8 shrink-0 text-[#f3b6a0]" strokeWidth={1.25} />
                <div className="min-w-0"><p className="truncate font-medium">{video.title}</p><p className="mt-1 text-xs text-[#789099]">{getVideoCategory(video.category).label} · {getVideoFormat(video.format).label} · {video.year}</p><p className="mt-2 text-xs text-[#aebbc3]">{video.published ? "Opublikowany" : "Szkic"}{video.featured ? " · Wyróżniony" : ""}</p></div>
              </Link>
              <div className="flex gap-2"><Button asChild variant="outline" size="sm"><Link href={"/admin/videos/" + encodeURIComponent(video.id)}>Edytuj</Link></Button><Button variant="ghost" size="icon-sm" disabled={Boolean(deleting)} aria-label={"Usuń film " + video.title} className="text-rose-300 hover:bg-rose-950/40 hover:text-rose-200" onClick={() => void remove(video)}><Trash2 /></Button></div>
            </li>)}
          </ul> : !error && <div className="px-6 py-14 text-center"><Film className="mx-auto mb-4 size-8 text-[#f3b6a0]" /><h2 className="text-lg font-medium">Dodaj pierwszą realizację</h2><p className="mt-2 text-sm text-[#8ea4ab]">Wklej link do filmu i wybierz jego kategorię oraz format.</p><Button asChild className="mt-6"><Link href="/admin/videos/new"><Plus /> Dodaj film</Link></Button></div>}
      </Card>
    </div>
  );
}
