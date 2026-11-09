"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Swap this to change the photo; the effects below work on any portrait.
const PHOTO = "/about-me-image.png";

const paragraphs = [
  "I'm a Full-Stack Developer specializing in building fast, responsive, and scalable web applications with Next.js, React, TypeScript, Laravel, and Tailwind CSS. At Innovative Widget, I design and ship production-grade platforms end to end — from backend APIs and data models to polished, interactive interfaces — collaborating with a talented team to deliver and maintain high-quality solutions.",
  "Alongside my work, I'm pursuing a Bachelor's in Computer Science at Virtual University and training in Cloud Applied Generative AI Engineering at GIAIC. I'm deeply interested in AI agents, LLM tooling, and the systems that power modern products, and I actively contribute to open source. Always learning and open to new opportunities — feel free to reach out on LinkedIn or via email.",
];

// words that get an ink underline drawn in as the paragraph lights up
const KEYWORDS = new Set(["Full-Stack", "Next.js,", "React,", "TypeScript,", "Laravel,", "LLM"]);
const HEADING = "Hi, I'm Zaeem";

const facts = [
  ["Now", "Full-Stack Developer · Innovative Widget"],
  ["Studying", "BS Computer Science · Virtual University"],
  ["Training", "Cloud Applied GenAI Engineering · GIAIC"],
];

