"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import {
  ArrowLeft,
  Github,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Send,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const contactInfo = [
  {
    icon: <Mail size={18} />,
    label: "Email",
    value: "jan@creativepath.pl",
    href: "mailto:jan@creativepath.pl",
  },
  {
    icon: <MapPin size={18} />,
    label: "Lokalizacja",
    value: "Polska",
    href: null,
  },
];

const socials = [
  { label: "GitHub", icon: <Github size={18} />, href: "https://github.com" },
  {
    label: "LinkedIn",
    icon: <Linkedin size={18} />,
    href: "https://linkedin.com",
  },
  {
    label: "Instagram",
    icon: <Instagram size={18} />,
    href: "https://instagram.com",
  },
];

export default function ContactPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  useGSAP(
    () => {
      const tl = gsap.timeline({ delay: 0.1 });
      tl.from(".page-hero-label", {
        x: -30,
        opacity: 0,
        duration: 0.6,
        ease: "power3.out",
      }).from(
        ".page-hero-title",
        { y: 80, opacity: 0, duration: 1, ease: "power4.out" },
        "-=0.3",
      );

      gsap.from(".contact-info-item", {
        x: -30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".contact-grid",
          start: "top 80%",
        },
      });

      gsap.from(".form-field", {
        y: 25,
        opacity: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".contact-grid",
          start: "top 78%",
        },
      });
    },
    { scope: pageRef },
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Animate button
    gsap.to(".submit-btn", {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      onComplete: () => setSubmitted(true),
    });
  };

  return (
    <div ref={pageRef} className="min-h-screen bg-[#0a0a0a]">
      <div className="pt-32 pb-0 max-w-7xl mx-auto px-6 lg:px-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs tracking-[0.3em] text-[#9bb6c1] uppercase hover:text-[#04b2d9] transition-colors duration-300 mb-16"
        >
          <ArrowLeft size={12} />
          Powrót
        </Link>

        <div className="page-hero-label flex items-center gap-3 mb-6">
          <span className="inline-block w-8 h-px bg-[#04b2d9]" />
          <span className="text-xs tracking-[0.4em] text-[#04b2d9] uppercase">
            Kontakt
          </span>
        </div>

        <h1 className="page-hero-title text-[clamp(3rem,9vw,8rem)] font-bold leading-[0.9] uppercase tracking-tight mb-16">
          Porozmawiajmy
          <br />
          <span className="text-gradient">o projekcie</span>
        </h1>
      </div>

      <div className="glow-line" />

      {/* Main grid */}
      <div className="contact-grid max-w-7xl mx-auto px-6 lg:px-12 py-20 grid lg:grid-cols-[1fr_1.6fr] gap-16">
        {/* Left info */}
        <div>
          <p className="text-[#9bb6c1] leading-relaxed mb-10 max-w-xs">
            Masz pomysł na projekt? Potrzebujesz freelancera? Chcesz porozmawiać
            o&nbsp;współpracy? Napisz do mnie, odpiszę jak najszybciej.
          </p>

          <div className="space-y-5 mb-12">
            {contactInfo.map((item) => (
              <div
                key={item.label}
                className="contact-info-item flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-[#111] border border-[#1a1a1a] flex items-center justify-center text-[#04b2d9] flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-[10px] tracking-[0.2em] text-[#9bb6c1] uppercase mb-0.5">
                    {item.label}
                  </p>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-sm font-medium text-[#e6f7fb] hover:text-[#05dbf2] transition-colors duration-300"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-sm font-medium text-[#e6f7fb]">
                      {item.value}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-info-item flex items-center gap-2 px-4 py-2.5 border border-[#1a1a1a] rounded-full text-[#9bb6c1] text-xs tracking-[0.1em] hover:border-[rgba(5,219,242,0.3)] hover:text-[#05dbf2] transition-all duration-300"
              >
                {s.icon}
                {s.label}
              </a>
            ))}
          </div>

          {/* Availability badge */}
          <div className="mt-12 flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm text-[#9bb6c1]">
              Dostępny do nowych projektów
            </span>
          </div>
        </div>

        {/* Right form */}
        <div>
          {submitted ? (
            <div className="flex flex-col items-center justify-center h-full py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-[rgba(5,219,242,0.1)] border border-[rgba(5,219,242,0.3)] flex items-center justify-center text-[#05dbf2] text-2xl mb-6">
                ✓
              </div>
              <h3 className="text-2xl font-bold text-[#e6f7fb] mb-3">
                Wiadomość wysłana!
              </h3>
              <p className="text-[#9bb6c1]">
                Odpiszę jak najszybciej. Dziękuję za kontakt!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="form-field">
                  <label className="block text-[10px] tracking-[0.2em] text-[#9bb6c1] uppercase mb-2">
                    Imię i nazwisko
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formState.name}
                    onChange={handleChange}
                    placeholder="Jan Kowalski"
                    className="w-full px-5 py-4 bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl text-[#e6f7fb] text-sm placeholder:text-[#9bb6c1]/40 focus:outline-none focus:border-[rgba(5,219,242,0.4)] transition-colors duration-300"
                  />
                </div>
                <div className="form-field">
                  <label className="block text-[10px] tracking-[0.2em] text-[#9bb6c1] uppercase mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formState.email}
                    onChange={handleChange}
                    placeholder="jan@example.com"
                    className="w-full px-5 py-4 bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl text-[#e6f7fb] text-sm placeholder:text-[#9bb6c1]/40 focus:outline-none focus:border-[rgba(5,219,242,0.4)] transition-colors duration-300"
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="block text-[10px] tracking-[0.2em] text-[#9bb6c1] uppercase mb-2">
                  Temat
                </label>
                <input
                  type="text"
                  name="subject"
                  required
                  value={formState.subject}
                  onChange={handleChange}
                  placeholder="Projekt strony / Współpraca / Inne"
                  className="w-full px-5 py-4 bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl text-[#e6f7fb] text-sm placeholder:text-[#9bb6c1]/40 focus:outline-none focus:border-[rgba(5,219,242,0.4)] transition-colors duration-300"
                />
              </div>

              <div className="form-field">
                <label className="block text-[10px] tracking-[0.2em] text-[#9bb6c1] uppercase mb-2">
                  Wiadomość
                </label>
                <textarea
                  name="message"
                  required
                  rows={6}
                  value={formState.message}
                  onChange={handleChange}
                  placeholder="Opisz swój projekt lub pytanie..."
                  className="w-full px-5 py-4 bg-[#0d0d0d] border border-[#1a1a1a] rounded-xl text-[#e6f7fb] text-sm placeholder:text-[#9bb6c1]/40 focus:outline-none focus:border-[rgba(5,219,242,0.4)] transition-colors duration-300 resize-none"
                />
              </div>

              <button
                type="submit"
                className="submit-btn form-field group flex items-center gap-3 px-8 py-4 bg-[#04b2d9] text-[#0a0a0a] font-bold text-sm tracking-[0.2em] uppercase rounded-full hover:bg-[#05dbf2] transition-colors duration-300 glow-sm"
              >
                <Send size={14} />
                Wyślij wiadomość
              </button>
            </form>
          )}
        </div>
      </div>

      <p className="text-center text-xs text-[#9bb6c1]/30 pb-8 tracking-widest uppercase">
        © {new Date().getFullYear()} Jan Żółkiewski — CreativePath
      </p>
    </div>
  );
}
