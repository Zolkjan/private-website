"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Save, UserRound } from "lucide-react";
import { doc, setDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { defaultProfile, useProfile, type ProfileSettings } from "@/lib/profile";
import { db } from "@/lib/firebase";

export default function AdminProfilePage() {
  const profile = useProfile();
  const [draft, setDraft] = useState<ProfileSettings>(defaultProfile);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  useEffect(() => setDraft(profile), [profile]);

  const setField = <K extends keyof ProfileSettings>(field: K, value: ProfileSettings[K]) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!db) {
      setNotice("Firebase nie jest skonfigurowany.");
      return;
    }
    setSaving(true);
    setNotice("");
    try {
      await setDoc(doc(db, "siteContent", "profile"), draft, { merge: true });
      setNotice("Dane profilu zostały zapisane.");
    } catch {
      setNotice("Nie udało się zapisać profilu. Sprawdź uprawnienia Firestore.");
    } finally {
      setSaving(false);
    }
  };

  const skillsText = draft.skills.join(", ");

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <p className="mb-2 text-[10px] uppercase tracking-[0.24em] text-[#04b2d9]">Ustawienia strony</p>
        <h1 className="text-3xl font-bold sm:text-4xl">Dane profilowe</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#8ea4ab]">Zarządzaj informacjami, które pojawiają się w hero, sekcji „O mnie”, kontakcie i podstronie profilu.</p>
      </div>

      {notice && <p role="status" className="mb-5 border border-[#23515b] bg-[#0b2024] px-4 py-3 text-sm text-[#a5e8f2]">{notice}</p>}

      <form onSubmit={saveProfile} className="space-y-6">
        <Card className="gap-0 border-[#22363c] bg-[#0d1315]">
          <CardHeader className="border-b border-[#1c2a2e] px-5 py-5 sm:px-7">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center border border-[#04b2d9]/25 bg-[#04b2d9]/10 text-[#05dbf2]"><UserRound size={18} /></div>
              <div>
                <CardTitle className="text-base">Podstawowe informacje</CardTitle>
                <CardDescription className="mt-1 text-[#789099]">Nazwa, specjalizacja i dane kontaktowe.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid gap-5 px-5 py-6 sm:grid-cols-2 sm:px-7">
            <ProfileInput label="Imię i nazwisko" value={draft.displayName} onChange={(value) => setField("displayName", value)} required />
            <ProfileInput label="Rola / stanowisko" value={draft.role} onChange={(value) => setField("role", value)} required />
            <ProfileInput label="Adres e-mail" type="email" value={draft.email} onChange={(value) => setField("email", value)} required />
            <ProfileInput label="Lokalizacja" value={draft.location} onChange={(value) => setField("location", value)} />
            <ProfileInput label="Status dostępności" value={draft.availability} onChange={(value) => setField("availability", value)} />
            <ProfileInput label="Link do CV" value={draft.cvUrl} onChange={(value) => setField("cvUrl", value)} placeholder="https://... lub /cv.pdf" />
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="profile-bio">Krótki opis profilu</Label>
              <Textarea id="profile-bio" value={draft.bio} onChange={(event) => setField("bio", event.target.value)} className="min-h-28 resize-y border-[#2a3b40] bg-[#090e10]" />
            </div>
          </CardContent>
        </Card>

        <Card className="gap-0 border-[#22363c] bg-[#0d1315]">
          <CardHeader className="border-b border-[#1c2a2e] px-5 py-5 sm:px-7">
            <CardTitle className="text-base">Linki i statystyki</CardTitle>
            <CardDescription className="text-[#789099]">Puste linki do social mediów są ukrywane na stronie.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-5 px-5 py-6 sm:grid-cols-2 sm:px-7">
            <ProfileInput label="GitHub" type="url" value={draft.github} onChange={(value) => setField("github", value)} />
            <ProfileInput label="LinkedIn" type="url" value={draft.linkedin} onChange={(value) => setField("linkedin", value)} />
            <ProfileInput label="Instagram" type="url" value={draft.instagram} onChange={(value) => setField("instagram", value)} />
            <ProfileInput label="Doświadczenie (wartość)" value={draft.experience} onChange={(value) => setField("experience", value)} />
            <ProfileInput label="Projekty (wartość)" value={draft.projectCount} onChange={(value) => setField("projectCount", value)} />
            <ProfileInput label="Zaangażowanie (wartość)" value={draft.commitment} onChange={(value) => setField("commitment", value)} />
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="profile-skills">Umiejętności widoczne w „O mnie”</Label>
              <Input id="profile-skills" value={skillsText} onChange={(event) => setField("skills", event.target.value.split(",").map((skill) => skill.trim()).filter(Boolean))} className="border-[#2a3b40] bg-[#090e10]" />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={saving} className="uppercase tracking-[0.12em]">
          <Save /> {saving ? "Zapisywanie..." : "Zapisz profil"}
        </Button>
      </form>
    </div>
  );
}

function ProfileInput({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  const id = `profile-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} value={value} onChange={(event) => onChange(event.target.value)} required={required} placeholder={placeholder} className="border-[#2a3b40] bg-[#090e10]" />
    </div>
  );
}