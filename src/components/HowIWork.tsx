"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Search, PenLine, Code2, Rocket } from "lucide-react";
import Heading from "./Heading";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const steps = [
  {
    title: "Understand",
    icon: Search,
    description:
      "Dig into the problem, the users, and the constraints before touching code — surfacing real requirements over assumptions.",
    badges: ["Discovery", "User Research", "Requirements"],
  },
  {
    title: "Plan",
    icon: PenLine,
    description:
      "Map the architecture, data models, and API contracts, then break the work into clear, shippable pieces.",
    badges: ["Architecture", "Data Models", "API Contracts"],
  },
  {
    title: "Build",
    icon: Code2,
    description:
      "Write clean, typed, responsive code — production-grade from the first commit, with polished interactions.",
    badges: ["TypeScript", "Responsive", "Clean Code"],
  },
  {
    title: "Ship",
    icon: Rocket,
    description:
      "Deploy, verify in the real environment, and iterate on feedback — maintaining what's live, not just launching it.",
    badges: ["Deploy", "Verify", "Iterate"],
  },
];

const artifacts = [
  // Understand — radar sweep scanning for signals
  <div key="understand" className="relative h-80 w-80 xl:h-96 xl:w-96">
    <div className="absolute inset-0 rounded-full border border-[#1d4ed8]/30" />
    <div className="absolute inset-6 rounded-full border border-[#1d4ed8]/25" />
    <div className="absolute inset-12 rounded-full border border-[#1d4ed8]/20" />
    <div className="absolute top-1/2 left-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1d4ed8]" />
    <div className="art-radar-beam absolute top-1/2 left-1/2 h-px w-1/2 bg-gradient-to-r from-[#1d4ed8] to-transparent" />
    <span className="art-radar-dot absolute top-[22%] left-[64%] h-2 w-2 rounded-full bg-[#1d4ed8]" />
    <span className="art-radar-dot absolute top-[58%] left-[20%] h-1.5 w-1.5 rounded-full bg-[#1d4ed8]" />
    <span className="art-radar-dot absolute top-[72%] left-[70%] h-2 w-2 rounded-full bg-[#1d4ed8]" />
  </div>,

  // Plan — blueprint wireframe drawing itself
  <svg key="plan" viewBox="0 0 220 220" className="h-80 w-80 xl:h-96 xl:w-96" fill="none">
    <defs>
      <pattern id="plan-grid" width="22" height="22" patternUnits="userSpaceOnUse">
        <path d="M22 0H0V22" stroke="#1d4ed8" strokeOpacity="0.12" />
      </pattern>
    </defs>
    <rect width="220" height="220" fill="url(#plan-grid)" />
    <path className="art-plan-path" d="M30 40h90v50H30z" stroke="#1d4ed8" strokeOpacity="0.7" strokeWidth="1.5" />
    <path className="art-plan-path" d="M140 60h50v90h-50z" stroke="#1d4ed8" strokeOpacity="0.5" strokeWidth="1.5" />
    <path className="art-plan-path" d="M30 120h70v60H30z" stroke="#1d4ed8" strokeOpacity="0.5" strokeWidth="1.5" />
    <path className="art-plan-path" d="M120 90h20M100 120v-30M140 150h-40" stroke="#1d4ed8" strokeOpacity="0.6" strokeWidth="1.5" />
    <circle className="art-plan-node" cx="120" cy="90" r="3.5" fill="#1d4ed8" />
    <circle className="art-plan-node" cx="100" cy="120" r="3.5" fill="#1d4ed8" />
    <circle className="art-plan-node" cx="140" cy="150" r="3.5" fill="#1d4ed8" />
  </svg>,

  // Build — code editor typing lines
  <div key="build" className="relative h-80 w-96 rounded-xl border border-[#1d4ed8]/40 bg-black/60 p-7 overflow-hidden">
    <div className="flex gap-2 mb-7">
      <span className="h-3 w-3 rounded-full bg-[#1d4ed8]/70" />
      <span className="h-3 w-3 rounded-full bg-[#1d4ed8]/40" />
      <span className="h-3 w-3 rounded-full bg-[#1d4ed8]/20" />
    </div>
    <div className="space-y-5">
      <div className="art-code-line h-2.5 w-3/4 rounded bg-[#1d4ed8]/70" />
      <div className="art-code-line h-2.5 w-1/2 rounded bg-white/25 ml-6" />
      <div className="art-code-line h-2.5 w-2/3 rounded bg-[#1d4ed8]/50 ml-6" />
      <div className="art-code-line h-2.5 w-1/3 rounded bg-white/25 ml-12" />
      <div className="art-code-line h-2.5 w-3/5 rounded bg-[#1d4ed8]/40 ml-6" />
      <div className="art-code-line h-2.5 w-1/4 rounded bg-white/25" />
    </div>
    <span className="art-code-cursor absolute bottom-7 left-7 h-5 w-2.5 bg-[#1d4ed8]" />
  </div>,

  // Ship — rocket lifting off with orbiting satellite
  <div key="ship" className="relative h-80 w-80 xl:h-96 xl:w-96 flex items-center justify-center">
    <div className="absolute inset-4 rounded-full border border-dashed border-[#1d4ed8]/25" />
    <div className="art-orbit absolute inset-4">
      <span className="absolute -top-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[#1d4ed8] shadow-[0_0_10px_rgba(29,78,216,0.9)]" />
    </div>
    <div className="art-rocket relative flex flex-col items-center">
      <Rocket className="h-24 w-24 text-[#1d4ed8] -rotate-45" />
      <div className="art-rocket-trail mt-1 h-14 w-2 rounded-full bg-gradient-to-b from-[#1d4ed8] to-transparent" />
    </div>
    <span className="art-radar-dot absolute top-6 right-10 h-1 w-1 rounded-full bg-white/60" />
    <span className="art-radar-dot absolute bottom-10 left-8 h-1 w-1 rounded-full bg-white/50" />
    <span className="art-radar-dot absolute top-16 left-12 h-1 w-1 rounded-full bg-white/40" />
  </div>,
];

