"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface ProfileSettings {
  displayName: string;
  role: string;
  email: string;
  location: string;
  availability: string;
  bio: string;
  cvUrl: string;
  github: string;
  linkedin: string;
  instagram: string;
  experience: string;
  projectCount: string;
  commitment: string;
  skills: string[];
}

export const defaultProfile: ProfileSettings = {
  displayName: "Jan Żółkiewski",
  role: "Frontend Developer",
  email: "jan@creativepath.pl",
  location: "Polska",
  availability: "Dostępny do nowych projektów",
  bio: "Frontend Developer i Creative Coder z pasją do nowoczesnych animacji i wyjątkowych interfejsów. Tworzę strony, które nie tylko wyglądają świetnie, ale też zachwycają ruchem i interakcją.",
  cvUrl: "/cv.pdf",
  github: "https://github.com",
  linkedin: "https://linkedin.com",
  instagram: "https://instagram.com",
  experience: "3+",
  projectCount: "20+",
  commitment: "100%",
  skills: ["React", "Next.js", "TypeScript", "GSAP", "Three.js", "Tailwind CSS", "Node.js", "Figma"],
};

export function useProfile() {
  const [profile, setProfile] = useState(defaultProfile);

  useEffect(() => {
    if (!db) return;
    return onSnapshot(
      doc(db, "siteContent", "profile"),
      (snapshot) => {
        if (snapshot.exists()) {
          setProfile({ ...defaultProfile, ...snapshot.data() } as ProfileSettings);
        }
      },
      (error) => console.error("Nie udało się pobrać danych profilu:", error),
    );
  }, []);

  return profile;
}