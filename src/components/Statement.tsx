"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Swap this to change the photo; it is cropped to a wide strip around the face.
const PHOTO = "/profile-pic.png";

// [text, italic accent?]: plain parts are the sans voice, accents are the serif italic one
type Part = [string, boolean?];

const HEADLINE: Part[] = [
  ["Software isn't just code that runs. "],
  ["It's the first thing your customers judge you by.", true],
];
const PATH: Part[] = [
  ["First, I understand where you are → "],
  ["then I build the clearest path to where you're going.", true],
];
const NOTE: Part[] = [
  [
    "Frontend, backend, AI agents, integrations, you name it. I cover the full loop so your product never has to start over somewhere new. ",
  ],
  ["One developer → Full circle.", true],
];

// every word is its own span so the scroll can light them up one by one
const Words = ({ parts }: { parts: Part[] }) => (
  <>
    {parts.map(([text, accent], i) =>
      text
        .split(" ")
        .filter(Boolean)
        .map((w, j) => (
          <span
            key={`${i}-${j}`}
            className={`st-word inline-block ${accent ? "font-serif italic text-[#2563eb]" : ""}`}
          >
            {w}&nbsp;
          </span>
        )),
    )}
  </>
);

export default function Statement() {
  const section = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // desktop: the section pins when it reaches the top and its content scales down while held, then scrolling carries on
      const scene = gsap.matchMedia();
      scene.add("(min-width: 1024px)", () => {
        gsap.to(".st-content", {
          scale: 0.94,
          ease: "none",
          scrollTrigger: {
            trigger: section.current,
            start: "top top",
            end: "+=50%",
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
          },
        });
      });
      // smaller screens flow normally: the block just eases back a touch as it leaves
      scene.add("(max-width: 1023px)", () => {
        gsap.to(".st-content", {
          scale: 0.94,
          ease: "none",
          scrollTrigger: {
            trigger: section.current,
            start: "center center",
            end: "bottom top",
            scrub: 0.6,
          },
        });
      });

      // each block lights up word by word as it scrolls through the middle of the screen
      // (on desktop the section pins, so the blocks stop moving: light them up as the section rises into place instead)
      scene.add("(min-width: 1024px)", () => {
        gsap.utils.toArray<HTMLElement>(".st-block").forEach((block) => {
          gsap.from(block.querySelectorAll(".st-word"), {
            scrollTrigger: {
              trigger: section.current,
              start: "top 85%",
              end: "top 15%",
              scrub: 0.3,
            },
            opacity: 0.15,
            stagger: 0.04,
            ease: "none",
          });
        });
      });
      scene.add("(max-width: 1023px)", () => {
        gsap.utils.toArray<HTMLElement>(".st-block").forEach((block) => {
          gsap.from(block.querySelectorAll(".st-word"), {
            scrollTrigger: {
              trigger: block,
              start: "top 85%",
              end: "bottom 55%",
              scrub: 0.3,
            },
            opacity: 0.15,
            stagger: 0.04,
            ease: "none",
          });
        });
      });

      // photo is unveiled from the bottom, then drifts slowly against the scroll
      gsap.from(".st-photo", {
        scrollTrigger: { trigger: ".st-photo", start: "top 90%" },
        clipPath: "inset(100% 0% 0% 0%)",
        duration: 1.2,
        ease: "power4.out",
      });
      gsap.fromTo(
        ".st-photo-img",
        { scale: 1.25 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: ".st-photo",
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        },
      );

      // mouse only: words near the pointer lift
      const mm = gsap.matchMedia();
      mm.add("(hover: hover) and (pointer: fine)", () => {
        const root = section.current!;

        // words within reach of the pointer rise and grow a little, the nearest most
        const words = gsap.utils.toArray<HTMLElement>(".st-word", root);
        const lift = words.map((w) => ({
          y: gsap.quickTo(w, "y", { duration: 0.4, ease: "power3.out" }),
          s: gsap.quickTo(w, "scale", { duration: 0.4, ease: "power3.out" }),
        }));
        let pointer: { x: number; y: number } | null = null;
        const reach = () => Math.max(110, window.innerWidth * 0.08);
        const follow = () => {
          const R = reach();
          words.forEach((w, i) => {
            let f = 0;
            if (pointer) {
              const r = w.getBoundingClientRect();
              const d = Math.hypot(
                pointer.x - (r.left + r.width / 2),
                pointer.y - (r.top + r.height / 2),
              );
              f = Math.max(0, 1 - d / R);
            }
            lift[i].y(-f * f * 10);
            lift[i].s(1 + f * f * 0.1);
          });
        };
        const enter = () => gsap.ticker.add(follow);
        const move = (e: PointerEvent) =>
          (pointer = { x: e.clientX, y: e.clientY });
        const leave = () => {
          pointer = null;
          follow();
          gsap.ticker.remove(follow);
        };
        root.addEventListener("pointerenter", enter);
        root.addEventListener("pointermove", move);
        root.addEventListener("pointerleave", leave);

        return () => {
          root.removeEventListener("pointerenter", enter);
          root.removeEventListener("pointermove", move);
          root.removeEventListener("pointerleave", leave);
          gsap.ticker.remove(follow);
          gsap.set(words, { clearProps: "y,scale" });
        };
      });
    },
    { scope: section },
  );

  return (
    <div
      ref={section}
      className="relative w-full overflow-hidden px-4 py-20 text-[#1d1d1f] md:px-8 lg:flex lg:min-h-[100svh] lg:items-center lg:px-[1vw] lg:py-[9vh]"
    >
      <div className="st-content mx-auto grid w-full max-w-6xl gap-12 md:gap-16 lg:max-w-none lg:grid-cols-2 lg:gap-[1vw]">
        {/* left: the statement on top, a small note anchored to the bottom */}
        <div className="flex flex-col justify-between gap-16 lg:gap-[4vw]">
          <p className="st-block max-w-[46rem] font-display text-4xl font-medium leading-[1.02] tracking-[-0.03em] md:text-6xl lg:max-w-[46vw] lg:text-[3.1vw]">
            <Words parts={HEADLINE} />
          </p>
          <p className="st-block max-w-[26rem] text-sm leading-[1.25] lg:max-w-[26vw] lg:text-[1.05vw]">
            <Words parts={NOTE} />
          </p>
        </div>

        {/* right: a small photo, then the promise */}
        <div className="flex flex-col gap-8 lg:gap-[2.6vw]">
          <div
            data-cursor="Hi"
            className="st-photo relative aspect-[2.06/1] w-full shrink-0 overflow-hidden md:w-[60%] lg:w-[17.7vw]"
          >
            {/* oversized so the picture can slide inside its frame without showing an edge */}
            <div className="st-photo-shift absolute -inset-[6%]">
              <Image
                src={PHOTO}
                alt="Muhammad Zaeem Altaf"
                fill
                sizes="(min-width: 1024px) 20vw, 66vw"
                className="st-photo-img select-none object-cover object-[50%_32%]"
              />
            </div>
          </div>
          <p className="st-block font-display text-3xl font-medium leading-[1.02] tracking-[-0.03em] md:text-5xl lg:text-[3.1vw]">
            <Words parts={PATH} />
          </p>
        </div>
      </div>
    </div>
  );
}
