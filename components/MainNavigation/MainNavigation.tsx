"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Github, Instagram, Linkedin, Menu, X } from "lucide-react";
import FullCreativePathLogo from "@/public/FullCreativePathLogo.svg";

const navLinks = [
  { href: "/", label: "STRONA GŁÓWNA" },
  { href: "/about-me", label: "O MNIE" },
  { href: "/projects", label: "PROJEKTY" },
  { href: "/contact", label: "KONTAKT" },
];

const MainNavigation = () => {
  const headerRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Entrance animation
  useGSAP(
    () => {
      gsap.from(headerRef.current, {
        y: -80,
        opacity: 0,
        duration: 0.9,
        delay: 1.2,
        ease: "power4.out",
      });
    },
    { scope: headerRef },
  );

  // Mobile menu toggle animation
  useEffect(() => {
    const menu = mobileMenuRef.current;
    if (!menu) return;
    if (menuOpen) {
      gsap.to(menu, {
        x: 0,
        opacity: 1,
        duration: 0.4,
        ease: "power3.out",
        pointerEvents: "all",
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
        pointerEvents: "none",
      });
    }
  }, [menuOpen]);

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-4 z-50 w-full pointer-events-none"
      >
        <div className="mx-auto max-w-7xl px-4 w-full pointer-events-auto">
          <div
            className={`flex items-center justify-between rounded-2xl px-6 py-3 transition-all duration-500 ${
              scrolled
                ? "border border-[rgba(5,219,242,0.15)] bg-[rgba(10,10,10,0.85)] backdrop-blur-xl shadow-[0_0_40px_rgba(5,219,242,0.05)]"
                : "border border-white/10 bg-[rgba(255,255,255,0.04)] backdrop-blur-md"
            }`}
          >
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <Image
                src={FullCreativePathLogo}
                alt="Creative Path Logo"
                height={44}
                priority
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[11px] tracking-[0.25em] font-medium transition-colors duration-300 relative group ${
                    pathname === link.href
                      ? "text-[#05dbf2]"
                      : "text-[#9bb6c1] hover:text-[#e6f7fb]"
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute -bottom-1 left-0 h-px bg-[#04b2d9] transition-all duration-300 ${
                      pathname === link.href
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                    }`}
                  />
                </Link>
              ))}
            </nav>

            {/* Socials + mobile toggle */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-3">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#9bb6c1] hover:text-[#05dbf2] transition-colors duration-300"
                >
                  <Github size={16} />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#9bb6c1] hover:text-[#05dbf2] transition-colors duration-300"
                >
                  <Linkedin size={16} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#9bb6c1] hover:text-[#05dbf2] transition-colors duration-300"
                >
                  <Instagram size={16} />
                </a>
              </div>

              {/* Mobile hamburger */}
              <button
                className="md:hidden text-[#9bb6c1] hover:text-[#05dbf2] transition-colors duration-300 p-1"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Toggle menu"
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile overlay menu */}
      <div
        ref={mobileMenuRef}
        className="fixed inset-0 z-40 bg-[#0a0a0a] flex flex-col justify-center px-8"
        style={{
          transform: "translateX(100%)",
          opacity: 0,
          pointerEvents: "none",
        }}
      >
        <nav className="flex flex-col gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`mobile-link text-4xl font-bold uppercase tracking-tight transition-colors duration-300 ${
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
          {[
            { href: "https://github.com", icon: <Github size={20} /> },
            { href: "https://linkedin.com", icon: <Linkedin size={20} /> },
            { href: "https://instagram.com", icon: <Instagram size={20} /> },
          ].map((s, i) => (
            <a
              key={i}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#9bb6c1] hover:text-[#05dbf2] transition-colors duration-300"
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

export default MainNavigation;
