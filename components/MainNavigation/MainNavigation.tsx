"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Dialog } from "radix-ui";
import { Button } from "@/components/ui/button";
import FullCreativePathLogo from "@/public/FullCreativePathLogo.svg";

const navLinks = [
  { href: "/", label: "Strona główna" },
  { href: "/about-me", label: "O mnie" },
  { href: "/projects", label: "Projekty" },
  { href: "/contact", label: "Kontakt" },
];

export default function MainNavigation() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;
  return <PublicNavigation key={pathname} pathname={pathname} />;
}

function PublicNavigation({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  return (
    <header className="pointer-events-none fixed inset-x-0 top-3 z-50 sm:top-4">
      <div className="site-container">
        <div className="pointer-events-auto flex items-center justify-between gap-5 rounded-2xl border border-white/15 bg-[#0d1418]/95 px-4 py-3 shadow-lg sm:px-6">
          <Link href="/" aria-label="CreativePath — strona główna" className="shrink-0">
            <Image src={FullCreativePathLogo} alt="CreativePath" height={40} priority className="h-9 w-auto invert sm:h-10" />
          </Link>
          <nav aria-label="Nawigacja główna" className="hidden items-center gap-7 lg:flex">
            {navLinks.map((link) => <Link key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined}
              className={`text-sm transition-colors hover:text-white ${pathname === link.href ? "text-[#67dbe8]" : "text-[#aebbc3]"}`}>{link.label}</Link>)}
          </nav>
          <Button asChild variant="outline" className="hidden rounded-full border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white lg:inline-flex">
            <Link href="/contact">Zacznijmy projekt <ArrowUpRight /></Link>
          </Button>
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <Button variant="ghost" size="icon" aria-label="Otwórz menu" className="text-white hover:bg-white/10 hover:text-white lg:hidden"><Menu /></Button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/70" />
              <Dialog.Content className="fixed inset-x-4 top-4 z-[70] rounded-2xl border border-white/15 bg-[#0d1418] p-6 text-white" aria-describedby={undefined}>
                <div className="mb-8 flex items-center justify-between">
                  <Dialog.Title className="text-sm font-semibold">CreativePath</Dialog.Title>
                  <Dialog.Close asChild><Button variant="ghost" size="icon" aria-label="Zamknij menu" className="hover:bg-white/10 hover:text-white"><X /></Button></Dialog.Close>
                </div>
                <nav aria-label="Menu mobilne" className="flex flex-col gap-2">
                  {navLinks.map((link) => <Dialog.Close asChild key={link.href}>
                    <Link href={link.href} aria-current={pathname === link.href ? "page" : undefined}
                      className={`rounded-lg px-3 py-4 text-xl tracking-tight hover:bg-white/5 ${pathname === link.href ? "text-[#67dbe8]" : "text-white"}`}>{link.label}</Link>
                  </Dialog.Close>)}
                </nav>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
    </header>
  );
}
