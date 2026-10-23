"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// uneven horizontal bands, like blinds: each grows up from its own bottom edge, bottom band first (same as Skills)
const BANDS = [1.4, 0.6, 1, 0.5, 1.6, 0.8, 1.2, 0.9];

const steps = [
  {
    title: "Understand",
    accent: "the problem",
    description:
      "Dig into the problem, the users, and the constraints before touching code — surfacing real requirements over assumptions.",
  },
  {
    title: "Plan",
    accent: "the system",
    description:
      "Map the architecture, data models, and API contracts, then break the work into clear, shippable pieces.",
  },
  {
    title: "Build",
    accent: "with care",
    description:
      "Write clean, typed, responsive code — production-grade from the first commit, with polished interactions.",
  },
  {
    title: "Ship",
    accent: "& support",
    description:
      "Deploy, verify in the real environment, and iterate on feedback — maintaining what's live, not just launching it.",
  },
];

const HEADING = "How I Work";

// the shape rolling along the line gains sides as it goes, ending as a circle
const SIDES = [4, 5, 6, 8, 10, 12, 16, 24, 40, 64];
// sample count divisible by every low side count's vertex spacing (8, 10, 12, 16, 20, 24) so corners stay sharp
const SAMPLES = 240;
const ease = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (t: number) => Math.min(Math.max(t, 0), 1);

// distance from the centre to the edge of a regular n-gon (circumradius 1) at angle a, flat side on top when rot = 0
const polyRadius = (n: number, a: number, rot: number) => {
  const seg = (2 * Math.PI) / n;
  const local =
    ((((a - rot + Math.PI / 2 - Math.PI / n) % seg) + seg) % seg) - Math.PI / n;
  return Math.cos(Math.PI / n) / Math.cos(local);
};

