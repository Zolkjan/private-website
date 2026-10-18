"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { defaultSiteContent, useSiteContent } from "@/lib/firestore-hooks";
import { useProfile } from "@/lib/profile";
import { useSectionReveal } from "@/lib/use-section-reveal";
import workspace from "@/public/images/development-workspace.webp";

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const content = useSiteContent(defaultSiteContent);
  const profile = useProfile();
  useSectionReveal(sectionRef);

  return (
    <section ref={sectionRef} id="o-mnie" className="section-padding border-t border-white/10">
      <div className="site-container grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
        <figure data-reveal className="overflow-hidden rounded-2xl">
          <div className="relative aspect-[6/5] overflow-hidden bg-[#161b1e]">
            <Image src={workspace} alt="Laptop z otwartym kodem na drewnianym biurku" fill
              placeholder="blur" sizes="(max-width: 1023px) 100vw, 560px" className="object-cover" />
          </div>
          <figcaption className="flex justify-between gap-4 border-t border-white/10 py-4 text-xs text-[#9ba9b0]">
            <span>Pomysł. Projekt. Kod.</span><span>CreativePath</span>
          </figcaption>
        </figure>
        <div data-reveal>
          <p className="section-eyebrow">O mnie</p>
          <h2 className="section-heading mb-6">Design z pomysłem.<br /><span className="text-[#8d9da6]">Kod z dbałością o detal.</span></h2>
          <p className="mb-5 text-lg font-medium text-white">{profile.displayName}</p>
          <p className="readable-copy max-w-lg">{content.aboutFirstParagraph}</p>
          <Button asChild variant="outline" className="mt-8 h-11 rounded-full border-white/20 bg-transparent px-5 text-white hover:bg-white/10 hover:text-white">
            <Link href="/about-me">Poznaj mnie bliżej <ArrowUpRight /></Link>
          </Button>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/10 pt-6">
            {profile.location && <span className="text-sm text-[#aebbc3]">{profile.location} · Praca zdalna</span>}
            {profile.availability && <span className="inline-flex items-center gap-2 text-sm text-[#aebbc3]">
              <span className="size-1.5 shrink-0 rounded-full bg-emerald-400" />{profile.availability}
            </span>}
          </div>
        </div>
      </div>
    </section>
  );
}
