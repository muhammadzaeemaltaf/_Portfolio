"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { educationData } from "@/libs/data";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const pad = (n: number) => String(n).padStart(2, "0");

const GLOW = {
  textShadow:
    "0 0 0.35em rgba(255,255,255,0.55), 0 0 1.1em rgba(255,255,255,0.22)",
};

const DIM = 0.3;

const entries = educationData.map((e) => ({
  title: e.title,
  institution: e.institution,
  date: e.date,
  kind: e.type,
  fields: e.description ? [e.description] : [...e.fields],
}));

export default function Education() {
  const sectionRef = useRef<HTMLElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);

  // clicking an index row scrolls the pinned scene to that entry
  const goTo = (i: number) => {
    const st = trigger.current;
    if (!st) return;
    const y = st.start + (i / (entries.length - 1)) * (st.end - st.start);
    const lenis = (
      window as Window & {
        portfolioLenis?: {
          scrollTo: (y: number, o?: { duration?: number }) => void;
        };
      }
    ).portfolioLenis;
    if (lenis) lenis.scrollTo(y, { duration: 1.1 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  useGSAP(
    () => {
      const section = sectionRef.current!;
      const items = gsap.utils.toArray<HTMLElement>(".ed-item", section);
      const rows = gsap.utils.toArray<HTMLElement>(".ed-row", section);
      const last = items.length - 1;
      const parts = (el: HTMLElement) => el.querySelectorAll(".ed-part");

      // no motion: stack the entries and skip the pin
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        section.style.height = "auto";
        gsap.set(".ed-stage", { height: "auto" });
        gsap.set(items, {
          position: "relative",
          height: "auto",
          padding: "3rem 0",
        });
        gsap.set(".ed-ghost, .ed-index", { display: "none" });
        return;
      }

      gsap.from(".ed-intro", {
        scrollTrigger: { trigger: section, start: "top 70%" },
        y: 32,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
      });

      // everything but the first entry waits below
      gsap.set(items.slice(1).flatMap((el) => Array.from(parts(el))), { y: 48, opacity: 0 });
      gsap.set(rows.slice(1), { opacity: DIM });

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
      trigger.current = tl.scrollTrigger ?? null;

      tl.fromTo(
        ".ed-fill",
        { scaleY: 0 },
        { scaleY: 1, duration: last, transformOrigin: "top" },
        0,
      );
      // one big faint word per entry, drifting upward against the swap
      tl.fromTo(
        ".ed-ghost > span",
        { yPercent: 8 },
        { yPercent: -8, duration: last },
        0,
      );

      for (let i = 1; i <= last; i++) {
        // the old entry lifts away, then the next one rises into its place
        tl.to(
          parts(items[i - 1]),
          {
            y: -48,
            opacity: 0,
            duration: 0.3,
            stagger: 0.04,
            ease: "power2.in",
          },
          i - 0.7,
        );
        tl.to(
          parts(items[i]),
          {
            y: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.05,
            ease: "power2.out",
          },
          i - 0.4,
        );
        tl.to(rows[i - 1], { opacity: DIM, duration: 0.3 }, i - 0.6);
        tl.to(rows[i], { opacity: 1, duration: 0.3 }, i - 0.4);
        tl.fromTo(
          `.ed-ghost > span:nth-child(${i + 1})`,
          { opacity: 0 },
          { opacity: 1, duration: 0.3 },
          i - 0.5,
        );
        tl.to(
          `.ed-ghost > span:nth-child(${i})`,
          { opacity: 0, duration: 0.3 },
          i - 0.6,
        );
      }
    },
    { scope: sectionRef },
  );

  return (
    <section
      id="education"
      ref={sectionRef}
      className="relative h-[100svh] w-full overflow-hidden bg-black text-white"
    >
      <div
        aria-hidden
        className="ed-ghost pointer-events-none absolute inset-0 select-none font-display font-bold uppercase leading-[0.85] tracking-[-0.04em] text-white/[0.06]"
      >
        {entries.map((e, i) => (
          <span
            key={e.title}
            style={{ opacity: i === 0 ? 1 : 0 }}
            className="absolute bottom-[6%] right-0 whitespace-nowrap text-[30vw] lg:bottom-[2%] lg:text-[18vw]"
          >
            {e.date.split(" ")[0]}
          </span>
        ))}
      </div>

      <div className="relative grid h-full grid-rows-[auto_1fr] gap-y-8 px-4 pb-10 pt-24 lg:grid-cols-[24vw_1fr] lg:grid-rows-1 lg:gap-x-[3vw] lg:px-[1vw] lg:py-[7vw]">
        <div className="flex flex-col lg:justify-between">
          <div>
            <p className="ed-intro font-mono text-[11px] uppercase tracking-[0.25em] text-white/50 lg:text-[0.8vw]">
              Education
            </p>
            <h2 className="ed-intro mt-4 font-display text-4xl font-semibold leading-[1.05] tracking-[-0.035em] md:text-5xl lg:mt-[1.2vw] lg:text-[3.2vw]">
              Where I learned
            </h2>
          </div>

          <div className="ed-index ed-intro mt-8 hidden gap-[1.4vw] lg:flex">
            <div className="relative w-px shrink-0 bg-white/15">
              <div className="ed-fill absolute inset-0 origin-top bg-white" />
            </div>
            <ol className="flex flex-col gap-[1.6vw]">
              {entries.map((e, i) => (
                <li key={e.title}>
                  <button
                    type="button"
                    onClick={() => goTo(i)}
                    className="ed-row group text-left"
                  >
                    <span className="block font-mono text-[0.7vw] uppercase tracking-[0.2em] text-white/50">
                      {pad(i + 1)} · {e.date}
                    </span>
                    <span className="mt-[0.3vw] block text-[1vw] leading-snug transition-opacity group-hover:opacity-70">
                      {e.title}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="ed-stage relative h-full">
          {entries.map((e, i) => (
            <article
              key={e.title}
              aria-label={`${pad(i + 1)} of ${pad(entries.length)}`}
              className="ed-item absolute inset-0 flex flex-col justify-center"
            >
              <p className="ed-part font-mono text-[11px] uppercase tracking-[0.25em] text-white/50 lg:text-[0.8vw]">
                {pad(i + 1)} / {pad(entries.length)} · {e.kind}
              </p>
              <h3
                style={GLOW}
                className="ed-part mt-5 max-w-[22ch] font-display text-[2.4rem] font-bold uppercase leading-[0.98] tracking-[-0.03em] sm:text-6xl lg:mt-[1.6vw] lg:text-[4.6vw]"
              >
                {e.title}
              </h3>
              <p className="ed-part mt-6 max-w-[34rem] text-sm leading-relaxed text-white/70 lg:mt-[1.8vw] lg:max-w-[34vw] lg:text-[1vw]">
                {e.institution}
              </p>
              <div className="ed-part mt-8 flex flex-wrap items-center gap-2 lg:mt-[2.4vw] lg:gap-[0.6vw]">
                <span className="rounded-full bg-white px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-black lg:px-[0.9vw] lg:py-[0.4vw] lg:text-[0.65vw]">
                  {e.date}
                </span>
                {e.fields.map((f) => (
                  <span
                    key={f}
                    className="rounded-full border border-white/25 px-3 py-1.5 text-xs text-white/80 lg:px-[0.9vw] lg:py-[0.4vw] lg:text-[0.8vw]"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
