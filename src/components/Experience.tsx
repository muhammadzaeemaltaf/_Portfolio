"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";

import { experiencesData, topProjects } from "@/libs/data";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const pad = (n: number) => String(n).padStart(2, "0");

type Slide = {
  eyebrow: string;
  title: string;
  description: string;
  // two oversized words that sit behind the slide and drift in opposite directions
  ghost: [string, string];
  columns: { label: string; value: string }[];
  link?: { label: string; href: string };
};

const job = experiencesData[0];
const work = topProjects.filter((p) => p.organization === job.location);

// intro, then the role. every line is taken from the Experience data
const slides: Slide[] = [
  {
    eyebrow: "Experience",
    title: "Where I've been",
    description:
      "My professional journey so far: the role I'm in and what I do there.",
    ghost: ["CAREER", "2024 — NOW"],
    columns: [],
  },
  {
    eyebrow: `${job.location} · ${job.date}`,
    title: job.title,
    description: job.description,
    ghost: ["FULL STACK", "OCT 2024 — NOW"],
    columns: [
      {
        label: "Delivered",
        value: `${work.length} client projects across admin portals, booking, and marketing sites`,
      },
      {
        label: "Stack",
        value: "Next.js, Laravel, TypeScript, and Tailwind CSS",
      },
      { label: "Also", value: "AI agents with the OpenAI Agents SDK and MCP" },
    ],
    link: { label: `Visit ${job.location}`, href: job.href },
  },
];

const GLOW = {
  textShadow:
    "0 0 0.35em rgba(255,255,255,0.55), 0 0 1.1em rgba(255,255,255,0.22)",
};

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current!;
      const track = section.querySelector<HTMLElement>(".ex-track")!;
      const els = gsap.utils.toArray<HTMLElement>(".ex-slide", section);
      const last = els.length - 1;

      // no motion: lay the slides out one under another and skip the pin
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        section.style.height = "auto";
        gsap.set(".ex-track", {
          flexDirection: "column",
          width: "100%",
          height: "auto",
        });
        gsap.set(els, { width: "100%", height: "auto", padding: "6rem 1rem" });
        gsap.set(".ex-ghost", { display: "none" });
        return;
      }

      const parts = (el: HTMLElement) => el.querySelectorAll(".ex-part");

      // the opening slide arrives with the section; the later ones rise in as the track brings them across
      gsap.from(parts(els[0]), {
        scrollTrigger: { trigger: section, start: "top 70%" },
        y: 32,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: `+=${last * 100}%`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          snap: {
            snapTo: 1 / last,
            duration: { min: 0.2, max: 0.5 },
            ease: "power2.inOut",
          },
        },
        defaults: { ease: "none" },
      });

      // the track slides left across the whole scroll; one unit of timeline per slide, so slide i is centred at time i
      tl.to(
        track,
        { x: () => -(track.scrollWidth - section.clientWidth), duration: last },
        0,
      );
      els.forEach((el, i) => {
        const [row1, row2] = el.querySelectorAll(".ex-ghost > span");
        // the big faint words drift against the track, so they move slower than the slides
        tl.fromTo(
          row1,
          { xPercent: 12 },
          { xPercent: -12, duration: last },
          0,
        ).fromTo(row2, { xPercent: -12 }, { xPercent: 12, duration: last }, 0);
        if (i === 0) return;
        tl.fromTo(
          parts(el),
          { y: 36, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.05,
            ease: "power2.out",
          },
          i - 0.65,
        );
      });
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-[100svh] w-full overflow-hidden bg-black text-white"
    >
      <h2 className="sr-only">Experience</h2>

      <div
        className="ex-track flex h-full will-change-transform"
        style={{ width: `${slides.length * 100}%` }}
      >
        {slides.map((s, i) => (
          <div
            key={s.title}
            aria-label={`${pad(i + 1)} of ${pad(slides.length)}`}
            className="ex-slide relative flex h-full shrink-0 items-center justify-start overflow-hidden px-4 lg:px-[1vw]"
            style={{ width: `${100 / slides.length}%` }}
          >
            <div
              aria-hidden
              className="ex-ghost pointer-events-none absolute inset-0 select-none font-display font-bold uppercase leading-[0.85] tracking-[-0.04em] text-white/[0.06]"
            >
              <span className="absolute left-0 top-[6%] whitespace-nowrap text-[26vw] lg:top-[4%] lg:text-[17vw]">
                {s.ghost[0]}
              </span>
              <span className="absolute bottom-[8%] left-0 whitespace-nowrap text-[26vw] lg:bottom-[2%] lg:text-[17vw]">
                {s.ghost[1]}
              </span>
            </div>

            <div className="relative flex w-full flex-col items-start text-left">
              <p className="ex-part font-mono text-[11px] uppercase tracking-[0.25em] text-white/50 lg:text-[0.8vw]">
                {s.eyebrow}
              </p>
              <h3
                style={GLOW}
                className="ex-part mt-5 font-display text-[2.9rem] font-bold uppercase leading-[0.95] tracking-[-0.03em] sm:text-7xl lg:mt-[1.6vw] lg:text-[6.2vw]"
              >
                {s.title}
              </h3>
              <p className="ex-part mt-6 max-w-[34rem] text-sm leading-relaxed text-white/70 lg:mt-[1.8vw] lg:max-w-[34vw] lg:text-[1vw]">
                {s.description}
              </p>

              {s.columns.length > 0 && (
                <dl className="ex-part mt-10 grid w-full max-w-[60rem] grid-cols-1 gap-5 text-left md:grid-cols-3 md:gap-6 lg:mt-[3.6vw] lg:max-w-[56vw] lg:gap-[2vw]">
                  {s.columns.map((c) => (
                    <div
                      key={c.label}
                      className="border-t border-white/20 pt-3 lg:pt-[0.8vw]"
                    >
                      <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45 lg:text-[0.65vw]">
                        {c.label}
                      </dt>
                      <dd className="mt-2 text-[13px] leading-snug text-white/85 lg:mt-[0.6vw] lg:text-[0.85vw]">
                        {c.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}

              {s.link && (
                <a
                  href={s.link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="ex-part mt-9 inline-flex items-center gap-2 rounded-full border border-white/30 px-4 py-2 text-xs transition-colors hover:bg-white hover:text-black lg:mt-[2.6vw] lg:gap-[0.5vw] lg:px-[1.1vw] lg:py-[0.6vw] lg:text-[0.85vw]"
                >
                  {s.link.label}
                  <ArrowUpRight className="h-3.5 w-3.5 lg:h-[0.9vw] lg:w-[0.9vw]" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
