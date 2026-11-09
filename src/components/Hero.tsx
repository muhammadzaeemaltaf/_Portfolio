"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { FiArrowUpRight, FiGithub } from "react-icons/fi";
import { HiDownload } from "react-icons/hi";
import { FaLinkedin } from "react-icons/fa6";
import { scrollToView } from "@/libs/data";

const roles = [
  "Full-Stack Developer",
  "Agentic AI Developer",
  "Next.js Developer",
  "Frontend Developer",
  "PHP/Laravel Developer",
];

// pill button: a curved fill rises from below while the label rolls up and is replaced by its twin
const Btn = ({ href, onClick, icon, label, solid, round, cursor }: { cursor?: string; href?: string; onClick?: () => void; icon: React.ReactNode; label?: string; solid?: boolean; round?: boolean }) => {
  const row = "flex h-5 items-center gap-2 text-g-sm lg:h-[1.4vw] lg:gap-[0.55vw] font-medium transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)] group-hover:-translate-y-full";
  const body = (
    <>
      <span className={`absolute inset-0 translate-y-full rounded-t-[50%] transition-all duration-500 ease-[cubic-bezier(.7,0,.2,1)] group-hover:translate-y-0 group-hover:rounded-t-none ${solid ? "bg-white" : "bg-black"}`} />
      <span className="relative block h-5 overflow-hidden lg:h-[1.4vw]">
        <span className={row}>{icon}{!round && label}</span>
        <span aria-hidden className={`${row} absolute left-0 top-full ${solid ? "text-black" : "text-white"}`}>{icon}{!round && label}</span>
      </span>
    </>
  );
  const cls = `group relative inline-flex h-11 shrink-0 items-center justify-center overflow-hidden rounded-full border sm:h-12 lg:h-[3.33vw] ${round ? "w-10 min-[380px]:w-11 sm:w-12 lg:w-[3.33vw]" : "px-3.5 min-[380px]:px-4 sm:px-6 lg:px-[1.67vw]"} ${solid ? "border-black bg-black text-white" : "border-black/20 text-[#1d1d1f]"}`;
  return href ? (
    <a href={href} target="_blank" aria-label={label} data-cursor={cursor} className={cls}>{body}</a>
  ) : (
    <button onClick={onClick} data-cursor={cursor} className={cls}>{body}</button>
  );
};

gsap.registerPlugin(ScrollTrigger);

// opaque above the edge, transparent below it; --f (0→1) drives the edge from below the section to above it
const fadeEdge = "linear-gradient(to bottom, #000 calc(100% - var(--f) * 130%), transparent calc(130% - var(--f) * 130%))";
const fadeMask = { maskImage: fadeEdge, WebkitMaskImage: fadeEdge };

