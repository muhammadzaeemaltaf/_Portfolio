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
  const row = "flex h-5 items-center gap-2 text-sm font-medium transition-transform duration-500 ease-[cubic-bezier(.7,0,.2,1)] group-hover:-translate-y-full";
  const body = (
    <>
      <span className={`absolute inset-0 translate-y-full rounded-t-[50%] transition-all duration-500 ease-[cubic-bezier(.7,0,.2,1)] group-hover:translate-y-0 group-hover:rounded-t-none ${solid ? "bg-white" : "bg-black"}`} />
      <span className="relative block h-5 overflow-hidden">
        <span className={row}>{icon}{!round && label}</span>
        <span aria-hidden className={`${row} absolute left-0 top-full ${solid ? "text-black" : "text-white"}`}>{icon}{!round && label}</span>
      </span>
    </>
  );
  const cls = `group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full border ${round ? "w-12" : "px-6"} ${solid ? "border-black bg-black text-white" : "border-black/20 text-[#1d1d1f]"}`;
  return href ? (
    <a href={href} target="_blank" aria-label={label} data-cursor={cursor} className={cls}>{body}</a>
  ) : (
    <button onClick={onClick} data-cursor={cursor} className={cls}>{body}</button>
  );
};

gsap.registerPlugin(ScrollTrigger);

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

      // scroll parallax: name lags behind, portrait rises faster
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: true } });
        tl.to(".hero-word", { y: 160, ease: "none" }, 0)
          .to(".hero-portrait-inner", { y: -90, ease: "none" }, 0);
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
      className="relative isolate flex min-h-[100svh] w-full max-w-[100vw] flex-col overflow-hidden bone-bg px-6 pb-[80vw] pt-20 sm:pb-[60vw] lg:pb-0 text-[#1d1d1f] sm:px-10 lg:px-16"
    >
      <p className="sr-only">
        Portfolio of Muhammad Zaeem Altaf – Full-Stack Developer skilled in Next.js, React, TypeScript, Laravel, and PHP.
        Specializing in building modern, scalable web applications and e-commerce solutions.
      </p>


      {/* 1. dominant name, full width */}
      <h1 className="hero-word relative z-0 flex font-display justify-center whitespace-nowrap text-[13vw] font-bold leading-[0.95] tracking-[0em] select-none lg:-mt-4 lg:text-[11.4vw]">
        <span className="sr-only">Muhammad Zaeem Altaf</span>
        {"ZAEEM ALTAF".split("").map((c, i) => (
          <span key={i} aria-hidden className="pb-[0.04em]">
            <span className="hero-letter inline-block">{c === " " ? " " : c}</span>
          </span>
        ))}
      </h1>

      {/* 2. portrait rises in front of the name's lower edge */}
      <div className="hero-portrait pointer-events-none absolute inset-x-0 -bottom-[20%] z-10 flex justify-center">
        <div id="hero-portrait" className="hero-portrait-inner relative aspect-square w-[92vw] max-w-[640px] sm:w-[66vw] lg:w-[50vw] lg:max-w-[780px]">
          <Image src="/new-profile.png" alt="Muhammad Zaeem Altaf" fill priority sizes="(min-width:1024px) 50vw, 92vw" className="object-contain object-bottom" />
        </div>
      </div>

      {/* 3. intro, left */}
      <div className="hero-fade relative z-20 mt-8 max-w-[22rem] lg:absolute lg:left-16 lg:top-[56%] lg:mt-0 lg:max-w-[23rem]">
        <p className="text-xl font-normal leading-snug tracking-tight lg:text-2xl">
          Hey there! I am full-stack and creative developer building fast, scalable web apps and AI-powered products.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Btn solid cursor="talk" onClick={() => scrollToView("contact")} label="Hire me" icon={<FiArrowUpRight className="text-base" />} />
          <Btn cursor="cv" href="/MUHAMMAD ZAEEM ALTAF.pdf" label="CV" icon={<HiDownload className="text-base" />} />
          <Btn round href="https://github.com/muhammadzaeemaltaf/" label="GitHub" icon={<FiGithub className="text-base" />} />
          <Btn round href="https://www.linkedin.com/in/muhammadzaeemaltaf/" label="LinkedIn" icon={<FaLinkedin className="text-base" />} />
        </div>
      </div>

      {/* 4. roles, right: one lights up at a time */}
      <ul className="hero-fade absolute right-16 top-[56%] z-20 hidden space-y-2.5 text-right text-xl font-medium tracking-tight lg:block">
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
