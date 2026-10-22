"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Film, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { VideoGallery } from "@/components/video/VideoGallery";
import { useVideos } from "@/lib/videos";
import { videoCategories, videoFormats, videoServices, type VideoCategoryId, type VideoFormatId, type VideoServiceId } from "@/lib/video";
import { useSectionReveal } from "@/lib/use-section-reveal";

export default function VideoPortfolio() {
  const ref = useRef<HTMLElement>(null);
  useSectionReveal(ref);
  const { videos, loading, error } = useVideos();
  const [category, setCategory] = useState<VideoCategoryId | "all">("all");
  const [format, setFormat] = useState<VideoFormatId | "all">("all");
  const [service, setService] = useState<VideoServiceId | "all">("all");
  const filtered = videos.filter((video) => (category === "all" || video.category === category) && (format === "all" || video.format === format) && (service === "all" || video.services.includes(service)));
  const reset = () => { setCategory("all"); setFormat("all"); setService("all"); };

  return (
    <main ref={ref} className="min-h-screen bg-[#0a0a0a] pb-16">
      <div className="site-container pt-28 sm:pt-36">
        <Link href="/" className="mb-10 inline-flex min-h-9 items-center gap-2 text-sm text-[#9bb6c1] hover:text-white"><ArrowLeft size={15} /> Strona główna</Link>
        <header data-reveal className="mb-10 grid gap-7 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
          <div>
            <p className="section-eyebrow !text-[#f3b6a0]">CreativePath / Wideo</p>
            <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-[1.08] tracking-tight">Twoja marka.<br /><span className="text-[#f3b6a0]">W dobrym kadrze.</span></h1>
          </div>
          <div>
            <p className="readable-copy">Nagrywamy i montujemy rolki, reklamy oraz filmy wizerunkowe. Łączymy obraz z projektowaniem stron i aplikacji, żeby każdy punkt kontaktu z Twoją marką mówił tym samym językiem.</p>
            <Button asChild variant="link" className="mt-4 h-auto p-0 text-[#f3b6a0]"><Link href="/contact">Porozmawiajmy o filmie <ArrowUpRight /></Link></Button>
          </div>
        </header>

        <div className="mb-10 flex flex-wrap gap-x-6 gap-y-3 border-y border-white/10 py-5 text-sm text-[#aebbc3]">
          <span>Pomysł i scenariusz</span><span>Nagranie</span><span>Montaż i dźwięk</span><span>Formaty do publikacji</span>
        </div>

        <section aria-labelledby="video-filters-heading">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 id="video-filters-heading" className="text-sm font-medium">Wybierz rodzaj realizacji</h2>
            {(category !== "all" || format !== "all" || service !== "all") && <Button variant="ghost" size="sm" onClick={reset} className="text-[#aebbc3]"><RotateCcw /> Wyczyść filtry</Button>}
          </div>
          <div role="group" aria-labelledby="video-filters-heading" className="flex flex-wrap gap-2">
            {[{ id: "all", label: "Wszystkie" }, ...videoCategories].map((item) => {
              const count = videos.filter((video) => (item.id === "all" || video.category === item.id) && (format === "all" || video.format === format) && (service === "all" || video.services.includes(service))).length;
              return <Button key={item.id} variant="outline" aria-pressed={category === item.id} aria-controls="video-results"
                onClick={() => setCategory(item.id as VideoCategoryId | "all")}
                className={"min-h-11 rounded-full px-4 text-xs sm:text-sm " + (category === item.id ? "border-[#f3b6a0] bg-[#f3b6a0] text-[#171110] hover:bg-[#ffd0be] hover:text-[#171110]" : "border-white/15 bg-transparent text-[#b5c5cd] hover:bg-white/5 hover:text-white")}>
                {item.label}<span aria-label={"Liczba filmów: " + count} className="ml-1 text-xs tabular-nums opacity-60">{count}</span>
              </Button>;
            })}
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div className="grid w-full min-w-0 gap-4 sm:w-auto sm:grid-cols-2 sm:gap-6">
            <div className="min-w-0 space-y-2">
              <Label htmlFor="video-format" className="shrink-0 text-xs text-[#aebbc3]">Format</Label>
              <NativeSelect id="video-format" value={format} onChange={(event) => setFormat(event.target.value as VideoFormatId | "all")} aria-controls="video-results" className="border-white/15 bg-[#10171b]">
                <option value="all">Wszystkie formaty</option>
                {videoFormats.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
              </NativeSelect>
            </div>
            <div className="min-w-0 space-y-2">
              <Label htmlFor="video-service" className="shrink-0 text-xs text-[#aebbc3]">Zakres prac</Label>
              <NativeSelect id="video-service" value={service} onChange={(event) => setService(event.target.value as VideoServiceId | "all")} aria-controls="video-results" className="border-white/15 bg-[#10171b]">
                <option value="all">Wszystkie prace</option>
                {videoServices.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
              </NativeSelect>
            </div>
            </div>
            <p role="status" aria-live="polite" className="text-xs text-[#82939e]">{loading ? "Wczytywanie realizacji…" : error ? "Realizacje chwilowo niedostępne" : "Wyświetlane filmy: " + filtered.length + " z " + videos.length}</p>
          </div>
        </section>

        <section id="video-results" aria-label="Portfolio wideo" aria-busy={loading} className="py-8">
          {loading
            ? <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3" aria-hidden="true">{[0, 1, 2].map((i) => <div key={i} className="aspect-[4/3] rounded-2xl border border-white/10 bg-[#10171b] motion-safe:animate-pulse" />)}</div>
            : error && videos.length === 0
              ? <div className="rounded-2xl border border-white/10 p-8 text-center"><p className="text-[#aebbc3]">Nie udało się wczytać realizacji. Spróbuj ponownie później.</p><Button variant="outline" className="mt-5" onClick={() => window.location.reload()}>Wczytaj ponownie</Button></div>
              : filtered.length > 0 ? <VideoGallery videos={filtered} />
              : <div className="rounded-2xl border border-dashed border-white/15 px-5 py-14 text-center">
                  <Film className="mx-auto mb-5 size-8 text-[#f3b6a0]" strokeWidth={1.25} />
                  <h2 className="text-xl font-medium">{videos.length ? "Brak filmów dla tych filtrów" : "Pierwsze realizacje pojawią się tutaj wkrótce."}</h2>
                  <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#aebbc3]">{videos.length ? "Zmień rodzaj realizacji, format lub zakres prac, aby zobaczyć pozostałe filmy." : "Szukasz kogoś do nagrania rolek, reklamy lub montażu Twoich materiałów? Opowiedz nam o swoim pomyśle."}</p>
                  {videos.length ? <Button variant="outline" onClick={reset} className="mt-6">Pokaż wszystkie filmy</Button> : <Button asChild variant="outline" className="mt-6"><Link href="/contact">Zaplanujmy nagranie <ArrowUpRight /></Link></Button>}
                </div>}
        </section>

        <section className="mt-8 grid gap-6 border-t border-white/10 pt-10 md:grid-cols-[1fr_auto] md:items-center">
          <div><p className="section-eyebrow">Web + wideo</p><h2 className="text-2xl font-semibold tracking-tight">Od pierwszego kadru do własnej strony.</h2><p className="readable-copy mt-3 max-w-2xl">Film do kampanii, rolki do social mediów i strona, na której odbiorca poznaje Twoją ofertę. Zaprojektujmy je razem.</p></div>
          <Button asChild variant="outline" className="h-11 justify-self-start rounded-full"><Link href="/projects">Portfolio stron i aplikacji <ArrowUpRight /></Link></Button>
        </section>
      </div>
    </main>
  );
}
