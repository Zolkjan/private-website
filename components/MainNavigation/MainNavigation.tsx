"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Github, Instagram, Linkedin, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import FullCreativePathLogo from "@/public/FullCreativePathLogo.svg";
import { useProfile } from "@/lib/profile";

const navLinks = [
  { href: "/", label: "STRONA GŁÓWNA" },
  { href: "/about-me", label: "O MNIE" },
  { href: "/projects", label: "PROJEKTY" },
  { href: "/contact", label: "KONTAKT" },
];

const MainNavigation = () => {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;
  return <PublicNavigation pathname={pathname} />;
};

const PublicNavigation = ({ pathname }: { pathname: string }) => {
  const headerRef = useRef<HTMLElement>(null);
  const navBarRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const profile = useProfile();
  const socialLinks = [
    { href: profile.github, icon: <Github size={20} /> },
    { href: profile.linkedin, icon: <Linkedin size={20} /> },
    { href: profile.instagram, icon: <Instagram size={20} /> },
  ].filter((social) => social.href);

  // Direct DOM style mutation — no React re-renders on every scroll event
  useEffect(() => {
    const bar = navBarRef.current;
    if (!bar) return;

    let scrolled = window.scrollY > 30;

    const applyStyle = (isScrolled: boolean) => {
      if (isScrolled) {
        bar.style.borderColor = "rgba(5,219,242,0.24)";
        bar.style.background = "rgba(7,10,12,0.94)";
        bar.style.boxShadow = "0 12px 36px rgba(0,0,0,0.28), 0 0 28px rgba(5,219,242,0.06)";
      } else {
        bar.style.borderColor = "rgba(5,219,242,0.2)";
        bar.style.background = "rgba(7,10,12,0.82)";
        bar.style.boxShadow = "0 10px 32px rgba(0,0,0,0.22)";
      }
    };

    const onScroll = () => {
      const shouldScroll = window.scrollY > 30;
      if (shouldScroll === scrolled) return;
      scrolled = shouldScroll;
      applyStyle(shouldScroll);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    applyStyle(scrolled);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useGSAP(
    () => {
      gsap.from(headerRef.current, {
        y: -28,
        opacity: 0,
        duration: 0.7,
        delay: 0.15,
        ease: "power4.out",
      });
    },
    { scope: headerRef },
  );

  useEffect(() => {
    const menu = mobileMenuRef.current;
    if (!menu) return;
    if (menuOpen) {
      gsap.to(menu, {
        x: 0,
        opacity: 1,
        duration: 0.4,
        ease: "power3.out",
      });
      gsap.from(menu.querySelectorAll(".mobile-link"), {
        x: 40,
        opacity: 0,
        stagger: 0.08,
        duration: 0.4,
        ease: "power3.out",
        delay: 0.1,
      });
    } else {
      gsap.to(menu, {
        x: "100%",
        opacity: 0,
        duration: 0.35,
        ease: "power3.in",
      });
    }
  }, [menuOpen]);

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-4 z-50 w-full pointer-events-none"
      >
        <div className="mx-auto w-full max-w-7xl px-4 pointer-events-auto">
          <div
            ref={navBarRef}
            className="flex items-center justify-between rounded-2xl border px-4 py-3 transition-[background-color,border-color,box-shadow] duration-200 sm:px-6 sm:py-4 lg:px-8"
            style={{
              borderColor: "rgba(5,219,242,0.2)",
              background: "rgba(7,10,12,0.82)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
            }}
          >
            <Link href="/" className="flex-shrink-0">
              <Image
                src={FullCreativePathLogo}
                alt="Creative Path Logo"
                height={58}
                priority
                className="h-10 w-auto invert transition-opacity duration-300 sm:h-[46px] lg:h-[58px]"
              />
            </Link>

            <nav className="hidden items-center gap-5 lg:flex xl:gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs tracking-[0.18em] font-medium transition-colors duration-150 relative group xl:text-sm xl:tracking-[0.25em] ${
                    pathname === link.href
                      ? "text-[#05dbf2]"
                      : "text-[#9bb6c1] hover:text-[#e6f7fb]"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-px bg-[#04b2d9] transition-[width] duration-150 ${
                      pathname === link.href
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a key={social.href} href={social.href} target="_blank" rel="noopener noreferrer" className="text-[#9bb6c1] transition-colors duration-150 hover:text-[#05dbf2]">
                    {social.icon}
                  </a>
                ))}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="lg:hidden text-[#9bb6c1] hover:text-[#05dbf2]"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label={menuOpen ? "Zamknij menu" : "Otwórz menu"}
                aria-expanded={menuOpen}
                aria-controls="mobile-navigation"
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </Button>
            </div>
          </div>
        </div>
      </header>
      <div
        ref={mobileMenuRef}
        id="mobile-navigation"
        className="fixed inset-0 z-40 bg-[#0a0a0a] flex flex-col justify-center px-8"
        style={{
          transform: "translateX(100%)",
          opacity: 0,
          pointerEvents: menuOpen ? "auto" : "none",
        }}
      >
        <nav className="flex flex-col gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`mobile-link text-[clamp(1.7rem,7.5vw,3rem)] font-bold uppercase leading-tight tracking-tight transition-colors duration-300 ${
                pathname === link.href
                  ? "text-gradient"
                  : "text-[#e6f7fb] hover:text-[#05dbf2]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex gap-5 mt-16">
          {socialLinks.map((social) => (
            <a
              key={social.href}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#9bb6c1] hover:text-[#05dbf2] transition-colors duration-300"
            >
              {social.icon}
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

export default MainNavigation;
