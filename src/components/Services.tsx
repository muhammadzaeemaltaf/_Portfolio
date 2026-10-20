"use client";

import { useRef } from "react";
import Image, { StaticImageData } from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Bookmyspot from "../../public/project/bms.png";
import Sq1Orbit from "../../public/project/sq1orbit_1.png";
import Lexnis from "../../public/project/lexnis_1.png";
import SquareOneMall from "../../public/project/squareonemall.png";
import Recrot from "../../public/project/recrot.png";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Service = { title: string; tags: string[]; image: StaticImageData };

// placeholder copy and images, swap freely: the scene adapts to however many services there are
const services: Service[] = [
  {
    title: "Full-Stack Web Apps",
    tags: ["Next.js", "Laravel", "TypeScript"],
    image: Bookmyspot,
  },
  {
    title: "Admin Panels",
    tags: ["React", "Zustand", "Shadcn"],
    image: Sq1Orbit,
  },
  {
    title: "AI Agents",
    tags: ["OpenAI SDK", "MCP", "Python"],
    image: Lexnis,
  },
  {
    title: "CMS Websites",
    tags: ["WordPress", "Sanity", "Tailwind"],
    image: SquareOneMall,
  },
  {
    title: "Animated Frontends",
    tags: ["GSAP", "Framer Motion", "React"],
    image: Recrot,
  },
];

const TAGLINE =
  "Thoughtful engineering shaped by curiosity, crafted with intention, and delivered with the attention you deserve.";

// seconds of scroll per service change, and how long each one is held
const STEP = 1;
const HOLD = 0.6;
const INACTIVE = 0.25;

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current!;
      const rows = gsap.utils.toArray<HTMLElement>(".sv-row", section);
      const panels = gsap.utils.toArray<HTMLElement>(".sv-panel", section);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduce) {
        gsap.set(rows, { opacity: INACTIVE });
        gsap.set(rows[0], { opacity: 1 });
        gsap.set(panels.slice(1), { autoAlpha: 0 });
        return;
      }

      gsap.set(rows, { opacity: INACTIVE });
      // every image grows out of the bottom-right corner until it fills the panel
      gsap.set(panels, { clipPath: "inset(100% 0% 0% 100%)" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${(STEP + HOLD) * services.length * 70}%`,
          pin: true,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
        defaults: { ease: "none" },
      });

      tl.to(panels[0], { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.inOut", duration: STEP }, 0).to(
        rows[0],
        { opacity: 1, duration: STEP },
        0,
      );
      tl.to({}, { duration: HOLD });
      for (let i = 1; i < services.length; i++) {
        const at = ">";
        tl.to(panels[i], { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.inOut", duration: STEP }, at)
          .to(rows[i - 1], { opacity: INACTIVE, duration: STEP }, "<")
          .to(rows[i], { opacity: 1, duration: STEP }, "<")
          .to({}, { duration: HOLD });
      }

      // headline rises in as the section arrives, then stays put above the pinned scene
      gsap.from(".sv-char", {
        scrollTrigger: { trigger: section, start: "top 75%" },
        yPercent: 115,
        duration: 0.9,
        ease: "power4.out",
        stagger: 0.03,
      });
      gsap.from(".sv-fade", {
        scrollTrigger: { trigger: section, start: "top 75%" },
        y: 16,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
      });
    },
    { scope: sectionRef },
  );

  const word = (text: string, className = "") => (
    <span aria-hidden className={`block overflow-hidden pb-[0.08em] ${className}`}>
      {text.split("").map((c, i) => (
        <span key={i} className="sv-char inline-block">
          {c === " " ? "\u00A0" : c}
        </span>
      ))}
    </span>
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-[100svh] w-full overflow-hidden bg-black text-white"
    >
      <header className="px-4 pt-20 lg:px-[1vw] lg:pt-[1vh]">
        <h2
          aria-label="What I Build"
          className="font-display font-semibold leading-[1.05] tracking-[-0.035em] text-5xl md:text-7xl lg:text-[7vw]"
        >
          {word("What I")}
          {word("Build", "opacity-55")}
        </h2>
        <p className="sv-fade mt-4 max-w-xs text-sm text-white/70 leading-snug lg:absolute lg:left-[50.6%] lg:top-[19.4%] lg:mt-0 lg:max-w-[15.5vw] lg:text-[0.85vw]">
          {TAGLINE}
        </p>
      </header>

      {/* image stack: sits over the tagline once it opens */}
      <div className="absolute inset-x-0 top-[38svh] h-[30svh] lg:left-[45.6%] lg:top-0 lg:h-full">
        {services.map((s, i) => (
          <div key={s.title} className="sv-panel absolute inset-0 bg-black">
            <Image
              src={s.image}
              alt={s.title}
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover object-top"
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      <ul className="absolute inset-x-4 bottom-4 lg:inset-x-auto lg:bottom-[1vh] lg:left-[1vw] lg:w-[43.6vw]">
        {services.map((s, i) => (
          <li
            key={s.title}
            className="sv-row flex h-[7svh] items-center justify-between gap-3 border-b border-white last:border-b-0 lg:h-[9.15vh]"
          >
            <span className="flex items-baseline gap-3 lg:gap-[0.9vw]">
              <span className="font-mono text-xs lg:text-[0.8vw]">
                {String(i + 1).padStart(2, "0")}.
              </span>
              <span className="font-display text-2xl font-semibold tracking-[-0.02em] lg:text-[2vw]">{s.title}</span>
            </span>
            <span className="hidden font-mono text-[0.7rem] uppercase tracking-wide sm:block lg:text-[0.75vw]">
              {s.tags.join(", ")}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
