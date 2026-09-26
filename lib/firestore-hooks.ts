"use client";

import { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  type DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Project } from "@/components/ProjectsSection/ProjectsSection";

export interface SiteContent {
  heroDescription: string;
  aboutFirstParagraph: string;
  aboutSecondParagraph: string;
  contactDescription: string;
}

export interface OrderedProject extends Project {
  order?: number;
}

export function useProjects(fallback: Project[]) {
  const [projects, setProjects] = useState(fallback);

  useEffect(() => {
    if (!db) return;
    return onSnapshot(
      collection(db, "projects"),
      (snapshot) => {
        setProjects(
          snapshot.docs.map((project) => ({
            ...project.data(),
            id: project.id,
          })) as Project[],
        );
      },
      (error) => console.error("Nie udało się pobrać projektów:", error),
    );
  }, []);

  return projects;
}

export function useSiteContent<T extends DocumentData>(fallback: T): T {
  const [content, setContent] = useState<T>(fallback);

  useEffect(() => {
    if (!db) return;
    return onSnapshot(
      doc(db, "siteContent", "main"),
      (snapshot) => {
        if (snapshot.exists()) setContent({ ...fallback, ...snapshot.data() });
      },
      (error) => console.error("Nie udało się pobrać treści strony:", error),
    );
  }, [fallback]);

  return content;
}

export const defaultSiteContent: SiteContent = {
  heroDescription:
    "Specjalizuję się w nowoczesnych interfejsach, płynnych animacjach GSAP i immersyjnych scenach 3D — projektuję z pasją i buduję z precyzją.",
  aboutFirstParagraph:
    "Jestem frontend developerem z zamiłowaniem do interaktywnych animacji i nowoczesnych interfejsów. Łączę technologię z designem, aby tworzyć wyjątkowe cyfrowe doświadczenia.",
  aboutSecondParagraph:
    "Specjalizuję się w React, Next.js i GSAP — narzędziach, które pozwalają mi budować strony, które nie tylko wyglądają świetnie, ale też zachwycają płynnością animacji i interakcji.",
  contactDescription:
    "Masz pomysł na projekt? Szukasz współpracy? Napisz do mnie — odpowiem tak szybko, jak to możliwe.",
};