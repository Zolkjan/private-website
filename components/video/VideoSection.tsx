"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowUpRight, Camera, Scissors, Film } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSectionReveal } from "@/lib/use-section-reveal";
import { defaultSiteContent, useSiteContent } from "@/lib/firestore-hooks";
import { useVideos } from "@/lib/videos";

const VideoGallery = dynamic(() => import("@/components/video/VideoGallery").then((module) => module.VideoGallery));

export default function VideoSection() {
  const ref = useRef<HTMLElement>(null);
  const content = useSiteContent(defaultSiteContent);
  const { videos, loading, error } = useVideos();
  const featured = videos.filter((video) => video.featured).slice(0, 3);
  useSectionReveal(ref, `${loading}:${featured.map((video) => video.id).join(",")}`);
  return (
    <section ref={ref} id="wideo" aria-labelledby="video-heading" className="section-padding border-t border-white/10">
      <div className="site-container">
        <div data-reveal className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="section-eyebrow !text-[#f3b6a0]"><span className="mr-3 text-[#70818c]">03 /</span> Dodatkowo: nagrywanie i montaż</p>
            <h2 id="video-heading" className="section-heading">Wybrane realizacje <span className="text-[#f3b6a0]">wideo.</span></h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[#aebbc3]">{content.videoDescription}</p>
          </div>
          <Button asChild variant="link" className="h-auto shrink-0 justify-start p-0 text-[#f3b6a0]"><Link href="/video">Portfolio wideo <ArrowUpRight /></Link></Button>
        </div>
        {loading ? (
          <div role="status" className="rounded-2xl border border-white/10 px-6 py-10 text-sm text-[#8d9da6]">Wczytuję wybrane realizacje…</div>
        ) : featured.length > 0 ? (
          <div data-reveal><VideoGallery videos={featured} /></div>
        ) : (
          <div data-reveal className="grid gap-6 rounded-2xl border border-white/10 p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-sm font-medium">{error ? "Portfolio wideo jest chwilowo niedostępne." : "Wybrane filmy pojawią się tutaj wkrótce."}</p>
              <p className="mt-2 max-w-lg text-sm leading-6 text-[#8d9da6]">W międzyczasie porozmawiajmy o materiale, który chcesz stworzyć.</p>
            </div>
            <Button asChild variant="outline" className="h-11 justify-self-start rounded-full border-white/20 bg-transparent px-5"><Link href="/contact">Zaplanujmy wideo <ArrowUpRight /></Link></Button>
          </div>
        )}
        <div data-reveal-line aria-hidden="true" className="mt-8 h-px bg-white/10" />
        <div data-reveal className="grid gap-6 pt-6 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-12">
          <ul aria-label="Usługi wideo" className="flex flex-wrap gap-x-6 gap-y-4 text-xs text-[#aebbc3]">
            <li className="flex items-center gap-2"><Camera className="size-4 text-[#f3b6a0]" /> Nagrywanie</li>
            <li className="flex items-center gap-2"><Scissors className="size-4 text-[#f3b6a0]" /> Montaż</li>
            <li className="flex items-center gap-2"><Film className="size-4 text-[#f3b6a0]" /> Rolki i reklamy</li>
          </ul>
          <p className="text-sm leading-6 text-[#8d9da6]">{content.webVideoDescription}</p>
        </div>
      </div>
    </section>
  );
}
