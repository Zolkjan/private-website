"use client";

import { useMemo, useState, type FormEvent } from "react";
import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { Layers3, Plus, RotateCcw, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db } from "@/lib/firebase";
import { getTechnology, useTechnologies, type Technology } from "@/lib/technologies";

const emptyDraft = { name: "", category: "Frontend", color: "#04b2d9" };

export default function AdminTechnologiesPage() {
  const { technologies, error: dictionaryError } = useTechnologies();
  const [draft, setDraft] = useState(emptyDraft);
  const [editingId, setEditingId] = useState("");
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const groups = useMemo(
    () => technologies.reduce<Record<string, Technology[]>>((result, technology) => {
      (result[technology.category] ??= []).push(technology);
      return result;
    }, {}),
    [technologies],
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!db) {
      setNotice("Firebase nie jest skonfigurowany.");
      return;
    }
    const duplicate = technologies.some(
      (technology) => technology.name.toLowerCase() === draft.name.trim().toLowerCase()
        && technology.id !== editingId,
    );
    if (duplicate) {
      setNotice("Technologia o tej nazwie już istnieje.");
      return;
    }

    setSaving(true);
    setNotice("");
    const id = editingId || draft.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    try {
      await setDoc(doc(db, "technologies", id), {
        name: editingId ? technologies.find((item) => item.id === editingId)?.name ?? draft.name.trim() : draft.name.trim(),
        category: draft.category.trim(),
        color: draft.color,
      });
      setDraft(emptyDraft);
      setEditingId("");
      setNotice(editingId ? "Zapisano kategorię i kolor." : "Dodano technologię do słownika.");
    } catch {
      setNotice("Nie udało się zapisać słownika. Opublikuj najnowsze reguły firestore.rules i sprawdź uprawnienia administratora.");
    } finally {
      setSaving(false);
    }
  };

  const editTechnology = (technology: Technology) => {
    setEditingId(technology.id ?? technology.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
    setDraft({
      name: technology.name,
      category: technology.category,
      color: technology.color,
    });
  };

  const removeTechnology = async (technology: Technology) => {
    if (!db || !technology.id || !window.confirm(`Usunąć „${technology.name}” ze słownika?`)) return;
    try {
      await deleteDoc(doc(db, "technologies", technology.id));
      if (editingId === technology.id) {
        setEditingId("");
        setDraft(emptyDraft);
      }
      setNotice("Usunięto technologię ze słownika.");
    } catch {
      setNotice("Nie udało się usunąć technologii. Sprawdź uprawnienia Firestore.");
    }
  };

  const categories = Object.keys(groups);

  return (
    <div>
      <div className="mb-8">
        <p className="mb-2 text-[10px] uppercase tracking-[0.24em] text-[#04b2d9]">Konfiguracja portfolio</p>
        <h1 className="text-3xl font-bold sm:text-4xl">Słownik technologii</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#8ea4ab]">
          Zarządzaj pozycjami dostępnymi w selektorze projektu. Zmiany kategorii i kolorów odświeżają się także w prezentacji projektów.
        </p>
      </div>

      {notice && <p role="status" className="mb-5 border border-[#23515b] bg-[#0b2024] px-4 py-3 text-sm text-[#a5e8f2]">{notice}</p>}
      {dictionaryError && <p role="status" className="mb-5 border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm leading-relaxed text-amber-100">{dictionaryError}</p>}

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(300px,0.68fr)]">
        <Card className="gap-0 border-[#22363c] bg-[#0d1315]">
          <CardHeader className="border-b border-[#1c2a2e] px-5 py-5 sm:px-7">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center border border-[#04b2d9]/25 bg-[#04b2d9]/10 text-[#05dbf2]"><Layers3 size={18} /></div>
              <div>
                <CardTitle className="text-base">Dostępne technologie</CardTitle>
                <CardDescription className="mt-1 text-[#789099]">{technologies.length} pozycji · {categories.length} kategorii</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-7 px-5 py-6 sm:px-7">
            {categories.map((category) => (
              <section key={category}>
                <h2 className="mb-3 text-[10px] uppercase tracking-[0.2em] text-[#789099]">{category}</h2>
                <ul className="divide-y divide-[#1c2a2e] border-y border-[#1c2a2e]">
                  {groups[category].map((technology) => (
                    <li key={technology.id ?? technology.name} className="flex items-center justify-between gap-3 py-2.5">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="size-3 shrink-0 border border-white/15" style={{ backgroundColor: technology.color }} />
                        <span className="truncate text-sm text-[#d8e6e9]">{technology.name}</span>
                        <span className="hidden text-xs text-[#60777e] sm:inline">{technology.color.toUpperCase()}</span>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <Button variant="ghost" size="sm" onClick={() => editTechnology(technology)}>Edytuj</Button>
                        <Button variant="ghost" size="icon-sm" aria-label={`Usuń ${technology.name}`} onClick={() => void removeTechnology(technology)} className="text-rose-300 hover:bg-rose-950/40 hover:text-rose-200"><Trash2 /></Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </CardContent>
        </Card>

        <Card className="gap-0 border-[#22363c] bg-[#0d1315]">
          <CardHeader className="border-b border-[#1c2a2e] px-5 py-5 sm:px-6">
            <CardTitle className="text-base">{editingId ? "Edytuj technologię" : "Dodaj technologię"}</CardTitle>
            <CardDescription className="text-[#789099]">
              {editingId ? "Nazwa zostaje bez zmian; możesz zmienić kategorię i kolor." : "Nowa pozycja od razu trafi do selektora projektów."}
            </CardDescription>
          </CardHeader>
          <CardContent className="px-5 py-6 sm:px-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="technology-name">Nazwa</Label>
                <Input id="technology-name" required maxLength={40} value={draft.name} disabled={Boolean(editingId)} onChange={(event) => setDraft({ ...draft, name: event.target.value })} placeholder="np. Astro" className="border-[#2a3b40] bg-[#090e10]" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="technology-category">Kategoria</Label>
                <Input id="technology-category" required maxLength={40} list="technology-categories" value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })} placeholder="np. Frontend" className="border-[#2a3b40] bg-[#090e10]" />
                <datalist id="technology-categories">
                  {categories.map((category) => <option key={category} value={category} />)}
                </datalist>
              </div>
              <div className="space-y-2">
                <Label htmlFor="technology-color">Kolor</Label>
                <div className="flex items-center gap-3">
                  <Input id="technology-color" type="color" value={draft.color} onChange={(event) => setDraft({ ...draft, color: event.target.value })} className="h-11 w-16 cursor-pointer border-[#2a3b40] bg-[#090e10] p-1" />
                  <Input aria-label="Kod koloru" value={draft.color.toUpperCase()} onChange={(event) => setDraft({ ...draft, color: event.target.value })} pattern="^#[0-9A-Fa-f]{6}$" className="border-[#2a3b40] bg-[#090e10] font-mono uppercase" />
                </div>
              </div>
              <div className="flex items-center gap-2 border border-[#26373d] bg-[#090e10] px-3 py-2.5">
                <span className="size-2 rounded-full" style={{ backgroundColor: draft.color }} />
                <span className="text-xs" style={{ color: draft.color }}>{draft.name || "Podgląd technologii"}</span>
                <span className="ml-auto text-[10px] uppercase tracking-wider text-[#789099]">{draft.category}</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                <Button type="submit" disabled={saving || !draft.name.trim()}>
                  {editingId ? <Save /> : <Plus />} {saving ? "Zapisywanie..." : editingId ? "Zapisz zmiany" : "Dodaj do słownika"}
                </Button>
                {editingId && <Button type="button" variant="outline" onClick={() => { setEditingId(""); setDraft(emptyDraft); }}><RotateCcw /> Anuluj</Button>}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}