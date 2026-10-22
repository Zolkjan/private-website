"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { defaultSiteContent, useSiteContent } from "@/lib/firestore-hooks";
import { useProfile } from "@/lib/profile";
import { useSectionReveal } from "@/lib/use-section-reveal";
import portrait from "@/public/images/jan-creativepath.webp";

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const content = useSiteContent(defaultSiteContent);
  const profile = useProfile();
  useSectionReveal(sectionRef);

  return (
    <section ref={sectionRef} id="o-mnie" aria-labelledby="about-heading" className="section-padding border-t border-white/10">
      <div className="site-container grid items-center gap-10 md:grid-cols-[0.8fr_1.2fr] lg:gap-24">
        <figure data-reveal className="order-2 mx-auto w-full max-w-[280px] sm:max-w-sm md:order-none md:mx-0">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#161b1e]">
            <div data-reveal-image className="absolute inset-0">
              <Image src={portrait} alt="Jan przy komputerze w swoim turkusowo oświetlonym biurze" fill
                placeholder="blur" sizes="(max-width: 767px) min(100vw, 384px), 384px"
                className="object-cover object-[50%_65%]" />
            </div>
          </div>
          <figcaption className="flex items-center justify-between gap-4 pt-4 text-xs text-[#8d9da6]">
            <span>{profile.displayName}</span><span>Za kulisami CreativePath</span>
          </figcaption>
        </figure>
        <div className="order-1 md:order-none">
          <div data-reveal>
            <p className="section-eyebrow"><span className="mr-3 text-[#70818c]">01 /</span> O mnie</p>
            <h2 id="about-heading" className="section-heading mb-6">Dobry projekt.<br /><span className="text-[#8d9da6]">Przemyślany kod.</span></h2>
            <p className="readable-copy max-w-lg">{content.aboutFirstParagraph}</p>
            <p className="mt-4 max-w-lg text-sm leading-7 text-[#8d9da6]">Programowanie jest podstawą mojej pracy. Dodatkowo nagrywam i montuję wideo, które pomaga pokazać Twoją markę.</p>
            <Button asChild variant="link" className="mt-6 h-11 justify-start px-0 text-[#67dbe8]">
              <Link href="/about-me">Poznaj mnie bliżej <ArrowUpRight /></Link>
            </Button>
          </div>
          <div data-reveal-line aria-hidden="true" className="mt-6 h-px bg-white/15" />
          <div data-reveal className="flex flex-wrap gap-x-8 gap-y-3 pt-5 text-xs text-[#aebbc3]">
            {profile.location && <span>{profile.location} · Praca zdalna</span>}
            {profile.availability && <span className="inline-flex items-center gap-2">
              <span className="size-1.5 shrink-0 rounded-full bg-emerald-400" />{profile.availability}
            </span>}
          </div>
        </div>
      </div>
    </section>
  );
}
