"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowUpRight, AppWindow, Monitor, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSectionReveal } from "@/lib/use-section-reveal";
import workspace from "@/public/images/design-workspace.webp";

const services = [
  { icon: Monitor, title: "Strony internetowe", description: "Czytelne strony firmowe i landing page, dopracowane na telefonie i komputerze." },
  { icon: AppWindow, title: "Aplikacje webowe", description: "Przejrzyste panele, sklepy i narzędzia, które ułatwiają codzienną pracę." },
  { icon: Sparkles, title: "Design i interakcje", description: "Spójna oprawa wizualna i subtelny ruch, który pomaga odkrywać treść." },
];

export default function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef);

  return (
    <section ref={sectionRef} id="umiejetnosci" className="section-padding border-t border-white/10">
      <div className="site-container">
        <div data-reveal className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div><p className="section-eyebrow">W czym mogę pomóc</p><h2 className="section-heading">Od pomysłu do publikacji.</h2></div>
          <Button asChild variant="link" className="h-auto justify-start p-0 text-[#67dbe8]">
            <Link href="/contact">Porozmawiajmy o Twoim projekcie <ArrowUpRight /></Link>
          </Button>
        </div>
        <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div data-reveal className="divide-y divide-white/10">
            {services.map(({ icon: Icon, title, description }, index) => (
              <article key={title} className="flex gap-5 py-7 first:pt-0 last:pb-0">
                <Icon className="mt-1 size-6 shrink-0 text-[#67dbe8]" strokeWidth={1.5} />
                <div className="min-w-0 flex-1"><h3 className="mb-2 text-xl font-semibold tracking-tight">{title}</h3><p className="readable-copy max-w-md">{description}</p></div>
                <span className="pt-1 text-xs tabular-nums text-[#70818c]">0{index + 1}</span>
              </article>
            ))}
          </div>
          <figure data-reveal className="relative min-h-64 overflow-hidden rounded-2xl bg-[#1d2326]">
            <Image src={workspace} alt="Jasne stanowisko pracy z monitorem, laptopem i roślinami" fill placeholder="blur"
              sizes="(max-width: 1023px) 100vw, 560px" className="object-cover" />
          </figure>
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-white/10 pt-6 text-sm text-[#aebbc3]">
          <span className="text-xs text-[#70818c]">Narzędzia, na których buduję</span>
          {["React", "Next.js", "TypeScript", "GSAP", "Figma"].map((name) => <span key={name}>{name}</span>)}
        </div>
      </div>
    </section>
  );
}
