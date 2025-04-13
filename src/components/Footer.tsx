"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { FaGithub, FaLinkedin } from "react-icons/fa";

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

  return (
    <footer
      ref={footerRef}
      className="py-10 text-center text-sm text-gray-600 dark:text-gray-400"
    >
      <div className="flex justify-center gap-6 text-xl mb-4">
        <Link href="https://github.com/yourusername" target="_blank" className="hover:text-black dark:hover:text-white transition-colors">
          <FaGithub />
        </Link>
        <Link href="https://linkedin.com/in/yourusername" target="_blank" className="hover:text-[#0077b5] transition-colors">
          <FaLinkedin />
        </Link>
      </div>
      <p>© {new Date().getFullYear()} Muhammad Zaeem Altaf. All rights reserved.</p>
    </footer>
  );
}
