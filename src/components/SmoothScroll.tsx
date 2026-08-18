"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SmoothScroll = () => {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // autoRaf must stay off and Lenis must be driven by gsap.ticker, with
    // ScrollTrigger told to re-check on every Lenis tick — otherwise pinned/
    // scrubbed ScrollTriggers (About, Skills, HowIWork) read a scroll position
    // a frame behind Lenis's own rAF loop and visibly stutter.
    const lenis = new Lenis({
      autoRaf: false,
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenis.on("scroll", ScrollTrigger.update);

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    const smoothWindow = window as Window & { portfolioLenis?: Lenis };
    smoothWindow.portfolioLenis = lenis;

    return () => {
      gsap.ticker.remove(update);
      delete smoothWindow.portfolioLenis;
      lenis.destroy();
    };
  }, []);

  return null;
};

export default SmoothScroll;
