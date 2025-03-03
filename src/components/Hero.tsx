"use client"

import { useEffect, useRef } from "react";
import gsap from "gsap";
import GridBackground from "./bg";

const HeroSection = () => {

  const maskRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      gsap.to(maskRef.current, {
        webkitMaskImage: `radial-gradient(300px at ${x}px ${y}px, black, transparent)`,
        maskImage: `radial-gradient(300px at ${x}px ${y}px, black, transparent)`,
        duration: 0.5,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(maskRef.current, {
        webkitMaskImage: "radial-gradient(0px at 0px 0px, black, transparent)",
        maskImage: "radial-gradient(0px at 0px 0px, black, transparent)",
        duration: 0.5,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);
  return (
    <section className="relative isolate flex min-h-screen max-w-[100vw] items-center overflow-x-hidden py-16">
      {/* Background effects */}
      <div className="flex justify-between w-full absolute top-0 z-[-1] h-[70vh]">
        {/* Left Blur with Reflection */}
        <div className="absolute left-[20%] top-1/2 z-[-1] h-[80vh] w-20 -translate-x-1/2 -translate-y-1/2 -rotate-50 bg-blue-700 blur-[180px] 
        after:absolute after:left-1/2 after:top-0 after:h-full after:w-[2px] after:bg-gradient-to-b after:from-white/60 after:to-transparent"></div>

        {/* Right Blur with Reflection */}
        <div className="absolute right-[15%] top-1/2 z-[-1] h-[80vh] w-20 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-blue-700 blur-[180px] 
        after:absolute after:left-1/2 after:top-0 after:h-full after:w-[2px] after:bg-gradient-to-b after:from-white/60 after:to-transparent"></div>
      </div>
    
      <div
        className="pointer-events-none absolute left-0 top-0 h-screen w-full opacity-50  [mask-image:linear-gradient(to_bottom,white_1%,transparent_80%)]"
      >
        <GridBackground />
      </div>
    {/* Masked Background */}
    <div
        ref={maskRef}
        className="absolute w-full h-full top-0 left-0 pointer-events-none opacity-10 transition-all duration-500"
        style={{
          backgroundImage: "url(/bg.svg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          WebkitMaskImage: "radial-gradient(0px at 0px 0px, black, transparent)",
        }}
      ></div>

      <div className="container relative isolate mx-auto">
        <div className="relative pb-8 pt-12 sm:py-14 md:py-16">
          {/* Main heading */}
          <div className="relative isolate">
            <h1 className="__h1 mt-5 text-balance text-center tracking-wide md:mt-8 lg:mt-10 [&_*]:inline-block [&_*]:bg-clip-text [&_*]:text-transparent [&_span]:[background-image:-webkit-linear-gradient(90deg,#ececec_0%,#aaaaaa_33%,#e0e0e0_67%)] [&_strong]:font-medium [&_strong]:[background-image:-webkit-linear-gradient(45deg,#2563eb_6%,#1e40af_19%,#2563eb_100%)]">
              <span>Elevate</span> <span>Your</span> <span>Brand</span>{" "}
              <strong>With A</strong> <strong>Dynamic Web</strong>{" "}
              <strong>Experience</strong>
            </h1>
          </div>

          {/* Subtitle */}
          <p className="relative mx-auto mt-4 max-w-[800px] text-center text-muted xs:mt-6 sm:mt-7 sm:text-lg md:mt-8 md:text-xl">
            Hi I am Muhammad Zaeem Altaf. A full stack web developer with a passion for creating beautiful and functional websites.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
