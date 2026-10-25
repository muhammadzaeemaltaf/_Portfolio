"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// The light gradient (.bone-bg) is pinned to the viewport so Hero, Statement and About read as one
// surface. About sits inside the element Skills pins, and a transformed ancestor makes a fixed
// background anchor to that element instead, so About came out a shade off. This layer is the
// viewport-fixed light surface About now sits on. It only has to exist until Skills' blinds have
// closed over About; after that the page behind is black again.
export default function LightBackdrop() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const about = document.getElementById("about"); // the wrapper in page.tsx: the element Skills pins
    if (!about) return;
    const set = (over: boolean) => {
      if (root.current) root.current.style.visibility = over ? "hidden" : "visible";
    };
    // same window as the Skills pin: from About's bottom at the viewport bottom, for one viewport
    ScrollTrigger.create({
      trigger: about,
      start: "bottom bottom",
      end: "+=100%",
      onUpdate: (self) => set(self.progress >= 1),
      onLeave: () => set(true),
      onEnterBack: () => set(false),
      onRefresh: (self) => set(self.progress >= 1),
    });
  });

  return <div ref={root} aria-hidden className="bone-bg pointer-events-none fixed inset-0 -z-10" />;
}
