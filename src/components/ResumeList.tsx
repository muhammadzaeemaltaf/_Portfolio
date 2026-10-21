"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export type ResumeRow = {
  title: string;
  description: string;
  meta: string;
  date: string;
  href?: string;
};

type Props = {
  id: string;
  label: string;
  rows: ResumeRow[];
};

export default function ResumeList({ id, label, rows }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(".rl-rule", {
        scrollTrigger: { trigger: ref.current, start: "top 80%" },
        scaleX: 0,
        transformOrigin: "left",
        duration: 1,
        ease: "power3.out",
      });
      gsap.from(".rl-row", {
        scrollTrigger: { trigger: ref.current, start: "top 75%" },
        y: 24,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.1,
      });
    },
    { scope: ref },
  );

  return (
    <section
      id={id}
      ref={ref}
      className="scroll-mt-28 mx-auto w-full px-4 md:px-10 lg:px-[1vw] pt-20 pb-24 sm:pb-32 lg:pt-[8vw] lg:pb-[4vw] bg-black text-white"
    >
      <h2 className="font-display font-semibold leading-[1.05] tracking-[-0.035em] text-5xl md:text-7xl lg:text-[7vw] mb-8 lg:mb-[3vw]">
        {label}
      </h2>
      <div className="rl-rule h-px w-full bg-white" />
      <ul>
        {rows.map((row, i) => {
          const Wrapper = row.href ? "a" : "div";
          return (
            <li key={row.title} className="rl-row border-b border-white/15">
              <Wrapper
                {...(row.href
                  ? { href: row.href, target: "_blank", rel: "noreferrer" }
                  : {})}
                className="group grid grid-cols-[2.5rem_1fr_auto] gap-x-4 gap-y-2 py-6 md:grid-cols-[5rem_1fr_16rem_7rem_2rem] md:gap-x-6 lg:grid-cols-[8vw_1fr_22vw_9vw_2vw] lg:gap-x-0 lg:py-[1.6vw]"
              >
                <span className="pt-1.5 text-[11px] lg:pt-[0.4vw] lg:text-[0.7vw] uppercase">
                  P. {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <div>
                    <h3 className="text-xl leading-tight tracking-tight md:text-2xl lg:text-[1.4vw] transition-opacity group-hover:opacity-60">
                      {row.title}
                    </h3>
                    <p className="mt-3 max-w-md text-xs leading-relaxed text-white/80 md:text-[13px] lg:mt-[0.8vw] lg:max-w-[32vw] lg:text-[0.8vw]">
                      {row.description}
                    </p>
                  </div>
                </div>
                <span className="col-start-2 pt-1.5 text-[11px] lg:pt-[0.4vw] lg:text-[0.7vw] uppercase md:col-start-auto">
                  {row.meta}
                </span>
                <span className="col-start-2 pt-1.5 text-[11px] lg:pt-[0.4vw] lg:text-[0.7vw] md:col-start-auto md:text-right">
                  {row.date}
                </span>
                <span className="col-start-3 row-start-1 flex justify-end pt-1.5 md:col-start-auto md:row-start-auto">
                  {row.href && (
                    <ArrowUpRight className="h-3.5 w-3.5 lg:h-[0.8vw] lg:w-[0.8vw] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  )}
                </span>
              </Wrapper>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
