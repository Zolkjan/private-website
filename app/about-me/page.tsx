"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Download } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const timeline = [
  {
    year: "2025",
    title: "Senior Frontend Developer",
    place: "FreeLance / CreativePath",
    desc: "Projekty dla klientów z różnych branż — tworzenie nowoczesnych stron, landing page i aplikacji webowych z naciskiem na animacje i UX.",
  },
  {
    year: "2024",
    title: "Frontend Developer",
    place: "Agencja Interaktywna",
    desc: "Budowanie interfejsów dla klientów korporacyjnych. Praca z React, Next.js i systemami CMS. Wdrażanie animacji GSAP i integracje API.",
  },
  {
    year: "2023",
    title: "Junior Developer",
    place: "Startup Tech",
    desc: "Tworzenie produktów cyfrowych od zera. Praca w metodologii Agile, code review, integracje z zewnętrznymi serwisami.",
  },
  {
    year: "2022",
    title: "Start",
    place: "Samodzielna nauka",
    desc: "Pierwsze projekty, kurs HTML/CSS/JS, React. Tworzenie własnych portfolio projektów i eksperymentowanie z animacjami.",
  },
];

const values = [
  {
    icon: "⚡",
    title: "Wydajność",
    desc: "Każda linia kodu ma znaczenie. Piszę czysto, wydajnie, z myślą o skalowalności.",
  },
  {
    icon: "🎨",
    title: "Estetyka",
    desc: "Design i kod idą w parze. Dbam o każdy piksel, margines i animację.",
  },
  {
    icon: "🔬",
    title: "Innowacja",
    desc: "Śledzę najnowsze trendy i technologie. Zawsze szukam nowych, lepszych rozwiązań.",
  },
  {
    icon: "🤝",
    title: "Współpraca",
    desc: "Komunikacja i praca zespołowa to podstawa. Jestem otwarty, bezpośredni i rzetelny.",
  },
];

