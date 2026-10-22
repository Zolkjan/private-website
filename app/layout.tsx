import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import MainNavigation from "@/components/MainNavigation";
import ScrollProgress from "@/components/ScrollProgress";

const manrope = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CreativePath — tworzenie stron internetowych i aplikacji",
  description:
    "Projektuję i programuję strony internetowe oraz aplikacje webowe. CreativePath — autorskie projekty, responsywność i animacje. Dodatkowo nagrywam i montuję wideo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className="scroll-smooth" data-scroll-behavior="smooth">
      <body
        className={`${manrope.variable} font-[family-name:var(--font-manrope)] antialiased bg-[#0a0a0a] text-[#e6f7fb] overflow-x-hidden`}
      >
        <ScrollProgress />
        <MainNavigation />
        {children}
      </body>
    </html>
  );
}
