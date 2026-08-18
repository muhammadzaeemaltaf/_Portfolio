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
 
  return (
    isVisible && (
      <button
        type="button"
        aria-label="Back to top"
        onClick={() => scrollToView()}
        className="fixed bottom-8 right-8 group text-white rounded-full p-4 cursor-pointer flex justify-center items-center scale-150"
        style={{ width: "60px", height: "60px" }}
      >
        {/* Circular progress SVG */}
        <svg aria-hidden="true" width="60" height="60" viewBox="0 0 60 60" className="rotate-90">
          <circle
            cx="30"
            cy="30"
            r="27"
            stroke="#1d4ed8"
            strokeWidth="4"
            fill="none"
            strokeDasharray="169.65"
            strokeDashoffset={(1 - scrollPercentage / 100) * 169.65}
            className="transition-[strokeDashoffset,stroke,box-shadow] duration-300 ease-in-out group-hover:stroke-blue-400 group-hover:shadow-[0_0_12px_rgba(59,130,246,0.8),0_0_20px_rgba(59,130,246,0.5)]"
          />
        </svg>

        {/* Arrow Icon */}
        <FiArrowUp className="absolute text-white group-hover:text-blue-200 transition-colors duration-300" size={20} />
      </button>
    )
  );
};

export default BackToTop;