const HeroSection = () => {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActive((a) => (a + 1) % roles.length), 1800);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const cleanups: (() => void)[] = [];
    const ctx = gsap.context(() => {
      // hidden until PortraitLoader hands its photo over (see "portrait-done")
      gsap.set([".hero-portrait", ".hero-letter", ".hero-fade"], { opacity: 0 });
      let started = false;
      const go = () => {
        if (started) return;
        started = true;
        // letters drop from above, outer edges (Z and F) first, converging on the centre
        gsap.fromTo(".hero-letter", { y: "-0.6em", opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out", stagger: { each: 0.03, from: "edges" }, delay: 0.1 });
        gsap.fromTo(".hero-fade", { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", stagger: 0.05, delay: 0.25 });
      };
      // text starts on "portrait-go" (mid-travel); the portrait itself appears on "portrait-done"
      const show = () => {
        go();
        gsap.set(".hero-portrait", { opacity: 1 });
      };
      if (window.__portraitDone) show();
      else {
        window.addEventListener("portrait-go", go, { once: true });
        window.addEventListener("portrait-done", show, { once: true });
      }
      const failsafe = setTimeout(show, 8000);
      cleanups.push(() => {
        window.removeEventListener("portrait-go", go);
        window.removeEventListener("portrait-done", show);
        clearTimeout(failsafe);
      });

      // scroll parallax: a soft mask edge (--f) sweeps up from the bottom on desktop, fading the hero out
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const scrub = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
        const mm = gsap.matchMedia();
        mm.add("(min-width: 1024px)", () => {
          // name lags behind, portrait rises faster
          gsap.timeline({ scrollTrigger: scrub })
            .to(".hero-word", { y: 160, ease: "none" }, 0)
            .to(".hero-portrait-inner", { y: -90, ease: "none" }, 0)
            .to(root.current, { "--f": 1, ease: "none" }, 0);
        });
        mm.add("(max-width: 1023px)", () => {
          // phones: portrait drifts down against the scroll (reads slow), name and card climb (read fast)
          gsap.timeline({ scrollTrigger: scrub })
            .to(".hero-portrait-inner", { y: 90, ease: "none" }, 0)
            .to(".hero-word", { y: -60, ease: "none" }, 0)
            .to(".hero-card", { y: -120, ease: "none" }, 0);
        });
      }
    }, root);
    return () => {
      cleanups.forEach((c) => c());
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={root}
      style={{ "--f": 0, ...fadeMask } as React.CSSProperties}
      className="relative isolate flex min-h-[100svh] lg:h-[52vw] lg:min-h-0 w-full max-w-[100vw] flex-col overflow-hidden bone-bg px-4 pb-4 pt-24 sm:px-8 lg:pb-0 lg:pt-[5.5vw] text-[#1d1d1f] lg:px-[1vw]"
    >
      <p className="sr-only">
        Portfolio of Muhammad Zaeem Altaf – Full-Stack Developer skilled in Next.js, React, TypeScript, Laravel, and PHP.
        Specializing in building modern, scalable web applications and e-commerce solutions.
      </p>


      {/* 1. dominant name, full width */}
      <h1 className="hero-word relative z-0 flex flex-col items-center lg:flex-row lg:justify-center font-display whitespace-nowrap text-[18vw] lg:text-[11.5vw] lg:-ml-[0.6vw] font-bold leading-[0.9] lg:leading-[0.95] tracking-[0em] select-none lg:-mt-4 ">
        <span className="sr-only">Muhammad Zaeem Altaf</span>
        {"M.ZAEEM ALTAF".split(" ").map((w, wi) => (
          <span key={wi} aria-hidden className={`flex ${wi === 0 ? "lg:mr-[0.3em]" : ""}`}>
            {w.split("").map((c, i) => (
              <span key={i} className="pb-[0.04em]">
                <span className="hero-letter inline-block">{c}</span>
              </span>
            ))}
          </span>
        ))}
      </h1>

      {/* 2. portrait rises in front of the name's lower edge */}
      <div className="hero-portrait pointer-events-none absolute inset-x-0 top-[calc(6rem+19.5vw)] sm:top-[calc(6rem+22vw)] z-10 lg:top-[6.75vw] flex justify-center">
        <div id="hero-portrait" className="hero-portrait-inner relative aspect-square w-[125vw] shrink-0 sm:w-[92vw] lg:w-[50vw] [mask-image:linear-gradient(to_bottom,#000_80%,transparent_100%)] lg:[mask-image:none]">
          <Image src="/new-profile.png" alt="Muhammad Zaeem Altaf" fill priority sizes="(min-width:1024px) 50vw, 92vw" className="object-contain object-bottom" />
        </div>
      </div>

      {/* 3. intro, left */}
      <div className="hero-fade hero-card relative z-20 mt-auto w-full rounded-3xl border border-black/10 bg-white/55 p-5 max-[380px]:p-4 shadow-[0_10px_40px_rgba(0,0,0,0.08)] backdrop-blur-xl lg:absolute lg:left-[1vw] lg:top-[27.4vw] lg:mt-0 lg:w-auto lg:max-w-[27vw] lg:rounded-none lg:border-0 lg:bg-transparent lg:p-0 lg:shadow-none lg:backdrop-blur-none">
        <p className="text-g-lg max-[380px]:text-g-base font-normal leading-snug tracking-tight ">
          Hey there! I am full-stack and creative developer building fast, scalable web apps and AI-powered products.
        </p>
        <div className="mt-5 max-[380px]:mt-3 flex flex-wrap items-center gap-2 sm:gap-3 lg:flex-nowrap lg:mt-[2.2vw] lg:gap-[0.83vw]">
          <Btn solid cursor="talk" onClick={() => scrollToView("contact")} label="Hire me" icon={<FiArrowUpRight className="text-g-base " />} />
          <Btn cursor="cv" href="/MUHAMMAD ZAEEM ALTAF.pdf" label="CV" icon={<HiDownload className="text-g-base " />} />
          <Btn round href="https://github.com/muhammadzaeemaltaf/" label="GitHub" icon={<FiGithub className="text-g-base " />} />
          <Btn round href="https://www.linkedin.com/in/muhammadzaeemaltaf/" label="LinkedIn" icon={<FaLinkedin className="text-g-base " />} />
        </div>
      </div>

      {/* 4. roles, right: one lights up at a time */}
      <ul className="hero-fade absolute lg:right-[1vw] lg:top-[27.4vw] z-20 hidden space-y-2.5 text-right text-g-base font-medium lg:space-y-[0.7vw] tracking-tight lg:block">
        {roles.map((r, i) => (
          <li key={r} className={`transition-colors duration-700 ${i === active ? "text-[#1d1d1f]" : "text-black/20"}`}>
            {r}
          </li>
        ))}
      </ul>

    </section>
  );
};

export default HeroSection;
