"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X } from 'lucide-react';
import { navlinks } from "@/libs/data";
import gsap from "gsap";
import { AnimatedButton } from "./AnimateButton";
import Image from "next/image";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const slideNavbar = () => {
      if (navRef.current) {
        if (window.scrollY > 400) {
          gsap.to(navRef.current, { duration: 0.1, y: -100 });
          if (isMenuOpen) setIsMenuOpen(false);
        } else {
          gsap.to(navRef.current, { duration: 0.1, y: 0 });
        }
      }
    };

    document.addEventListener("scroll", slideNavbar);
    return () => {
      document.removeEventListener("scroll", slideNavbar);
    }
  }, [isMenuOpen]);

  // Revised menu animation useEffect for smooth open and close:
  useEffect(() => {
    if (menuRef.current) {
      if (isMenuOpen) {
        gsap.fromTo(
          menuRef.current,
          { y: -50, opacity: 0 },
          { duration: 0.5, y: 160, opacity: 1, ease: "power2.out" }
        );
      } else {
        gsap.to(menuRef.current, { duration: 0.1, y: '-100%', opacity: 0, ease: "power2.out" });
      }
    }
  }, [isMenuOpen]);

  return (
    <header
      className="z-50 fixed transition-all duration-600 ease-in-out max-w-[1200px] mx-auto
      lg:h-[80px] md:h-[76px] h-[58px] px-[20px]  rounded-[62px] 
      top-[10px] left-[10px] right-[10px] md:top-[20px] md:left-[20px] md:right-[20px] 
      flex flex-row justify-between items-center backdrop-blur-xs bg-black/20 border border-white/10"
      ref={navRef}
    >
      <div className="flex flex-row items-center gap-[68px]">
      <Link href="/" className="text-2xl font-bold text-transparent bg-gradient-to-r from-white to-gray-300 bg-clip-text">
          <Image
          src={'/logo.svg'}
          alt="Logo"
          height={60}
          width={60} 
          className="w-[36px] h-[36px] lg:w-[60px] lg:h-[60px]"
          />
        </Link>
      </div>
        <div className="gap-[32px] hidden lg:flex flex-row ">
          {navlinks.map((link, index) => (
            <Link
              key={index}
              className="lg:text-[16px] h-[26px] font-medium text-gray-200 hover:text-blue-400 transition-all ease-in duration-150"
              href={`/#${link.toLowerCase()}`}
            >
              {link}
            </Link>
          ))}
        </div>

      <div className="flex gap-[10px] md:gap-[32px] items-center">
        <div className="flex flex-row md:gap-[8px] items-center">
          <AnimatedButton text="Contact us" arrow bg="!px-4 !text-xs !h-9 md:!h-11 md:!px-6 md:!text-sm bg-black/70" href="#contact" />
        </div>

        <button
          className="flex lg:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Menu className="w-6 h-6 text-white" />
          )}
        </button>
      </div>

      {/* Menu container with added close button */}
      <div
        ref={menuRef}
        className="absolute left-0 right-0 -top-42 backdrop-blur-md bg-black text-white p-6 shadow-lg rounded-[20px] lg:hidden mt-2 border border-white/10"
      >
        <div className="flex justify-end">
          <button onClick={() => setIsMenuOpen(false)} aria-label="Close menu">
            <X className="w-6 h-6 text-white" />
          </button>
        </div>
        <div className="flex flex-col space-y-4">
        {navlinks.map((link, index) => (
            <Link
              key={index}
              className="lg:text-[16px] h-[26px] font-medium text-gray-200 hover:text-blue-400 transition-all ease-in duration-150"
              href={`/#${link.toLowerCase()}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {link}
            </Link>
          ))}
         
        </div>
      </div>
    </header>
  );
}
