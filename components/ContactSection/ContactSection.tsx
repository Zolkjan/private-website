"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, Mail, Github, Linkedin, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { defaultSiteContent, useSiteContent } from "@/lib/firestore-hooks";
import { useProfile } from "@/lib/profile";
import { useSectionReveal } from "@/lib/use-section-reveal";

export default function ContactSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const content = useSiteContent(defaultSiteContent);
  const profile = useProfile();
  useSectionReveal(sectionRef);
  const socials = [
    { name: "GitHub", href: profile.github, icon: Github },
    { name: "LinkedIn", href: profile.linkedin, icon: Linkedin },
    { name: "Instagram", href: profile.instagram, icon: Instagram },
  ].filter((social) => social.href);

  return (
    <section ref={sectionRef} id="kontakt" aria-labelledby="contact-heading" className="border-t border-white/10 bg-[#0e1417]">
      <div className="site-container py-16 md:py-24">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-16">
          <div data-reveal>
            <p className="section-eyebrow"><span className="mr-3 text-[#70818c]">06 /</span> Zróbmy kolejny krok</p>
            <h2 id="contact-heading" className="text-[clamp(2.5rem,5.5vw,4.75rem)] font-semibold leading-[1.08] tracking-[-0.05em]">Masz pomysł?<br /><span className="text-[#67dbe8]">Nadajmy mu formę.</span></h2>
          </div>
          <div data-reveal data-reveal-delay="0.1">
            <p className="readable-copy mb-6 max-w-md">{content.contactDescription}</p>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-12 rounded-full bg-[#67dbe8] px-6 text-[#071014] hover:bg-[#a0edf4]">
                <Link href="/contact">Przejdź do kontaktu <ArrowUpRight /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 max-w-full rounded-full border-white/20 bg-transparent px-5 text-white hover:bg-white/10 hover:text-white">
                <a href={`mailto:${profile.email}`}><Mail /><span className="truncate">{profile.email}</span></a>
              </Button>
            </div>
          </div>
        </div>
        <footer className="mt-14 flex flex-wrap items-center justify-between gap-5 border-t border-white/10 pt-6 text-xs text-[#9ba9b0]">
          <p>© {new Date().getFullYear()} {profile.displayName} · CreativePath</p>
          <div className="flex items-center gap-2">
            {socials.map(({ name, href, icon: Icon }) => (
              <Button key={name} asChild variant="ghost" size="icon" className="rounded-full text-[#aebbc3] hover:bg-white/10 hover:text-white">
                <a href={href} target="_blank" rel="noopener noreferrer" aria-label={name}><Icon size={18} /></a>
              </Button>
            ))}
          </div>
        </footer>
      </div>
    </section>
  );
}
