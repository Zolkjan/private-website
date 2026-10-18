export const projectCategories = [
  {
    id: "websites",
    label: "Strony internetowe",
    projectLabel: "Strona internetowa",
    description: "Strony firmowe, portfolio i landing page’e.",
  },
  {
    id: "ecommerce",
    label: "Sklepy internetowe",
    projectLabel: "Sklep internetowy",
    description: "Sklepy z katalogiem produktów, koszykiem i płatnościami online.",
  },
  {
    id: "web-apps",
    label: "Aplikacje webowe",
    projectLabel: "Aplikacja webowa",
    description: "Aplikacje, panele i narzędzia ułatwiające codzienną pracę.",
  },
  {
    id: "ui-motion",
    label: "Interfejsy i animacje",
    projectLabel: "Interfejs i animacje",
    description: "Komponenty, interfejsy i interaktywne animacje.",
  },
  {
    id: "other",
    label: "Pozostałe realizacje",
    projectLabel: "Pozostałe realizacje",
    description: "Inne projekty i eksperymenty.",
  },
] as const;

export type ProjectCategoryId = (typeof projectCategories)[number]["id"];

export function isProjectCategoryId(value: unknown): value is ProjectCategoryId {
  return projectCategories.some((category) => category.id === value);
}

export function getProjectCategory(project: { category?: string; subtitle?: string }) {
  const explicitCategory = projectCategories.find(({ id }) => id === project.category);
  if (explicitCategory) return explicitCategory;

  // Older Firestore records have no category. Use their project type, never their
  // technologies, until a category is explicitly selected in the editor.
  const subtitle = (project.subtitle ?? "").toLocaleLowerCase("pl");
  let categoryId: ProjectCategoryId = "other";
  if (/\b(e[ -]?commerce|sklep\w*|shop|store)\b/u.test(subtitle)) {
    categoryId = "ecommerce";
  } else if (/\b(app|application|aplikacj\w*|dashboard|panel\w*)\b/u.test(subtitle)) {
    categoryId = "web-apps";
  } else if (/\b(website|web site|strona|strony|serwis|portfolio|landing|creative agency)\b/u.test(subtitle)) {
    categoryId = "websites";
  } else if (/\b(component library|biblioteka komponentów|design system|ui|interfejs\w*|animacj\w*)\b/u.test(subtitle)) {
    categoryId = "ui-motion";
  }
  return projectCategories.find(({ id }) => id === categoryId)!;
}
