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
  },
  {
    title: "Plan",
    icon: PenLine,
    description:
      "Map the architecture, data models, and API contracts, then break the work into clear, shippable pieces.",
  },
  {
    title: "Build",
    icon: Code2,
    description:
      "Write clean, typed, responsive code — production-grade from the first commit, with polished interactions.",
  },
  {
    title: "Ship",
    icon: Rocket,
    description:
      "Deploy, verify in the real environment, and iterate on feedback — maintaining what's live, not just launching it.",
  },
];

export default function HowIWork() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Staggered reveal — transform + opacity only (compositor-friendly).
      gsap.from(".how-card", {
        opacity: 0,
        y: 40,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      className="relative w-full max-w-[1400px] mx-auto px-4 md:px-10 py-16 bg-black"
      id="how-i-work"
    >
      <Heading heading="How I Work" />

      <div
        ref={containerRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 mt-12 md:mt-16"
      >
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <div
              key={step.title}
              className="how-card group relative flex flex-col rounded-xl border border-white/15 bg-white/[0.02] p-6 overflow-hidden transition-colors duration-300 hover:border-[#1d4ed8]/60"
              style={{ willChange: "transform, opacity" }}
            >
              {/* Step number watermark */}
              <span className="absolute top-2 right-4 text-7xl md:text-8xl font-bold text-[#1d4ed8]/25 select-none pointer-events-none">
                0{i + 1}
              </span>

              <div className="h-12 w-12 rounded-lg bg-black border border-[#1d4ed8] flex items-center justify-center mb-5 shadow-[0_0_15px_-3px_rgba(10,60,207,0.7)] transition-shadow duration-300 group-hover:shadow-[0_0_20px_-2px_rgba(10,60,207,0.9)]">
                <Icon className="h-5 w-5 text-primary-500" />
              </div>

              <h3 className="text-xl font-semibold text-white mb-2">
                {step.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
