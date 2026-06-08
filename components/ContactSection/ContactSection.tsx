"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { ArrowRight, Mail, Github, Linkedin, Instagram } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const socials = [
  {
    label: "GitHub",
    href: "https://github.com",
    icon: <Github size={18} />,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    icon: <Linkedin size={18} />,
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    icon: <Instagram size={18} />,
  },
];

const ContactSection = () => {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
        },
      });

      tl.from(".contact-label", {
        x: -30,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
      })
        .from(
          ".contact-heading",
          { y: 60, opacity: 0, duration: 1, ease: "power4.out" },
          "-=0.4",
        )
        .from(
          ".contact-sub",
          { y: 20, opacity: 0, duration: 0.7, ease: "power3.out" },
          "-=0.5",
        )
        .from(
          ".contact-cta",
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
            stagger: 0.12,
            ease: "power3.out",
          },
          "-=0.4",
        )
        .from(
          ".contact-social",
          {
            scale: 0.7,
            opacity: 0,
            duration: 0.4,
            stagger: 0.08,
            ease: "back.out(1.5)",
          },
          "-=0.3",
        );
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      id="kontakt"
      className="section-padding relative bg-[#050505] overflow-hidden"
    >
      <div className="glow-line" />

      {/* Background accent glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-[#04b2d9] opacity-[0.04] blur-[120px] pointer-events-none" />

      <div className="relative z-[1] max-w-7xl mx-auto px-6 lg:px-12 text-center">
        <div className="contact-label flex items-center justify-center gap-3 mb-8">
          <span className="inline-block w-8 h-px bg-[#04b2d9]" />
          <span className="text-xs tracking-[0.4em] text-[#04b2d9] uppercase">
            Kontakt
          </span>
          <span className="inline-block w-8 h-px bg-[#04b2d9]" />
        </div>

        <h2 className="contact-heading text-[clamp(3rem,9vw,8rem)] font-bold leading-[0.9] uppercase tracking-tight mb-8">
          Porozmawiajmy
          <br />
          <span className="text-gradient">o projekcie</span>
        </h2>

        <p className="contact-sub text-[#9bb6c1] text-lg max-w-md mx-auto leading-relaxed mb-12">
          Masz pomysł na projekt? Szukasz współpracy? Napisz do mnie — odpowiem
          tak szybko, jak to możliwe.
        </p>

        {/* Email */}
        <a
          href="mailto:jan@creativepath.pl"
          className="contact-cta group inline-flex items-center gap-3 px-10 py-5 bg-[#04b2d9] text-[#0a0a0a] font-bold text-sm tracking-[0.25em] uppercase rounded-full hover:bg-[#05dbf2] transition-colors duration-300 glow-md mb-6"
        >
          <Mail size={16} />
          jan@creativepath.pl
        </a>

        <div className="contact-cta block mb-12">
          <Link
            href="/contact"
            className="group inline-flex items-center gap-3 text-sm tracking-[0.2em] uppercase text-[#04b2d9] hover:text-[#05dbf2] transition-colors duration-300"
          >
            Wypełnij formularz kontaktowy
            <ArrowRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-1.5"
            />
          </Link>
        </div>

        {/* Divider */}
        <div className="glow-line max-w-xs mx-auto mb-10" />

        {/* Socials */}
        <div className="flex items-center justify-center gap-4">
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-social group flex items-center gap-2 px-5 py-3 border border-[#1a1a1a] rounded-full text-[#9bb6c1] text-sm hover:border-[rgba(5,219,242,0.3)] hover:text-[#05dbf2] transition-all duration-300"
            >
              {social.icon}
              <span className="text-xs tracking-[0.1em]">{social.label}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Footer note */}
      <p className="text-center text-xs text-[#9bb6c1]/40 mt-20 tracking-widest uppercase">
        © {new Date().getFullYear()} Jan Żółkiewski — CreativePath
      </p>
    </section>
  );
};

export default ContactSection;
