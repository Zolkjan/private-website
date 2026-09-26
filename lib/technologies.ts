"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Technology {
  id?: string;
  name: string;
  category: string;
  color: string;
}

export const technologyDictionary: Technology[] = [
  { name: "Next.js", category: "Frontend", color: "#e6f7fb" },
  { name: "React", category: "Frontend", color: "#61dafb" },
  { name: "TypeScript", category: "Frontend", color: "#3178c6" },
  { name: "JavaScript", category: "Frontend", color: "#f7df1e" },
  { name: "Tailwind", category: "Frontend", color: "#38bdf8" },
  { name: "HTML", category: "Frontend", color: "#e34f26" },
  { name: "CSS", category: "Frontend", color: "#8b5cf6" },
  { name: "GSAP", category: "Animacje i 3D", color: "#88ce02" },
  { name: "Motion", category: "Animacje i 3D", color: "#f472b6" },
  { name: "Spline", category: "Animacje i 3D", color: "#ff6b9d" },
  { name: "Three.js", category: "Animacje i 3D", color: "#a78bfa" },
  { name: "GLSL", category: "Animacje i 3D", color: "#fb923c" },
  { name: "Node.js", category: "Backend i dane", color: "#78c257" },
  { name: "PostgreSQL", category: "Backend i dane", color: "#699eca" },
  { name: "Prisma", category: "Backend i dane", color: "#f0ad4e" },
  { name: "Stripe", category: "Backend i dane", color: "#a78bfa" },
  { name: "Firebase", category: "Backend i dane", color: "#ffca28" },
  { name: "WebSockets", category: "Backend i dane", color: "#5eead4" },
  { name: "D3.js", category: "Backend i dane", color: "#f9a03f" },
  { name: "Redux", category: "Backend i dane", color: "#b197fc" },
  { name: "Storybook", category: "Narzędzia", color: "#ff4785" },
  { name: "Figma", category: "Narzędzia", color: "#f24e1e" },
  { name: "Git", category: "Narzędzia", color: "#f05032" },
];

export function getTechnology(
  name: string,
  dictionary: Technology[] = technologyDictionary,
): Technology {
  return (
    dictionary.find((technology) => technology.name === name) ?? {
      name,
      category: "Pozostałe",
      color: "#04b2d9",
    }
  );
}

export function useTechnologies() {
  const [technologies, setTechnologies] = useState(technologyDictionary);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!db) {
      setError("Firebase nie jest skonfigurowany.");
      return;
    }
    return onSnapshot(
      collection(db, "technologies"),
      (snapshot) => {
        setError("");
        if (snapshot.empty) {
          setTechnologies(technologyDictionary);
          return;
        }
        setTechnologies(
          snapshot.docs.map((technology) => ({
            ...technology.data(),
            id: technology.id,
          })) as Technology[],
        );
      },
      (snapshotError) => {
        setError(
          snapshotError.code === "permission-denied"
            ? "Brak dostępu do kolekcji technologies. Opublikuj zaktualizowane firestore.rules."
            : "Nie udało się połączyć z katalogiem technologii Firebase.",
        );
      },
    );
  }, []);

  return { technologies, error };
}