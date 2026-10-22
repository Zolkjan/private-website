"use client";

import { useMemo } from "react";
import { usePublicData } from "@/lib/public-data-store";
import { readVideoProject, type VideoProject } from "@/lib/video";

export function useVideos() {
  const { data, error } = usePublicData<unknown[]>("videos");
  const videos = useMemo(() => (data ?? [])
    .map(readVideoProject)
    .filter((video): video is VideoProject => video !== null && video.published)
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, "pl")), [data]);
  return { videos, loading: data === null && !error, error };
}
