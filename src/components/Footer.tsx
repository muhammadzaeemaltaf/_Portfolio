"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { contactLinks, navlinks } from "@/libs/data";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const EMAIL = "official.zaeemaltaf@gmail.com";
const slug = (s: string) => s.toLowerCase().replace(/\s+/g, "-");
const small = "font-mono text-g-label uppercase tracking-[0.15em] text-white/50 ";
const link = "transition-colors duration-300 hover:text-white";

export default function Footer() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(".ft-in", {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: root.current, start: "top 85%" },
      });
    },
    { scope: root },
  );

  return (
    <footer ref={root} className="w-full border-t border-white/10 bg-black px-4 pb-8 pt-20 text-white lg:px-[1vw] lg:pb-[2vw] lg:pt-[6vw]">
      <div className="ft-in">
        <p className={small}>Have an idea?</p>
        <a
          href={`mailto:${EMAIL}`}
          className="mt-4 block break-words font-display text-g-4xl font-semibold tracking-[-0.03em] text-white/80 transition-colors duration-500 hover:text-white lg:mt-[1.2vw] "
        >
          Let’s build it together<span className="font-serif italic text-white/50"> →</span>
        </a>
      </div>

      <div className="ft-in mt-16 grid gap-10 sm:grid-cols-2 lg:mt-[6vw] lg:grid-cols-[1fr_1fr_1fr] lg:gap-[3vw]">
        <div>
          <p className={small}>Navigate</p>
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-g-sm text-white/70 lg:mt-[1.2vw] lg:gap-y-[0.5vw] ">
            {navlinks.map((n) => (
              <li key={n}>
                <Link href={`#${slug(n)}`} className={link}>{n}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className={small}>Elsewhere</p>
          <ul className="mt-4 space-y-2 text-g-sm text-white/70 lg:mt-[1.2vw] lg:space-y-[0.5vw] ">
            {contactLinks.map((c) => (
              <li key={c.label}>
                <Link href={c.href} target="_blank" rel="noopener noreferrer" className={`${link} inline-flex items-center gap-2`}>
                  {c.icon}
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className={small}>Based in</p>
          <p className="mt-4 text-g-sm text-white/70 lg:mt-[1.2vw] ">Pakistan · working worldwide</p>
        </div>
      </div>

      <p className={`ft-in mt-16 border-t border-white/10 pt-6 lg:mt-[5vw] lg:pt-[1.5vw] ${small}`}>
        © {new Date().getFullYear()} Muhammad Zaeem Altaf. All rights reserved.
      </p>
    </footer>
  );
}
