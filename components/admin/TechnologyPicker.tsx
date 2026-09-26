"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getTechnology, useTechnologies } from "@/lib/technologies";

export default function TechnologyPicker({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (technologies: string[]) => void;
}) {
  const [query, setQuery] = useState("");
  const { technologies: technologyDictionary } = useTechnologies();
  const options = useMemo(() => {
    const knownNames = new Set(technologyDictionary.map(({ name }) => name));
    const legacyOptions = selected
      .filter((name) => !knownNames.has(name))
      .map((name) => getTechnology(name));
    return [...technologyDictionary, ...legacyOptions].filter((technology) =>
      technology.name.toLowerCase().includes(query.trim().toLowerCase()),
    );
  }, [query, selected, technologyDictionary]);
  const groups = options.reduce<Record<string, typeof options>>((result, technology) => {
    (result[technology.category] ??= []).push(technology);
    return result;
  }, {});

  const toggle = (name: string, checked: boolean) => {
    onChange(
      checked
        ? [...selected, name]
        : selected.filter((technology) => technology !== name),
    );
  };

  return (
    <div className="space-y-3 sm:col-span-2">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <Label>Technologie projektu</Label>
        <span className="text-xs text-[#789099]">{selected.length} wybranych</span>
      </div>

      {selected.length > 0 ? (
        <div className="flex min-h-10 flex-wrap gap-2" aria-label="Wybrane technologie">
          {selected.map((name) => {
            const technology = getTechnology(name, technologyDictionary);
            return (
              <span
                key={name}
                className="inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-1 text-xs"
                style={{
                  color: technology.color,
                  borderColor: `${technology.color}55`,
                  backgroundColor: `${technology.color}12`,
                }}
              >
                <span className="size-1.5 rounded-full" style={{ backgroundColor: technology.color }} />
                {name}
                <button
                  type="button"
                  aria-label={`Usuń technologię ${name}`}
                  onClick={() => toggle(name, false)}
                  className="ml-0.5 text-current opacity-70 transition-opacity hover:opacity-100"
                >
                  <X size={12} />
                </button>
              </span>
            );
          })}
        </div>
      ) : (
        <p className="py-1 text-xs text-[#789099]">Wybierz technologie z katalogu poniżej.</p>
      )}

      <div className="border border-[#26373d] bg-[#090e10]">
        <div className="relative border-b border-[#26373d]">
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#789099]" />
          <Input
            aria-label="Szukaj technologii"
            placeholder="Szukaj w słowniku..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-10 rounded-none border-0 bg-transparent pl-9 shadow-none focus-visible:ring-0"
          />
        </div>
        <div className="max-h-64 space-y-4 overflow-y-auto p-4">
          {Object.entries(groups).length === 0 ? (
            <p className="py-2 text-sm text-[#789099]">Nie znaleziono technologii.</p>
          ) : (
            Object.entries(groups).map(([category, technologies]) => (
              <fieldset key={category}>
                <legend className="mb-2 text-[10px] uppercase tracking-[0.18em] text-[#789099]">
                  {category}
                </legend>
                <div className="grid gap-1 sm:grid-cols-2">
                  {technologies.map((technology) => {
                    const id = `technology-${technology.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
                    return (
                      <label
                        key={technology.name}
                        htmlFor={id}
                        className="flex cursor-pointer items-center gap-2.5 px-2 py-2 text-sm text-[#c4d3d8] transition-colors hover:bg-[#111b1e]"
                      >
                        <Checkbox
                          id={id}
                          checked={selected.includes(technology.name)}
                          onCheckedChange={(checked) => toggle(technology.name, checked === true)}
                        />
                        <span className="size-2 rounded-full" style={{ backgroundColor: technology.color }} />
                        {technology.name}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            ))
          )}
        </div>
      </div>
    </div>
  );
}