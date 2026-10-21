"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { skills } from "@/libs/data";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// uneven horizontal bands, like blinds: each grows up from its own bottom edge, bottom band first
const BANDS = [1.4, 0.6, 1, 0.5, 1.6, 0.8, 1.2, 0.9];
const HEADING = "Tools I think in";

export default function Skills() {
  const root = useRef<HTMLElement>(null);
  const [row, setRow] = useState<number | null>(null); // row under the pointer: the others dim

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // About holds still at its end, black blinds close over it, then Skills scrolls in
      const veil = root.current!.querySelector<HTMLElement>(".skills-veil")!;
      const about = document.getElementById("about")!;
      // once the blinds are shut, About is dropped too so it never reappears as Skills scrolls in
      const done = (over: boolean) => {
        gsap.set(veil, { autoAlpha: over ? 0 : 1 });
        about.style.visibility = over ? "hidden" : "";
      };
      if (!reduce) {
        gsap.fromTo(
          ".skills-band",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "power2.inOut",
            duration: 1,
            stagger: { each: 0.1, from: "end" },
            scrollTrigger: {
              trigger: about, // an element, not "#about": selectors are scoped to this section
              start: "bottom bottom",
              end: "+=100%",
              pin: true,
              scrub: true, // exact, so onLeave only fires once every band is fully closed
              onLeave: () => done(true),
              onEnterBack: () => done(false),
            },
          }
        );
      }

      gsap.from(".skills-char", {
        scrollTrigger: { trigger: ".skills-heading", start: "top 85%" },
        yPercent: 115,
        duration: 0.9,
        ease: "power4.out",
        stagger: 0.03,
      });
      gsap.from(".skills-fade", {
        scrollTrigger: { trigger: ".skills-heading", start: "top 85%" },
        y: 16,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "power3.out",
      });
      // lines draw in, names rise out of a mask, tools fade up
      gsap.from(".skills-line", {
        scrollTrigger: { trigger: ".skills-list", start: "top 80%" },
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.2,
        ease: "power3.inOut",
        stagger: 0.1,
      });
      gsap.from(".skills-name", {
        scrollTrigger: { trigger: ".skills-list", start: "top 80%" },
        yPercent: 110,
        duration: 0.9,
        ease: "power4.out",
        stagger: 0.1,
      });
      gsap.from(".skills-tools", {
        scrollTrigger: { trigger: ".skills-list", start: "top 80%" },
        y: 14,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
        delay: 0.3,
        clearProps: "opacity", // else the inline value would beat the hover-dim class
      });

      return () => {
        about.style.visibility = "";
      };
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative w-full bg-black px-4 pb-28 pt-24 text-white md:pb-40 md:pt-36 lg:px-[1vw] lg:pb-[11vw] lg:pt-[10vw]">
      {/* blinds: fixed over the viewport while About is pinned */}
      <div aria-hidden className="skills-veil pointer-events-none fixed inset-0 z-30 flex flex-col">
        {BANDS.map((g, i) => (
          <div key={i} style={{ flexGrow: g }} className="skills-band basis-0 origin-bottom bg-black" />
        ))}
      </div>

      <div className="mx-auto w-full max-w-6xl lg:max-w-none">
        {/* 1 · label */}
        <p className="skills-fade flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-white/45 lg:gap-[0.83vw] lg:text-[0.83vw]">
          <span className="h-px w-8 bg-white/30 lg:w-[2.2vw]" />
          Skills
        </p>

        {/* 2 · headline */}
        <h2 aria-label={HEADING} className="skills-heading mt-5 font-display text-4xl font-semibold leading-[1.1] tracking-[-0.035em] md:text-6xl lg:mt-[1.4vw] lg:text-[4.17vw]">
          {HEADING.split(" ").map((w, i) => (
            <span key={i} aria-hidden className="mr-[0.25em] inline-block overflow-hidden align-bottom">
              {w.split("").map((c, j) => (
                <span key={j} className="skills-char inline-block">
                  {c}
                </span>
              ))}
            </span>
          ))}
        </h2>

        {/* 3 · field + its tools */}
        <ul className="skills-list mt-16 md:mt-24 lg:mt-[6.67vw]" onPointerLeave={() => setRow(null)}>
          {skills.map((cat, i) => {
            const on = row === i;
            return (
              <li
                key={cat.type}
                onPointerEnter={() => setRow(i)}
                className={`relative transition-opacity duration-500 ${row !== null && !on ? "opacity-30" : "opacity-100"}`}
              >
                <span aria-hidden className="skills-line absolute inset-x-0 top-0 h-px bg-white/15" />
                {/* white line sweeps across the active row */}
                <span aria-hidden className={`absolute inset-x-0 top-0 h-px origin-left bg-white transition-transform duration-700 ease-[cubic-bezier(.7,0,.2,1)] ${on ? "scale-x-100" : "scale-x-0"}`} />

                <div className="grid gap-4 py-7 md:grid-cols-[1fr_1.3fr] md:gap-12 md:py-9 lg:gap-[3.33vw] lg:py-[2.5vw]">
                  <h3 className="flex items-baseline gap-4 font-display text-2xl font-medium tracking-[-0.02em] md:text-3xl lg:gap-[1.1vw] lg:text-[2.08vw]">
                    <span className="font-mono text-xs tracking-widest text-white/35 lg:text-[0.83vw]">{String(i + 1).padStart(2, "0")}</span>
                    <span className="inline-block overflow-hidden align-bottom">
                      <span className="skills-name inline-block">{cat.type}</span>
                    </span>
                  </h3>

                  <ul className="skills-tools flex flex-wrap gap-x-6 gap-y-2 text-base text-white/50 md:text-lg lg:gap-x-[1.67vw] lg:gap-y-[0.55vw] lg:text-[1.25vw]">
                    {cat.name.map((t) => (
                      <li key={t.label} className={`group/tool flex items-center transition-colors duration-300 hover:text-white ${on ? "text-white/80" : ""}`}>
                        {/* icon slides in from nothing, pushing the word along */}
                        <t.icon className="h-[1.1em] w-0 shrink-0 opacity-0 transition-all duration-300 ease-out group-hover/tool:mr-2 group-hover/tool:w-[1.1em] group-hover/tool:opacity-100" />
                        {t.label}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
          <li aria-hidden className="relative h-px">
            <span className="skills-line absolute inset-0 bg-white/15" />
          </li>
        </ul>
      </div>
    </section>
  );
}
