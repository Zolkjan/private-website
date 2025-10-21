import type { Metadata } from "next";
import { Montserrat_Alternates } from "next/font/google";
import "./globals.css";
import MainNavigation from "@/components/MainNavigation";

const montserratAlternates = Montserrat_Alternates({
  subsets: ["latin"],
  variable: "--font-montserrat-alternates",
  weight: ["400", "500", "700"], // wybierz wagi jakie chcesz
});

export const metadata: Metadata = {
  title: "CreativePath",
  description: "Jan Żółkiewski - witaj w moimkreatywnym świecie!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body
        className={`${montserratAlternates.variable} antialiased bg-black relative flex justify-center`}
      >
        <MainNavigation />
        {children}
      </body>
    </html>
  );
}
