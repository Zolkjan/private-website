"use client";

import { useSyncExternalStore } from "react";

type StoreSnapshot = { data: unknown; error: string };
const emptySnapshot: StoreSnapshot = { data: null, error: "" };

// Share one live subscription per resource and defer the SDK until after paint.
function createStore(path: string, kind: "document" | "collection", publishedOnly = false) {
  let snapshot = emptySnapshot;
  const listeners = new Set<() => void>();
  let stop: (() => void) | undefined;
  const publish = (next: StoreSnapshot) => {
    snapshot = next;
    listeners.forEach((listener) => listener());
  };
  const start = () => {
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;
    const connect = async () => {
      try {
        const [{ db }, { collection, doc, onSnapshot, query, where }] = await Promise.all([
          import("@/lib/firebase-public"), import("firebase/firestore"),
        ]);
        if (cancelled) return;
        if (!db) {
          publish({ data: null, error: "Firebase nie jest skonfigurowany." });
          return;
        }
        const onError = () => publish({ ...snapshot, error: "Nie udało się pobrać danych. Spróbuj ponownie później." });
        unsubscribe = kind === "document"
          ? onSnapshot(doc(db, path), (value) => publish({ data: value.exists() ? value.data() : null, error: "" }), onError)
          : onSnapshot(publishedOnly ? query(collection(db, path), where("published", "==", true)) : collection(db, path), (value) => publish({ data: value.docs.map((item) => ({ ...item.data(), id: item.id })), error: "" }), onError);
      } catch {
        if (!cancelled) publish({ ...snapshot, error: "Nie udało się połączyć z bazą danych." });
      }
    };
    const idle = typeof window.requestIdleCallback === "function";
    const handle = idle
      ? window.requestIdleCallback(() => void connect(), { timeout: 1200 })
      : window.setTimeout(() => void connect(), 0);
    stop = () => {
      cancelled = true;
      if (idle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
      unsubscribe?.();
    };
  };
  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      if (listeners.size === 1) start();
      return () => {
        listeners.delete(listener);
        if (listeners.size === 0) stop?.();
      };
    },
    getSnapshot: () => snapshot,
    getServerSnapshot: () => emptySnapshot,
  };
}

const stores = {
  content: createStore("siteContent/main", "document"),
  profile: createStore("siteContent/profile", "document"),
  projects: createStore("projects", "collection"),
  technologies: createStore("technologies", "collection"),
  videos: createStore("videos", "collection", true),
};

export function usePublicData<T>(resource: keyof typeof stores) {
  const store = stores[resource];
  const value = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  return { data: value.data as T | null, error: value.error };
}