export default function About() {
  const root = useRef<HTMLDivElement>(null);
  const section = useRef<HTMLElement>(null); // gsap scope: the marquee sits outside `root`

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // text: words light up as you scroll
      gsap.from(".about-word", {
        scrollTrigger: { trigger: ".about-text", start: "top 75%", end: "bottom 55%", scrub: 0.3 },
        opacity: 0.15,
        stagger: 0.02,
        ease: "none",
      });
      // heading: letters rise out of a mask, centre-out
      gsap.from(".about-char", {
        scrollTrigger: { trigger: ".about-heading", start: "top 85%" },
        yPercent: 115,
        duration: 0.9,
        ease: "power4.out",
        stagger: { each: 0.04, from: "start" },
      });
      // keyword underlines draw in one after another
      gsap.to(".about-hl", {
        scrollTrigger: { trigger: ".about-text", start: "top 65%" },
        backgroundSize: "100% 2px",
        duration: 0.7,
        ease: "power2.out",
        stagger: 0.12,
      });
      gsap.from(".about-fact", {
        scrollTrigger: { trigger: ".about-facts", start: "top 90%" },
        y: 24,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
      });

      // card rises in
      gsap.from(".about-card", {
        scrollTrigger: { trigger: ".about-card", start: "top 85%" },
        y: 80,
        opacity: 0,
        scale: 0.94,
        duration: 1.1,
        ease: "power3.out",
      });

      if (reduce) return;

      // Subtle zoom: photo sits normally until the section's top reaches the top of the screen, then eases in slightly as you keep scrolling
      // (not on phones: the zoom pushes the top of the picture out of its frame and cuts the head off)
      gsap.matchMedia().add("(min-width: 768px)", () => {
        gsap.to(".about-zoom", {
          scale: 1.06,
          ease: "none",
          scrollTrigger: { trigger: "#about", start: "top top", end: "bottom top", scrub: 1 },
        });
      });


      // phones: photo and text are stacked, so give them different speeds — the photo drifts down against the scroll
      // (reads slow) while the text climbs (reads fast). Positive/negative y are over the whole pass through the screen.
      gsap.matchMedia().add("(max-width: 767px)", () => {
        const scrub = { trigger: section.current, start: "top bottom", end: "bottom top", scrub: 0.5 };
        gsap.fromTo(".about-photo", { y: -30 }, { y: 70, ease: "none", scrollTrigger: scrub });
        gsap.fromTo(".about-copy", { y: 70 }, { y: -70, ease: "none", scrollTrigger: scrub });
      });
    },
    { scope: section }
  );

  return (
    <section ref={section} className="relative flex min-h-[100svh] w-full flex-col justify-center overflow-hidden px-4 py-20 lg:px-[1vw] lg:py-[5.5vw] text-[#1d1d1f]" id="about">
      <div ref={root} className="relative mx-auto grid w-full max-w-6xl items-stretch gap-12 md:grid-cols-[1fr_1fr] md:gap-16 lg:max-w-none lg:gap-[4.4vw]">
        {/* portrait: slow scroll zoom */}
        <div className="about-photo relative h-full min-h-[460px] -ml-4 w-[calc(100%+2rem)] md:ml-[calc(-1*max(1rem,(100vw_-_72rem)/2))] md:min-h-[640px] md:w-[calc(100%+max(1rem,(100vw_-_72rem)/2))] lg:ml-[-1vw] lg:min-h-[44vw] lg:w-[calc(100%+1vw)]">
          <div className="about-card absolute inset-0 overflow-hidden [mask-image:linear-gradient(to_bottom,#000_60%,rgba(0,0,0,.92)_68%,rgba(0,0,0,.7)_77%,rgba(0,0,0,.4)_86%,rgba(0,0,0,.12)_94%,transparent_100%)] md:[mask-image:radial-gradient(ellipse_98%_82%_at_56%_36%,#000_0%,#000_48%,rgba(0,0,0,.9)_58%,rgba(0,0,0,.7)_68%,rgba(0,0,0,.45)_78%,rgba(0,0,0,.2)_89%,transparent_100%)]">
            <div className="about-zoom absolute inset-0 origin-[left_bottom] will-change-transform">
            <Image src={PHOTO} alt="Muhammad Zaeem Altaf" fill priority sizes="(min-width:768px) 100vw, 100vw" className="select-none object-cover object-[left_bottom] lg:object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.18)]" />
            </div>
          </div>

          {/* radial mask on the photo + blurred blocks over the left, bottom and right edges, so no hard edge survives.
              They use the same pinned bone-bg as the section, so they match the page exactly at any scroll position. */}
          <div aria-hidden className="bone-bg pointer-events-none absolute hidden md:block -bottom-44 -left-24 -right-12 z-10 h-80 blur-[55px]" />
          <div aria-hidden className="bone-bg pointer-events-none absolute hidden md:block -bottom-32 -left-24 -right-12 z-10 h-[26rem] opacity-70 blur-[90px]" />
          <div aria-hidden className="bone-bg pointer-events-none absolute hidden md:block -bottom-44 -left-28 -top-10 z-10 w-52 blur-[55px]" />
          <div aria-hidden className="bone-bg pointer-events-none absolute hidden md:block -bottom-40 -right-12 -top-10 z-10 w-40 blur-[45px]" />
          <div aria-hidden className="bone-bg pointer-events-none absolute hidden md:block -bottom-40 -left-40 z-10 h-[30rem] w-[10rem] rounded-full blur-[90px]" />
        </div>

        {/* text */}
        <div className="about-copy relative z-20 flex w-full flex-col justify-center">
          <p className="flex items-center gap-3 text-g-label font-medium uppercase tracking-[0.25em] text-black/45 lg:gap-[0.83vw] ">
            <span className="h-px w-8 bg-black/30 lg:w-[2.2vw]" />
            About me
          </p>
          <h2 aria-label={`${HEADING}.`} className="about-heading mb-8 mt-4 text-g-4xl font-semibold leading-[1.15] tracking-[-0.03em] lg:mb-[2.2vw] lg:mt-[1.1vw] ">
            {HEADING.split("").map((c, i) => (
              <span key={i} aria-hidden className="inline-block overflow-hidden align-bottom">
                <span className="about-char inline-block">{c === " " ? "\u00A0" : c}</span>
              </span>
            ))}
            <span aria-hidden className="inline-block overflow-hidden align-bottom">
              <span className="about-char inline-block text-black/25">.</span>
            </span>
          </h2>
          <div className="about-text space-y-5 text-g-base leading-relaxed text-black/75 lg:space-y-[1.4vw] ">
            {paragraphs.map((p, i) => (
              <p key={i}>
                {p.split(" ").map((w, j) => (
                  <span key={j} className="about-word inline-block">
                    {KEYWORDS.has(w) ? (
                      <span className="about-hl bg-[linear-gradient(#2563eb,#2563eb)] bg-[length:0%_2px] bg-left-bottom bg-no-repeat pb-0.5">{w}</span>
                    ) : (
                      w
                    )}
                    &nbsp;
                  </span>
                ))}
              </p>
            ))}
          </div>

          <dl className="about-facts mt-10 lg:mt-[2.8vw] divide-y divide-black/10 border-y border-black/10">
            {facts.map(([k, v]) => (
              <div key={k} data-cursor="" className="about-fact group relative flex items-baseline justify-between gap-6 overflow-hidden px-3 py-4 lg:px-[0.83vw] lg:py-[1.1vw]">
                <span aria-hidden className="absolute inset-0 -z-0 translate-y-full bg-[#1d1d1f] transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)] group-hover:translate-y-0" />
                <dt className="relative text-g-label uppercase tracking-[0.2em] text-black/40 transition-colors duration-500 group-hover:text-white/60">{k}</dt>
                <dd className="relative text-right text-g-base text-[#1d1d1f] transition-all duration-500 group-hover:-translate-x-1 group-hover:text-white ">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
