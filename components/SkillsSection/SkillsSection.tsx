"use client";

import { useRef } from "react";
import Image from "next/image";
import { ArrowUpRight, AppWindow, Monitor, Gauge } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSectionReveal } from "@/lib/use-section-reveal";
import workspace from "@/public/images/creativepath-workspace.png";

const services = [
  {
    icon: Monitor,
    title: "Strony internetowe",
    description:
      "Czytelne strony firmowe i landing page, dopracowane na telefonie i komputerze.",
  },
  {
    icon: AppWindow,
    title: "Aplikacje webowe",
    description:
      "Przejrzyste panele, sklepy i narzędzia, które ułatwiają codzienną pracę.",
  },
  {
    icon: Gauge,
    title: "Rozwój i dopracowanie",
    description:
      "Nowe funkcje, krótsze ładowanie i wygodniejsza obsługa. Ulepszenia, które pomagają korzystać z Twojej strony.",
  },
];

export default function SkillsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useSectionReveal(sectionRef);

  return (
    <section
      ref={sectionRef}
      id="umiejetnosci"
      aria-labelledby="services-heading"
      className="section-padding border-t border-white/10"
    >
      <div className="site-container">
        <div
          data-reveal
          className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end"
        >
          <div>
            <p className="section-eyebrow"><span className="mr-3 text-[#70818c]">04 /</span> W czym mogę pomóc</p>
            <h2 id="services-heading" className="section-heading">Twój cel.<br /><span className="text-[#8d9da6]">Odpowiednie rozwiązanie.</span></h2>
          </div>
          <Button
            asChild
            variant="link"
            className="h-auto justify-start p-0 text-[#67dbe8]"
          >
            <Link href="/contact">
              Porozmawiajmy o Twoim projekcie <ArrowUpRight />
            </Link>
          </Button>
        </div>
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
          <div className="divide-y divide-white/10">
            {services.map(({ icon: Icon, title, description }, index) => (
              <article
                key={title}
                data-reveal
                className="flex gap-5 py-7 first:pt-0 last:pb-0"
              >
                <Icon
                  className="mt-1 size-6 shrink-0 text-[#67dbe8]"
                  strokeWidth={1.5}
                />
                <div className="min-w-0 flex-1">
                  <h3 className="mb-2 text-xl font-semibold tracking-tight">
                    {title}
                  </h3>
                  <p className="readable-copy max-w-md">{description}</p>
                </div>
                <span className="pt-1 text-xs tabular-nums text-[#70818c]">
                  0{index + 1}
                </span>
              </article>
            ))}
          </div>
          <figure
            data-reveal
            className="relative w-full max-w-xs justify-self-center overflow-hidden rounded-2xl bg-[#1d2326]"
            style={{ aspectRatio: `${workspace.height} / ${workspace.width}` }}
          >
            {/* Rotate the original photo upright without cropping its contents. */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90"
              style={{
                width: `${(workspace.width / workspace.height) * 100}%`,
                height: `${(workspace.height / workspace.width) * 100}%`,
              }}
            >
              <Image
                src={workspace}
                alt="Klawiatura mechaniczna, mysz i monitor w turkusowym oświetleniu"
                fill
                placeholder="blur"
                loading="lazy"
                sizes="570px"
                className="object-contain"
              />
            </div>
          </figure>
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-white/10 pt-6 text-sm text-[#aebbc3]">
          <span className="text-xs text-[#70818c]">
            Technologie stron i aplikacji
          </span>
          {["React", "Next.js", "TypeScript", "GSAP", "Figma"].map((name) => (
            <span key={name}>{name}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
