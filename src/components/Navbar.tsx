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
  const navRef = useRef(null);
  const linksRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    // Initial animation on component mount
    if (navRef.current && linksRef.current && buttonRef.current) {
      // Set initial states
      gsap.set(navRef.current, { 
        width: window.innerWidth <= 768 ? "150px" : "300px", // Start narrow enough for logo and button
        borderRadius: "62px", 
        padding: "0 20px",
        overflow: "hidden"
      });
      gsap.set(linksRef.current, { opacity: 0, display: "none" });
      gsap.set(buttonRef.current, { opacity: 1, display: "flex" });

      // Create animation timeline
      const tl = gsap.timeline();
      
      // Animate navbar expansion
      tl.to(navRef.current, {
        width: "calc(100% - 40px)",
        maxWidth: 1200,
        borderRadius: "62px",
        paddingLeft: 20,
        paddingRight: 20,
        duration: 0.2,
        ease: "power3.out",
        overflow: "visible",
        delay: 1
      })
      // Animate links appearance
      .to(linksRef.current, {
        display: "flex",
        opacity: 1,
        width: "auto",
        overflow: "visible",
        duration: 0.4,
        delay: 0.2,
        ease: "power2.in"
      });
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;
  
    const slideNavbar = () => {
      const currentScrollY = window.scrollY;
      const goingDown = currentScrollY > lastScrollY;
  
      if (navRef.current) {
        if (currentScrollY > 200 && goingDown) {
          gsap.to(navRef.current, { duration: 0.3, y: -100, ease: "power2.out" });
          if (isMenuOpen) setIsMenuOpen(false);
        } else {
          gsap.to(navRef.current, { duration: 0.1, y: 0, ease: "back.out" });
        }
      }
  
      lastScrollY = currentScrollY;
    };
  
    window.addEventListener("scroll", slideNavbar);
    return () => {
      window.removeEventListener("scroll", slideNavbar);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    // Handle mobile menu animation
    if (menuRef.current) {
      gsap.to(menuRef.current, {
        y: isMenuOpen ? -64 : -100,
        opacity: isMenuOpen ? 1 : 0,
        display: isMenuOpen ? 'block' : 'none',
        duration: 0.3,
        ease: "power2.out"
      });
    }
  }, [isMenuOpen]);

  return (
    <header
      className="z-50 fixed transition-all duration-600 ease-in-out w-[150px] md:w-[300px]  max-w-[1200px] mx-auto
      lg:h-[70px] md:h-[70px] h-[58px] rounded-[62px] 
      top-[10px] left-[10px] right-[10px] md:top-[20px] md:left-[20px] md:right-[20px] px-[20px]
      flex flex-row justify-between items-center backdrop-blur-xs bg-black/20 border border-white/10"
      ref={navRef}
    >
      <div className="flex flex-row items-center gap-[68px]">
        <Link href="#" className="text-2xl font-bold text-transparent bg-gradient-to-r from-white to-gray-300 bg-clip-text">
          <Image
            src={'/logo.svg'}
            alt="Logo"
            height={60}
            width={60} 
            className="w-[44px] h-[44px] md:w-[50px] md:h-[50px] lg:w-[56px] lg:h-[56px]"
          />
        </Link>
      </div>
      <div className="hidden lg:block">
      <div ref={linksRef} className="gap-[32px] absolute  lg:relative opacity-0 w-0 overflow-hidden  hidden lg:flex flex-row">
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
      </div>

      <div ref={buttonRef} className="flex gap-[10px] md:gap-[32px] items-center">
        <div className="flex-row md:gap-[8px] items-center hidden md:flex">
          <AnimatedButton text="Contact me" arrow bg="!px-4 !text-xs !h-9 md:!h-11 md:!px-6 md:!text-sm bg-black/70" href="#contact" />
        </div>

        <button
          className="flex lg:hidden cursor-pointer"
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

      <div
        ref={menuRef}
        className="absolute left-0 right-0 top-full opacity-0 backdrop-blur-md bg-black text-white p-6 shadow-lg rounded-[20px] lg:hidden mt-2 border border-white/10"
      >
        <div className="flex justify-end">
          <button onClick={() => setIsMenuOpen(false)} aria-label="Close menu">
            <X className="w-6 h-6 text-white cursor-pointer" />
          </button>
        </div>
        <div className="flex flex-col space-y-4">
          {navlinks.map((link, index) => (
            <Link
              key={index}
              className="lg:text-[16px] h-[26px] font-medium text-gray-200 hover:text-blue-400 transition-all ease-in duration-150"
              href={`#${link.toLowerCase()}`}
              onClick={() => setIsMenuOpen(false)}
            >
              {link}
            </Link>
          ))}
          <Link
            className="lg:text-[16px] h-[26px] font-medium text-gray-200 hover:text-blue-400 transition-all ease-in duration-150 md:hidden"
            href="#contact"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>
        </div>
      </div>
    </header>
  );
}