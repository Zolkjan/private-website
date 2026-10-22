"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Film, Play } from "lucide-react";
import { PortfolioImage } from "@/components/PortfolioImage";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getVideoCategory, getVideoFormat, getVideoSource, isHttpsUrl, videoServices, type VideoProject } from "@/lib/video";

export function VideoGallery({ videos }: { videos: VideoProject[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {videos.map((video) => <VideoCard key={video.id} video={video} />)}
    </div>
  );
}

function VideoCard({ video }: { video: VideoProject }) {
  const [open, setOpen] = useState(false);
  const [playbackError, setPlaybackError] = useState(false);
  const format = getVideoFormat(video.format);
  const source = getVideoSource(video.videoUrl);
  const poster = isHttpsUrl(video.posterUrl) ? video.posterUrl : undefined;
  return (
    <Dialog open={open} onOpenChange={(nextOpen) => { setOpen(nextOpen); setPlaybackError(false); }}>
      <Card className="group gap-0 overflow-hidden rounded-2xl border-white/10 bg-[#10171b] py-0 shadow-none">
        <DialogTrigger asChild>
          <Button type="button" variant="ghost" disabled={!source} aria-label={"Odtwórz: " + video.title}
            className="relative block aspect-[16/10] h-auto w-full overflow-hidden rounded-none bg-[#0c1115] p-0 hover:bg-[#0c1115]">
            {poster
              ? <PortfolioImage src={poster} alt="" fill sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 400px" className="object-contain" />
              : <span className="absolute inset-0 flex items-center justify-center bg-[#19262c]"><Film className="size-16 text-white/15" strokeWidth={1} /></span>}
            <span className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />
            <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/60 px-3 py-1.5 text-[11px] font-normal text-white">{format.label}</span>
            <span className="absolute left-1/2 top-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[#f3b6a0] text-[#171110] transition-transform motion-safe:group-hover:scale-110">
              <Play className="ml-0.5 size-5 fill-current" />
            </span>
            <span className="absolute bottom-4 left-4 text-xs text-white">{source ? "Odtwórz realizację" : "Film chwilowo niedostępny"}</span>
            {video.duration && <span className="absolute bottom-4 right-4 text-xs tabular-nums text-white">{video.duration}</span>}
          </Button>
        </DialogTrigger>
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <p className="mb-2 text-xs text-[#f3b6a0]">{getVideoCategory(video.category).label}</p>
          <h3 className="text-xl font-semibold tracking-tight">{video.title}</h3>
          <p className="mt-2 text-xs text-[#82939e]">{[video.client, video.year].filter(Boolean).join(" · ")}</p>
          <p className="mt-4 line-clamp-3 text-sm leading-6 text-[#aebbc3]">{video.description}</p>
          <div className="mt-5 flex flex-wrap gap-2" aria-label="Zakres realizacji">
            {videoServices.filter(({ id }) => video.services.includes(id)).map((service) =>
              <span key={service.id} className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-[#aebbc3]">{service.label}</span>)}
          </div>
          {video.relatedProjectId && <Button asChild variant="link" className="mt-4 h-auto justify-start p-0 text-[#67dbe8]">
            <Link href={"/projects/" + encodeURIComponent(video.relatedProjectId)}>Zobacz powiązaną stronę <ArrowUpRight /></Link>
          </Button>}
        </div>
      </Card>
      {open && source && <DialogContent>
        <DialogTitle className="pr-10 text-xl font-semibold tracking-tight">{video.title}</DialogTitle>
        <DialogDescription className="mb-5 mt-2 text-sm text-[#aebbc3]">
          {getVideoCategory(video.category).label} · {video.year}
          {source.kind === "embed" && " · " + source.provider}
        </DialogDescription>
        <div className="mx-auto overflow-hidden rounded-lg bg-black" style={{ aspectRatio: format.ratio, width: "min(100%, " + format.playerWidth + ")" }}>
          {source.kind === "embed"
            ? <iframe src={source.src} title={video.title} className="h-full w-full border-0" allow="autoplay; fullscreen; picture-in-picture; encrypted-media" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
            : <video controls autoPlay playsInline preload="none" poster={poster} crossOrigin={isHttpsUrl(video.captionsUrl) ? "anonymous" : undefined} onError={() => setPlaybackError(true)} className="h-full w-full object-contain">
                <source src={source.src} type={source.mime} onError={() => setPlaybackError(true)} />
                {isHttpsUrl(video.captionsUrl) && <track kind="captions" src={video.captionsUrl} srcLang="pl" label="Polski" />}
                Twoja przeglądarka nie obsługuje tego filmu.
              </video>}
        </div>
        {playbackError && <p role="alert" className="mt-4 text-sm text-[#f3b6a0]">Nie udało się odtworzyć filmu. Spróbuj otworzyć go w nowej karcie za pomocą linku poniżej.</p>}
        <p className="mt-5 whitespace-pre-line text-sm leading-6 text-[#aebbc3]">{video.description}</p>
        <Button asChild variant="link" className="mt-3 h-auto p-0 text-[#f3b6a0]">
          <a href={video.videoUrl} target="_blank" rel="noopener noreferrer">Otwórz film w nowej karcie <ArrowUpRight /></a>
        </Button>
      </DialogContent>}
    </Dialog>
  );
}
