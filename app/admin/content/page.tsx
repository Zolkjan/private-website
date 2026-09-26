"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { defaultSiteContent, useSiteContent, type SiteContent } from "@/lib/firestore-hooks";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function AdminContentPage() {
  const content = useSiteContent(defaultSiteContent);
  const [draft, setDraft] = useState<SiteContent>(defaultSiteContent);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => setDraft(content), [content]);

  const saveContent = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!db) return;
    setSaving(true);
    setMessage("");
    try {
      await setDoc(doc(db, "siteContent", "main"), draft, { merge: true });
      setMessage("Zmiany zostały zapisane.");
    } catch {
      setMessage("Nie udało się zapisać zmian. Sprawdź reguły Firestore.");
    } finally {
      setSaving(false);
    }
  };

  const setField = (field: keyof SiteContent, value: string) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  return (
    <div className="max-w-5xl">
      <div className="mb-8">
        <p className="mb-2 text-[10px] uppercase tracking-[0.24em] text-[#04b2d9]">Zarządzanie stroną</p>
        <h1 className="text-3xl font-bold sm:text-4xl">Treści strony</h1>
        <p className="mt-2 text-sm text-[#8ea4ab]">Zmieniaj teksty widoczne w sekcjach głównej strony.</p>
      </div>

      <Card className="gap-0 border-[#22363c] bg-[#0d1315]">
        <CardHeader className="border-b border-[#1c2a2e] px-6 py-5 sm:px-8">
          <CardTitle className="text-lg">Teksty portfolio</CardTitle>
          <CardDescription className="text-[#8ea4ab]">Zmiany pojawią się na stronie po zapisaniu.</CardDescription>
        </CardHeader>
        <CardContent className="px-6 py-6 sm:px-8">
          <form onSubmit={saveContent} className="grid gap-6 md:grid-cols-2">
            <ContentTextarea label="Opis sekcji głównej" value={draft.heroDescription} onChange={(value) => setField("heroDescription", value)} />
            <ContentTextarea label="Opis sekcji kontaktowej" value={draft.contactDescription} onChange={(value) => setField("contactDescription", value)} />
            <ContentTextarea label="O mnie — pierwszy akapit" value={draft.aboutFirstParagraph} onChange={(value) => setField("aboutFirstParagraph", value)} />
            <ContentTextarea label="O mnie — drugi akapit" value={draft.aboutSecondParagraph} onChange={(value) => setField("aboutSecondParagraph", value)} />
            {message && <p role="status" className="text-sm text-[#a5e8f2] md:col-span-2">{message}</p>}
            <Button type="submit" disabled={saving} className="justify-self-start uppercase tracking-[0.12em]">
              <Save /> {saving ? "Zapisywanie..." : "Zapisz treści"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function ContentTextarea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const id = `content-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Textarea id={id} value={value} onChange={(event) => onChange(event.target.value)} className="min-h-28 resize-y border-[#2a3b40] bg-[#090e10] focus-visible:border-[#04b2d9] focus-visible:ring-[#04b2d9]/30" />
    </div>
  );
}