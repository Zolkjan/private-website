"use client";

import { useMemo } from "react";
import type { Project } from "@/components/ProjectsSection/ProjectsSection";
import { usePublicData } from "@/lib/public-data-store";

export interface SiteContent {
  heroDescription: string;
  brandDescription: string;
  videoDescription: string;
  webVideoDescription: string;
  aboutFirstParagraph: string;
  aboutSecondParagraph: string;
  contactDescription: string;
}

export interface OrderedProject extends Project { order?: number }

export function useProjects(fallback: Project[]) {
  const { data } = usePublicData<Project[]>("projects");
  return useMemo(() => [...(data ?? fallback)].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)), [data, fallback]);
}

export function useSiteContent<T extends object>(fallback: T): T {
  const { data } = usePublicData<Partial<T>>("content");
  return useMemo(() => ({ ...fallback, ...data }), [data, fallback]);
}

export const defaultSiteContent: SiteContent = {
  brandDescription: "Projektuję i programuję strony oraz aplikacje dla Twojej marki. Ofertę uzupełniam nagrywaniem i montażem wideo.",
  videoDescription: "Uzupełniam strony obrazem w ruchu. Nagrywam i montuję rolki, reklamy oraz filmy wizerunkowe — na Twoją stronę i do social mediów.",
  webVideoDescription: "Potrzebujesz strony i materiałów do jej promocji? Mogę zadbać o oba elementy: od projektu i kodu po nagranie i montaż filmu.",
  heroDescription: "Od pierwszego pomysłu po gotową stronę. Projektuję i tworzę czytelne, szybkie interfejsy dla Twojej marki.",
  aboutFirstParagraph: "Jestem Jan. Łączę projektowanie z programowaniem, żeby Twoja strona dobrze wyglądała i była prosta w użyciu — na każdym ekranie.",
  aboutSecondParagraph: "Pracuję w React i Next.js. Dbam o detale, płynne animacje i wygodną obsługę. Od pierwszego szkicu aż po publikację.",
  contactDescription: "Opowiedz mi, co chcesz stworzyć. Wspólnie ustalimy dobry kierunek.",
};