export default function AboutPage() {
  const pageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Hero text entrance
      const tl = gsap.timeline({ delay: 0.1 });
      tl.from(".page-hero-label", {
        x: -30,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      })
        .from(
          ".page-hero-title",
          { y: 80, opacity: 0, duration: 1, ease: "power4.out" },
          "-=0.3",
        )
        .from(
          ".page-hero-sub",
          { y: 20, opacity: 0, duration: 0.7, ease: "power3.out" },
          "-=0.5",
        );

      // Timeline items
      gsap.from(".timeline-item", {
        x: -40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".timeline-section",
          start: "top 75%",
        },
      });

      // Values cards
      gsap.from(".value-card", {
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".values-section",
          start: "top 78%",
        },
      });
    },
    { scope: pageRef },
  );

  return (
    <div ref={pageRef} className="min-h-screen bg-[#0a0a0a]">
      {/* Back nav */}
      <div className="pt-32 pb-0 max-w-7xl mx-auto px-6 lg:px-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs tracking-[0.3em] text-[#9bb6c1] uppercase hover:text-[#04b2d9] transition-colors duration-300 mb-16"
        >
          <ArrowLeft size={12} />
          Powrót
        </Link>

        {/* Page hero */}
        <div className="mb-24">
          <div className="page-hero-label flex items-center gap-3 mb-6">
            <span className="inline-block w-8 h-px bg-[#04b2d9]" />
            <span className="text-xs tracking-[0.4em] text-[#04b2d9] uppercase">
              O Mnie
            </span>
          </div>

          <h1 className="page-hero-title text-[clamp(3rem,9vw,8rem)] font-bold leading-[0.9] uppercase tracking-tight mb-8">
            Cześć, jestem
            <br />
            <span className="text-gradient">Jan Żółkiewski</span>
          </h1>

          <div className="page-hero-sub flex flex-col lg:flex-row lg:items-start gap-10 max-w-4xl">
            <p className="text-[#9bb6c1] leading-relaxed text-lg max-w-md">
              Frontend Developer i&nbsp;Creative Coder z&nbsp;pasją do
              nowoczesnych animacji i&nbsp;wyjątkowych interfejsów. Tworzę
              strony, które nie tylko wyglądają świetnie, ale też zachwycają
              ruchem i&nbsp;interakcją.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="/cv.pdf"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#04b2d9] text-[#0a0a0a] font-bold text-xs tracking-[0.2em] uppercase rounded-full hover:bg-[#05dbf2] transition-colors duration-300 glow-sm"
              >
                <Download size={14} />
                Pobierz CV
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 border border-[rgba(5,219,242,0.3)] text-[#e6f7fb] font-bold text-xs tracking-[0.2em] uppercase rounded-full hover:border-[#04b2d9] hover:text-[#05dbf2] transition-all duration-300"
              >
                Napisz do mnie
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Big divider */}
      <div className="glow-line" />

      {/* Timeline */}
      <div className="timeline-section section-padding max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center gap-3 mb-12">
          <span className="inline-block w-8 h-px bg-[#04b2d9]" />
          <span className="text-xs tracking-[0.4em] text-[#04b2d9] uppercase">
            Doświadczenie
          </span>
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-0 top-0 bottom-0 w-px bg-[#1a1a1a] hidden lg:block" />

          <div className="space-y-12">
            {timeline.map((item) => (
              <div key={item.year} className="timeline-item lg:pl-12 relative">
                {/* Dot */}
                <div className="hidden lg:block absolute left-[-4px] top-2 w-2.5 h-2.5 rounded-full bg-[#04b2d9] shadow-[0_0_10px_#04b2d9]" />

                <div className="flex flex-col lg:flex-row lg:items-start gap-4 lg:gap-16">
                  <span className="text-xs tracking-[0.3em] text-[#04b2d9] uppercase font-medium lg:w-16 flex-shrink-0">
                    {item.year}
                  </span>
                  <div>
                    <h3 className="text-xl font-bold text-[#e6f7fb] mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs tracking-[0.2em] text-[#9bb6c1] uppercase mb-3">
                      {item.place}
                    </p>
                    <p className="text-[#9bb6c1] leading-relaxed text-sm max-w-lg">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glow-line" />

      {/* Values */}
      <div className="values-section section-padding max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center gap-3 mb-12">
          <span className="inline-block w-8 h-px bg-[#04b2d9]" />
          <span className="text-xs tracking-[0.4em] text-[#04b2d9] uppercase">
            Wartości
          </span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {values.map((v) => (
            <div
              key={v.title}
              className="value-card glass-card rounded-2xl p-7 hover:border-[rgba(5,219,242,0.2)] transition-all duration-300 group"
            >
              <div className="text-3xl mb-4">{v.icon}</div>
              <h3 className="font-bold text-[#e6f7fb] mb-3 group-hover:text-[#05dbf2] transition-colors duration-300">
                {v.title}
              </h3>
              <p className="text-sm text-[#9bb6c1] leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="glow-line" />

      {/* CTA */}
      <div className="section-padding max-w-7xl mx-auto px-6 lg:px-12 text-center">
        <p className="text-xs tracking-[0.4em] text-[#04b2d9] uppercase mb-6">
          Gotowy na współpracę?
        </p>
        <h2 className="text-[clamp(2rem,5vw,4rem)] font-bold uppercase tracking-tight mb-8">
          Zbudujmy coś <span className="text-gradient">razem</span>
        </h2>
        <Link
          href="/contact"
          className="group inline-flex items-center gap-3 px-10 py-4 bg-[#04b2d9] text-[#0a0a0a] font-bold text-sm tracking-[0.25em] uppercase rounded-full hover:bg-[#05dbf2] transition-colors duration-300 glow-sm"
        >
          Skontaktuj się
          <ArrowRight
            size={16}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-[#9bb6c1]/30 pb-8 tracking-widest uppercase">
        © {new Date().getFullYear()} Jan Żółkiewski — CreativePath
      </p>
    </div>
  );
}
