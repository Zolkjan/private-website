import type { Metadata } from "next";
import { Montserrat_Alternates } from "next/font/google";
import "./globals.css";
import MainNavigation from "@/components/MainNavigation";
import CustomCursor from "@/components/CustomCursor";

const montserratAlternates = Montserrat_Alternates({
  subsets: ["latin"],
  variable: "--font-montserrat-alternates",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Jan Żółkiewski — CreativePath",
  description:
    "Frontend Developer & Creative Coder — nowoczesne strony, animacje GSAP, Three.js, Next.js.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className="scroll-smooth">
      <body
        className={`${montserratAlternates.variable} font-[family-name:var(--font-montserrat-alternates)] antialiased bg-[#0a0a0a] text-[#e6f7fb] overflow-x-hidden`}
      >
        <CustomCursor />
        <MainNavigation />
        {children}
      </body>
    </html>
  );
}
