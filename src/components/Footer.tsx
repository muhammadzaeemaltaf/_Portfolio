"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { contactLinks } from "@/libs/data";
gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef(null);

  useEffect(() => {
    if (!footerRef.current) return;

    gsap.fromTo(
      footerRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 90%",
        },
      }
    );
  }, []);

  const message = encodeURIComponent("Hey Zaeem! I came through your portfolio and wanted to connect 😊");
  const whatsappURL = `https://wa.me/923452793244?text=${message}`;

  return (
    <footer
      ref={footerRef}
      className="py-10 text-center text-sm text-gray-600 dark:text-gray-400"
    >
      <div className="flex justify-center gap-6 text-xl mb-4">
        {contactLinks.map((item, index) => (
          <div key={index} className="relative group flex items-center justify-center">
            <Link
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={item.label}
              className="text-xl hover:text-[#0077b5] transition-colors"
            >
              {item.icon}
            </Link>
            {/* Tooltip */}
            <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-200 ease-in-out bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
              {item.tooltip}
            </span>
          </div>
        ))}
      </div>
      <p>© {new Date().getFullYear()} Muhammad Zaeem Altaf. All rights reserved.</p>
    </footer>
  );
}
