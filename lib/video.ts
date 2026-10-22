export const videoCategories = [
  { id: "reels", label: "Rolki i social media", description: "Krótkie materiały przygotowane do publikacji w mediach społecznościowych." },
  { id: "ads", label: "Reklamy", description: "Filmy promujące produkty, usługi i kampanie." },
  { id: "brand", label: "Filmy wizerunkowe", description: "Historie marek, ludzi i miejsc." },
  { id: "web-video", label: "Strona + wideo", description: "Realizacje łączące stronę lub aplikację z materiałami wideo." },
] as const;

export const videoFormats = [
  { id: "portrait", label: "Pion · 9:16", ratio: "9 / 16", playerWidth: "39.375svh" },
  { id: "landscape", label: "Poziom · 16:9", ratio: "16 / 9", playerWidth: "124.444svh" },
  { id: "square", label: "Kwadrat · 1:1", ratio: "1 / 1", playerWidth: "70svh" },
] as const;

export const videoServices = [
  { id: "concept", label: "Pomysł i scenariusz" },
  { id: "filming", label: "Nagranie" },
  { id: "editing", label: "Montaż" },
  { id: "web", label: "Strona lub aplikacja" },
] as const;

export type VideoCategoryId = (typeof videoCategories)[number]["id"];
export type VideoFormatId = (typeof videoFormats)[number]["id"];
export type VideoServiceId = (typeof videoServices)[number]["id"];

export interface VideoProject {
  id: string;
  title: string;
  description: string;
  category: VideoCategoryId;
  format: VideoFormatId;
  services: VideoServiceId[];
  videoUrl: string;
  posterUrl: string;
  posterPath: string;
  captionsUrl: string;
  client: string;
  year: string;
  duration: string;
  relatedProjectId: string;
  featured: boolean;
  published: boolean;
  order: number;
}

export function isHttpsUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch { return false; }
}

export type VideoSource =
  | { kind: "embed"; src: string; provider: "YouTube" | "Vimeo" }
  | { kind: "file"; src: string; mime: "video/mp4" | "video/webm" };

// Build embeds from known hosts and IDs; never render arbitrary iframe markup.
export function getVideoSource(value: string): VideoSource | null {
  if (!isHttpsUrl(value)) return null;
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    const path = url.pathname.split("/").filter(Boolean);
    if (["youtube.com", "www.youtube.com", "m.youtube.com", "youtube-nocookie.com", "www.youtube-nocookie.com", "youtu.be"].includes(host)) {
      const id = host === "youtu.be"
        ? path[0]
        : path[0] === "watch" ? url.searchParams.get("v")
        : ["shorts", "embed", "live"].includes(path[0]) ? path[1] : null;
      return id && /^[a-zA-Z0-9_-]{11}$/.test(id)
        ? { kind: "embed", provider: "YouTube", src: "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0" }
        : null;
    }
    if (["vimeo.com", "www.vimeo.com", "player.vimeo.com"].includes(host)) {
      const id = host === "player.vimeo.com" && path[0] === "video" ? path[1] : path[0];
      if (!id || !/^\d+$/.test(id)) return null;
      const hash = url.searchParams.get("h") || (host !== "player.vimeo.com" ? path[1] : "") || "";
      if (hash && !/^[a-zA-Z0-9]+$/.test(hash)) return null;
      const params = new URLSearchParams({ autoplay: "1", dnt: "1" });
      if (hash) params.set("h", hash);
      return { kind: "embed", provider: "Vimeo", src: "https://player.vimeo.com/video/" + id + "?" + params.toString() };
    }
    const filePath = decodeURIComponent(url.pathname).toLowerCase();
    if (/\.(mp4|webm)$/.test(filePath)) {
      return { kind: "file", src: url.href, mime: filePath.endsWith(".webm") ? "video/webm" : "video/mp4" };
    }
  } catch { /* Invalid or malformed URLs cannot be played. */ }
  return null;
}

export function getVideoCategory(id: VideoCategoryId) {
  return videoCategories.find((category) => category.id === id)!;
}
export function getVideoFormat(id: VideoFormatId) {
  return videoFormats.find((format) => format.id === id)!;
}

export function readVideoProject(value: unknown): VideoProject | null {
  if (!value || typeof value !== "object") return null;
  const data = value as Record<string, unknown>;
  if (typeof data.id !== "string" || typeof data.title !== "string" ||
      !videoCategories.some(({ id }) => id === data.category) ||
      !videoFormats.some(({ id }) => id === data.format)) return null;
  const text = (field: string) => typeof data[field] === "string" ? data[field] as string : "";
  return {
    id: data.id, title: data.title, description: text("description"),
    category: data.category as VideoCategoryId, format: data.format as VideoFormatId,
    services: videoServices.filter(({ id }) => Array.isArray(data.services) && data.services.includes(id)).map(({ id }) => id),
    videoUrl: text("videoUrl"), posterUrl: text("posterUrl"), posterPath: text("posterPath"),
    captionsUrl: text("captionsUrl"), client: text("client"), year: text("year"),
    duration: text("duration"), relatedProjectId: text("relatedProjectId"),
    featured: data.featured === true, published: data.published === true,
    order: typeof data.order === "number" && Number.isFinite(data.order) ? data.order : 0,
  };
}
