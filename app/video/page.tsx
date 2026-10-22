import type { Metadata } from "next";
import VideoPortfolio from "@/components/video/VideoPortfolio";

export const metadata: Metadata = {
  title: "Portfolio wideo — rolki, reklamy i montaż | CreativePath",
  description: "Nagrywanie i montaż rolek, reklam oraz filmów wizerunkowych. Zobacz portfolio wideo CreativePath i realizacje łączące film ze stronami internetowymi.",
};

export default function VideoPage() {
  return <VideoPortfolio />;
}