export default function HowIWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current!;
      const stage = section.querySelector<HTMLElement>(".hw-stage")!;
      const wave = section.querySelector<SVGPathElement>(".hw-wave")!;
      const shape = section.querySelector<SVGPathElement>(".hw-shape")!;
      const dot = section.querySelector<SVGCircleElement>(".hw-dot")!;
      const cols = gsap.utils.toArray<HTMLElement>(".hw-col");
      const state = { q: 0, sq: 0 }; // q: line, sq: rolling shape (starts once the first column is almost open)
      const size = { W: 0, H: 0, k: 1 };
      const track = section.querySelector<HTMLElement>(".hw-track")!;
      // the shape's outline relative to its centre, reused every frame
      const ox = new Float32Array(SAMPLES);
      const oy = new Float32Array(SAMPLES);

      // measured only on resize/refresh: reading layout inside draw() right after the
      // previous frame's attribute writes forced a synchronous layout every frame
      const measure = () => {
        size.W = stage.clientWidth;
        size.H = stage.clientHeight;
        // the scene is sized in vw of the stage; on phones that is tiny, so scale it up
        size.k = window.innerWidth < 1024 ? 2.4 : 1;
      };

      // everything is laid out in vw/vh of the stage, so it scales with the screen
      const draw = () => {
        const { W, H } = size;
        if (!W || !H) return;
        const u = W / 100;
        const vw = u * size.k;
        const vh = H / 100;
        const s = ease(clamp01((state.q - 0.1) / 0.75));

        // scalloped line: arches flatten and tighten until it is a straight line
        const A = 2.45 * vw * (1 - s);
        const P = (8.9 - 6.1 * s) * vw;
        const L = (56.6 - 2.1 * s) * vh;
        const lineY = (x: number) =>
          L - A * Math.abs(Math.sin((Math.PI * (x + 0.8 * vw)) / P));
        let d = "";
        for (let x = 0; x <= W + 4; x += 4) {
          d += `${x ? "L" : "M"}${x} ${lineY(x).toFixed(1)}`;
        }
        wave.setAttribute("d", d);

        // the rolling polygon: it rolls in from off-screen left, stays a square until it
        // reaches its old resting spot, then morphs into a circle
        const R = 6.3 * vw;
        const xStart = -R - 2 * vw;
        const x0 = 4.6 * u;
        const xEnd = 92.5 * u;
        const cx = xStart + (xEnd - xStart) * state.sq;
        const rot = (cx - x0) / R;

        // fractional position in SIDES, blended between neighbouring polygons so sides grow without popping
        const k = ease(clamp01((cx - x0) / (xEnd - x0))) * (SIDES.length - 1);
        const i0 = Math.min(Math.floor(k), SIDES.length - 2);
        const f = k - i0;
        const n0 = SIDES[i0];
        const n1 = SIDES[i0 + 1];
        // rest it on the line: drop the centre until the lowest point of the outline (against
        // the line beneath that point, so it rides the arches too) just touches it
        let cy = Infinity;
        for (let i = 0; i < SAMPLES; i++) {
          const a = rot - Math.PI / 2 + (2 * Math.PI * i) / SAMPLES;
          const r =
            R * (polyRadius(n0, a, rot) * (1 - f) + polyRadius(n1, a, rot) * f);
          ox[i] = r * Math.cos(a);
          oy[i] = r * Math.sin(a);
          cy = Math.min(cy, lineY(cx + ox[i]) - oy[i]);
        }
        let p = "";
        for (let i = 0; i < SAMPLES; i++) {
          p += `${i ? "L" : "M"}${(cx + ox[i]).toFixed(1)} ${(cy + oy[i]).toFixed(1)}`;
        }
        shape.setAttribute("d", p + "Z");
        dot.setAttribute("cx", cx.toFixed(1));
        dot.setAttribute("cy", cy.toFixed(1));
      };
      const refresh = () => {
        measure();
        draw();
      };

      const veil = veilRef.current!;
      const bands = Array.from(veil.children);
      // after the scene, blinds close over it inside the same pin, then Services scrolls in.
      // once they are shut the scene is dropped so it never shows as it scrolls away
      const closeBlinds = (
        tl: gsap.core.Timeline,
        at: number,
        length: number,
      ) =>
        tl.fromTo(
          bands,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "power2.inOut",
            duration: length,
            stagger: { each: length / 10, from: "end" },
          },
          at,
        );
      // Project's flip reads this flag so a later refresh can't switch the white theme back on
      const setPast = (over: boolean) =>
        over
          ? document.documentElement.setAttribute("data-past-process", "")
          : document.documentElement.removeAttribute("data-past-process");
      const done = (over: boolean) => {
        // Services onward stays dark: the white flip from Projects only runs up to here
        gsap.set(veil, { autoAlpha: over ? 0 : 1 });
        section.style.visibility = over ? "hidden" : "";
        setPast(over);
        // no 0.6s fade here: the page just snaps dark as you scroll past
        const root = document.documentElement;
        root.style.transition = "none";
        root.classList.toggle("site-light", !over);
        void root.offsetHeight;
        root.style.transition = "";
      };
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          state.q = state.sq = 1;
          refresh();
          return;
        }
        refresh();
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "+=450%",
            onLeave: () => done(true),
            onEnterBack: () => done(false),
            pin: true,
            // Lenis already eases the scroll; a scrub delay on top of it made the scene lag and rubber-band
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefresh: (self) => {
              refresh();
              if (self.scroll() >= self.end) done(true);
              else setPast(false);
            },
          },
          defaults: { ease: "none" },
          // one redraw per frame, however many state tweens moved
          onUpdate: draw,
        });
        // columns grow up from the bottom one after another, left first
        tl.fromTo(
          cols,
          { clipPath: "inset(100% 0% 0% 0%)" },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            ease: "power2.inOut",
            duration: 2.2,
            stagger: 0.25,
          },
          0,
        )
          .to(state, { q: 1, duration: 3.2 }, 0)
          // the shape rolls in from the left edge as column one finishes opening, easing to a stop
          .fromTo(
            state,
            { sq: 0 },
            {
              sq: 1,
              ease: "power1.out",
              duration: 1.9,
              immediateRender: false,
            },
            1.3,
          )
          // settle: the whole stage lifts a touch at the end
          .to(stage, { y: "-2.65vh", ease: "power1.inOut", duration: 0.4 }, 3.2)
          .to({}, { duration: 0.4 }, 3.6);
        closeBlinds(tl, 4, 1.143);
        return () => {
          gsap.set(cols, { clearProps: "clipPath" });
          gsap.set(stage, { clearProps: "transform" });
        };
      });
      // phones: cards stay open and slide sideways as you scroll, with the line and shape animating alongside
      mm.add("(max-width: 1023px)", () => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          state.q = state.sq = 1;
          refresh();
          return;
        }
        refresh();
        const slide = () =>
          -Math.max(0, track.scrollWidth - (stage.clientWidth - 32));
        // the line settles and the shape rolls across the screen in step with the slide, as on desktop
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${Math.abs(slide()) * 2.8 * 1.4}`,
            onLeave: () => done(true),
            onEnterBack: () => done(false),
            pin: true,
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onRefresh: (self) => {
              refresh();
              if (self.scroll() >= self.end) done(true);
              else setPast(false);
            },
          },
          defaults: { ease: "none" },
          onUpdate: draw,
        });
        tl.to(track, { x: slide, duration: 1 }, 0)
          .to(state, { q: 1, duration: 0.5 }, 0)
          .fromTo(
            state,
            { sq: 0 },
            { sq: 1, duration: 1, immediateRender: false },
            0,
          );
        closeBlinds(tl, 1, 0.4);
        return () => {
          gsap.set(track, { clearProps: "transform" });
        };
      });
      // headline rises in as the section arrives, then stays put above the pinned scene
      if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.from(".hw-char", {
          scrollTrigger: { trigger: section, start: "top 75%" },
          yPercent: 115,
          duration: 0.9,
          ease: "power4.out",
          stagger: 0.03,
        });
        gsap.from(".hw-fade", {
          scrollTrigger: { trigger: section, start: "top 75%" },
          y: 16,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
        });
      }

      // the stage sits under the headline, so its size can change without a window resize (e.g. once fonts load)
      const ro = new ResizeObserver(refresh);
      ro.observe(stage);
      return () => {
        ro.disconnect();
        mm.revert();
        section.style.visibility = "";
        setPast(false);
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="how-i-work"
      className="relative w-full overflow-hidden bg-black text-white flex h-[100svh] flex-col"
    >
      {/* blinds: fixed over the viewport during the tail of the pin. bg-white because the site is inverted here, so they render black */}
      <div
        ref={veilRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-30 flex flex-col"
      >
        {BANDS.map((g, i) => (
          <div
            key={i}
            style={{ flexGrow: g }}
            className="origin-bottom basis-0 bg-white"
          />
        ))}
      </div>
      <header className="px-4 pt-20 lg:px-[1vw] lg:pt-[4.17vh]">
        <p className="hw-fade flex items-center gap-3 font-mono text-xs uppercase tracking-[0.25em] text-white/45 lg:gap-[0.83vw] lg:text-[0.83vw]">
          <span className="h-px w-8 bg-white/30 lg:w-[2.2vw]" />
          Process
        </p>
        <h2
          aria-label={HEADING}
          className="mt-4 font-display text-4xl font-semibold leading-[1.1] tracking-[-0.035em] md:text-6xl lg:mt-[1vw] lg:text-[4.17vw]"
        >
          {HEADING.split(" ").map((w, i) => (
            <span
              key={i}
              aria-hidden
              className="mr-[0.25em] inline-block overflow-hidden align-bottom"
            >
              {w.split("").map((c, j) => (
                <span key={j} className="hw-char inline-block">
                  {c}
                </span>
              ))}
            </span>
          ))}
        </h2>
      </header>

      <div className="hw-stage relative min-h-0 flex-1 overflow-hidden px-4 pb-8 pt-6 lg:flex lg:flex-row lg:gap-[0.63vw] lg:overflow-visible lg:px-[1vw] lg:pb-[1.9vh] lg:pt-[5vh]">
        <div className="hw-track flex h-full w-max gap-3 lg:contents">
          {steps.map((step, i) => (
            <article
              key={step.title}
              className="hw-col relative flex h-full w-[78vw] max-w-[22rem] shrink-0 flex-col justify-end bg-white p-5 text-black lg:h-auto lg:w-auto lg:max-w-none lg:flex-1 lg:p-[1vw] lg:pb-[1.3vw]"
            >
              <span className="absolute left-5 top-5 font-mono text-xs lg:left-[1vw] lg:top-[1.3vw] lg:text-[0.65vw]">
                0{i + 1}
              </span>
              <h3 className="font-display text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.02em] lg:text-[1.5vw] lg:leading-[1.15]">
                {step.title}
                <br />
                <span className="opacity-55">{step.accent}</span>
              </h3>
              <p className="mt-5 max-w-[26rem] text-sm leading-snug lg:mt-[1.4vw] lg:max-w-[21vw] lg:text-[0.85vw] lg:leading-[1.35]">
                {step.description}
              </p>
            </article>
          ))}
        </div>

        {/* scalloped line and the shape rolling on it: strokes are black so the site's white flip renders them white */}
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full text-black"
          fill="none"
          stroke="currentColor"
        >
          <path className="hw-wave" strokeWidth="1.2" />
          <path className="hw-shape" strokeWidth="1.2" />
          <circle className="hw-dot" r="3" fill="currentColor" stroke="none" />
        </svg>
      </div>
    </section>
  );
}