export default function HowIWork() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLElement>(".work-card");

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      // Stack every card except the first below the viewport, ready to slide up.
      gsap.set(cards.slice(1), { yPercent: 120 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".work-stack",
          start: "center center",
          end: () => `+=${(cards.length - 1) * 100}%`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
        defaults: { ease: "none" },
      });

      cards.forEach((card, i) => {
        if (i === 0) return;
        const label = `card${i}`;
        // Every earlier card shrinks one more notch, so depth stays visible:
        // deepest card ends smallest, each newer card slightly larger.
        for (let j = 0; j < i; j++) {
          tl.to(
            cards[j],
            {
              scale: 1 - 0.04 * (i - j),
              transformOrigin: "center top",
              duration: 1,
            },
            label
          );
        }
        tl.to(card, { yPercent: 0, duration: 1 }, label);
      });

      // Ambient artifacts — infinite drift, independent of scroll. These loop
      // forever once created, so they're paused/resumed based on section
      // visibility below to avoid ticking on every frame for the whole page
      // lifetime (the same jank pattern fixed in bg.tsx's grid flicker).
      const ambientTweens: (gsap.core.Tween | gsap.core.Timeline)[] = [];

      gsap.utils.toArray<HTMLElement>(".work-orb").forEach((orb, i) => {
        ambientTweens.push(
          gsap.to(orb, {
            y: i % 2 ? 24 : -24,
            x: i % 2 ? -14 : 14,
            duration: 3.5 + i * 0.6,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          })
        );
      });
      gsap.utils.toArray<HTMLElement>(".work-ring").forEach((ring, i) => {
        ambientTweens.push(
          gsap.to(ring, {
            rotate: i % 2 ? 360 : -360,
            duration: 20 + i * 4,
            ease: "none",
            repeat: -1,
          })
        );
      });

      // --- Per-card themed artifacts ---

      // Understand: radar sweep + blinking signal dots
      ambientTweens.push(
        gsap.to(".art-radar-beam", {
          rotate: 360,
          duration: 4,
          ease: "none",
          repeat: -1,
          transformOrigin: "left center",
        }),
        gsap.to(".art-radar-dot", {
          opacity: 0.15,
          scale: 0.6,
          duration: 0.9,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          stagger: 0.35,
        })
      );

      // Plan: blueprint paths drawing themselves + pulsing nodes
      gsap.utils.toArray<SVGPathElement>(".art-plan-path").forEach((path, i) => {
        const len = path.getTotalLength();
        ambientTweens.push(
          gsap.fromTo(
            path,
            { strokeDasharray: len, strokeDashoffset: len },
            {
              strokeDashoffset: 0,
              duration: 2,
              ease: "power1.inOut",
              repeat: -1,
              yoyo: true,
              repeatDelay: 0.5,
              delay: i * 0.4,
            }
          )
        );
      });
      ambientTweens.push(
        gsap.to(".art-plan-node", {
          scale: 1.4,
          duration: 1,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          stagger: 0.3,
          transformOrigin: "center center",
        })
      );

      // Build: code lines typing in a loop + blinking cursor
      const codeTl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
      codeTl
        .fromTo(
          ".art-code-line",
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.5,
            ease: "power2.out",
            stagger: 0.35,
            transformOrigin: "left center",
          }
        )
        .to(".art-code-line", {
          scaleX: 0,
          duration: 0.3,
          stagger: 0.1,
          transformOrigin: "left center",
          delay: 1.2,
        });
      ambientTweens.push(
        codeTl,
        gsap.to(".art-code-cursor", {
          opacity: 0,
          duration: 0.5,
          ease: "steps(1)",
          repeat: -1,
          yoyo: true,
        })
      );

      // Ship: rocket bob + exhaust flicker + orbiting satellite
      ambientTweens.push(
        gsap.to(".art-rocket", {
          y: -14,
          duration: 1.6,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        }),
        gsap.to(".art-rocket-trail", {
          scaleY: 1.6,
          opacity: 0.2,
          duration: 0.25,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          transformOrigin: "top center",
        }),
        gsap.to(".art-orbit", {
          rotate: 360,
          duration: 8,
          ease: "none",
          repeat: -1,
          transformOrigin: "center center",
        })
      );

      // Only run the ambient loops while the section is on/near screen.
      const visibility = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top bottom",
        end: "bottom top",
        onEnter: () => ambientTweens.forEach((t) => t.resume()),
        onEnterBack: () => ambientTweens.forEach((t) => t.resume()),
        onLeave: () => ambientTweens.forEach((t) => t.pause()),
        onLeaveBack: () => ambientTweens.forEach((t) => t.pause()),
      });
      if (!visibility.isActive) {
        ambientTweens.forEach((t) => t.pause());
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full max-w-[1400px] mx-auto px-4 md:px-10 py-16 bg-black"
      id="how-i-work"
    >
      <Heading heading="How I Work" />

      <div className="work-stack relative mt-12 md:mt-16 h-[70vh] min-h-[480px]">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <div
              key={step.title}
              className="work-card absolute left-0 right-0 bottom-0 flex items-center justify-center"
              style={{
                zIndex: i + 1,
                // Last card covers the full stack and hides everything behind it.
                top: i === steps.length - 1 ? 0 : i * 36,
                willChange: "transform",
              }}
            >
              <div className="relative w-full h-full rounded-2xl border border-white/15 bg-[#050505] p-8 md:p-14 overflow-hidden flex flex-col justify-center">
                {/* Animated artifacts */}
                <div className="work-orb absolute -top-16 -right-16 h-64 w-64 rounded-full bg-[#1d4ed8]/15 blur-3xl pointer-events-none" />
                <div className="work-orb absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-[#1d4ed8]/10 blur-3xl pointer-events-none" />
                <div className="work-ring absolute top-8 right-8 h-24 w-24 rounded-full border border-dashed border-[#1d4ed8]/40 pointer-events-none hidden md:block" />
                <div className="work-ring absolute bottom-10 right-1/4 h-14 w-14 rounded-full border border-[#1d4ed8]/25 pointer-events-none hidden md:block" />

                {/* Step number watermark */}
                <span className="absolute top-2 right-6 text-8xl md:text-[10rem] font-bold text-[#1d4ed8]/20 select-none pointer-events-none leading-none">
                  0{i + 1}
                </span>

                {/* Themed artifact — right side */}
                <div className="absolute inset-y-0 right-8 md:right-16 z-10 hidden lg:flex items-center pointer-events-none">
                  {artifacts[i]}
                </div>

                <div className="relative z-10 max-w-2xl">
                  <div className="h-14 w-14 rounded-xl bg-black border border-[#1d4ed8] flex items-center justify-center mb-6 shadow-[0_0_15px_-3px_rgba(10,60,207,0.7)]">
                    <Icon className="h-6 w-6 text-primary-500" />
                  </div>

                  <h3 className="text-3xl md:text-4xl font-semibold text-white mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 text-base md:text-lg leading-relaxed mb-6">
                    {step.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {step.badges.map((badge) => (
                      <span
                        key={badge}
                        className="px-3 py-1 rounded-full text-xs md:text-sm text-gray-300 border border-[#1d4ed8]/50 bg-[#1d4ed8]/10"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Progress dots */}
                <div className="absolute bottom-6 left-8 md:left-14 flex gap-2">
                  {steps.map((_, d) => (
                    <span
                      key={d}
                      className={`h-1.5 rounded-full transition-all ${
                        d === i ? "w-6 bg-[#1d4ed8]" : "w-1.5 bg-white/20"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
