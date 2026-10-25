"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const INTERACTIVE = "a, button, [role='button'], summary, label, [data-cursor]";

// Dot snaps to the pointer, ring trails behind. Over anything clickable the ring
// grows into a soft filled disc (blend-difference keeps it readable on light and
// dark sections); elements with data-cursor="text" also show that label in mono.
const Cursor = () => {
  const root = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    document.documentElement.classList.add("has-cursor");
    gsap.set([dot.current, ring.current], { xPercent: -50, yPercent: -50, opacity: 0 });

    const dx = gsap.quickTo(dot.current, "x", { duration: 0.08, ease: "power3.out" });
    const dy = gsap.quickTo(dot.current, "y", { duration: 0.08, ease: "power3.out" });
    const rx = gsap.quickTo(ring.current, "x", { duration: 0.45, ease: "power3.out" });
    const ry = gsap.quickTo(ring.current, "y", { duration: 0.45, ease: "power3.out" });

    let shown = false;
    const move = (e: MouseEvent) => {
      if (!shown) {
        shown = true;
        gsap.set([dot.current, ring.current], { x: e.clientX, y: e.clientY });
        gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.3 });
      }
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);

      const el = (e.target as Element | null)?.closest?.(INTERACTIVE) as HTMLElement | null;
      const text = el?.dataset.cursor ?? "";
      if (label.current) label.current.textContent = text;
      if (root.current) root.current.style.mixBlendMode = text === "View" || text === "Hi" ? "normal" : ""; // no colour inversion over project cards or the Statement photo
      gsap.to(ring.current, { scale: el ? (text ? 3.2 : 2.2) : 1, duration: 0.35, ease: "power3.out", overwrite: "auto" });
      gsap.to(dot.current, { scale: el ? 0.4 : 1, duration: 0.25, overwrite: "auto" });
      gsap.to(ring.current, { backgroundColor: el ? "rgba(255,255,255,1)" : "rgba(255,255,255,0)", duration: 0.3, overwrite: false });
    };
    const down = () => gsap.to(ring.current, { scale: "-=0.35", duration: 0.15 });
    const up = () => gsap.to(ring.current, { scale: "+=0.35", duration: 0.2 });
    const leave = () => gsap.to([dot.current, ring.current], { opacity: 0, duration: 0.2 });
    const enter = () => shown && gsap.to([dot.current, ring.current], { opacity: 1, duration: 0.2 });

    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    document.documentElement.addEventListener("mouseleave", leave);
    document.documentElement.addEventListener("mouseenter", enter);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      document.documentElement.removeEventListener("mouseleave", leave);
      document.documentElement.removeEventListener("mouseenter", enter);
    };
  }, []);

  return (
    <div ref={root} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[200] mix-blend-difference">
      <div ref={ring} className="absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full border border-white">
        <span ref={label} className="font-mono text-[5px] font-semibold uppercase tracking-wider text-black" />
      </div>
      <div ref={dot} className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-white" />
    </div>
  );
};

export default Cursor;
