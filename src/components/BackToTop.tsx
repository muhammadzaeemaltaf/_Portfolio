"use client";

import { useState, useEffect, useRef } from "react";
import { FiArrowUp } from "react-icons/fi";
import { scrollToView } from "@/libs/data";

const BackToTop = () => {
  const [scrollPercentage, setScrollPercentage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (frameRef.current !== null) return;
      frameRef.current = requestAnimationFrame(() => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        setScrollPercentage(docHeight > 0 ? (scrollTop / docHeight) * 100 : 0);
        setIsVisible(scrollTop > 200);
        frameRef.current = null;
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, []);
 
  const C = 2 * Math.PI * 21; // ring circumference, r=21

  return (
    <button
      type="button"
      aria-label="Back to top"
      tabIndex={isVisible ? 0 : -1}
      onClick={() => scrollToView()}
      className={`fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-black text-white transition-all duration-500 lg:bottom-[2vw] lg:right-[2vw] ${isVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}
    >
      <svg aria-hidden="true" viewBox="0 0 48 48" className="absolute inset-0 -rotate-90">
        <circle cx="24" cy="24" r="21" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
        <circle
          cx="24"
          cy="24"
          r="21"
          fill="none"
          stroke="#fff"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={(1 - scrollPercentage / 100) * C}
        />
      </svg>
      <FiArrowUp size={18} />
    </button>
  );
};

export default BackToTop;
