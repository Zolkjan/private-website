"use client";

import { useRef } from "react";
import { useSectionReveal } from "@/lib/use-section-reveal";

const steps = [
  {
    title: "Rozmowa i kierunek",
    description: "Poznaję Twoją markę, odbiorców i cel. Ustalamy zakres, priorytety i plan pracy.",
    result: "Jasny zakres projektu",
  },
  {
    title: "Projekt i struktura",
    description: "Układam treści i projektuję interfejs. Wspólnie dopracowujemy wygląd przed programowaniem.",
    result: "Projekt do akceptacji",
  },
  {
    title: "Kod i dopracowanie",
    description: "Buduję stronę lub aplikację. Łączę funkcje, dopracowuję widoki mobilne i animacje.",
    result: "Działająca wersja do obejrzenia",
  },
  {
    title: "Publikacja i dalej",
    description: "Przygotowuję projekt do uruchomienia i przekazuję wskazówki do obsługi. Planujemy dalszy rozwój.",
    result: "Gotowy projekt i kolejne kroki",
  },
];

export default function ProcessSection() {
  const ref = useRef<HTMLElement>(null);
  useSectionReveal(ref);

  return (
    <section ref={ref} id="wspolpraca" aria-labelledby="process-heading" className="section-padding border-t border-white/10">
      <div className="site-container">
        <div data-reveal className="mb-12 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
          <div>
            <p className="section-eyebrow"><span className="mr-3 text-[#70818c]">05 /</span> Jak pracuję</p>
            <h2 id="process-heading" className="section-heading">Dobry efekt zaczyna się<br /><span className="text-[#8d9da6]">od jasnego planu.</span></h2>
          </div>
          <p className="max-w-sm text-sm leading-7 text-[#aebbc3]">Bez zgadywania, co dalej. Na każdym etapie wiesz, nad czym pracuję i co jest przed nami.</p>
        </div>
        <ol className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <li key={step.title} className="flex min-w-0 flex-col">
              <div data-reveal-line aria-hidden="true" className="h-px shrink-0 bg-white/20" />
              <div data-reveal data-reveal-delay={index * 0.06} className="flex flex-1 flex-col pt-6">
                <span aria-hidden="true" className="mb-6 text-4xl font-light tracking-[-0.06em] text-[#67dbe8]">0{index + 1}</span>
                <h3 className="mb-3 text-lg font-medium tracking-tight">{step.title}</h3>
                <p className="mb-5 text-sm leading-7 text-[#aebbc3]">{step.description}</p>
                <p className="mt-auto flex items-center gap-2 pb-1 text-xs text-[#8d9da6]"><span className="size-1 rounded-full bg-[#67dbe8]" />{step.result}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
