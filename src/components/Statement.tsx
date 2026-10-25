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

      // the whole block settles to full size as it arrives and eases back a touch as it leaves
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
          },
        })
        .fromTo(".st-content", { scale: 0.94 }, { scale: 1, duration: 1 })
        .to(".st-content", { scale: 0.94, duration: 1 });

      // each block lights up word by word as it scrolls through the middle of the screen
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

      // mouse only: the photo tilts toward the pointer and words near it lift
      const mm = gsap.matchMedia();
      mm.add("(hover: hover) and (pointer: fine)", () => {
        const root = section.current!;
        const photo = root.querySelector<HTMLElement>(".st-photo")!;
        const shift = root.querySelector<HTMLElement>(".st-photo-shift")!;

        const rx = gsap.quickTo(photo, "rotationX", {
          duration: 0.6,
          ease: "power3.out",
        });
        const ry = gsap.quickTo(photo, "rotationY", {
          duration: 0.6,
          ease: "power3.out",
        });
        const sx = gsap.quickTo(shift, "xPercent", {
          duration: 0.8,
          ease: "power3.out",
        });
        const sy = gsap.quickTo(shift, "yPercent", {
          duration: 0.8,
          ease: "power3.out",
        });
        gsap.set(photo, { transformPerspective: 700 });
        const tilt = (e: PointerEvent) => {
          const r = photo.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          ry(px * 14);
          rx(-py * 14);
          sx(-px * 5); // the picture slides the other way inside its frame
          sy(-py * 5);
        };
        const rest = () => {
          rx(0);
          ry(0);
          sx(0);
          sy(0);
        };
        photo.addEventListener("pointermove", tilt);
        photo.addEventListener("pointerleave", rest);

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
          photo.removeEventListener("pointermove", tilt);
          photo.removeEventListener("pointerleave", rest);
          root.removeEventListener("pointerenter", enter);
          root.removeEventListener("pointermove", move);
          root.removeEventListener("pointerleave", leave);
          gsap.ticker.remove(follow);
          gsap.set([photo, shift, ...words], {
            clearProps: "rotationX,rotationY,xPercent,yPercent,y,scale",
          });
        };
      });
    },
    { scope: section },
  );

  return (
    <div
      ref={section}
      className="bone-bg relative w-full overflow-hidden px-4 py-20 text-[#1d1d1f] md:px-8 lg:flex lg:min-h-[100svh] lg:items-center lg:px-[1vw] lg:py-[9vh]"
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
