"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import GridBackground from "./bg";
import { Typewriter } from "react-simple-typewriter";
import { AnimatedButton } from "./AnimateButton";
import { HiDownload } from "react-icons/hi";
import { scrollToView } from "@/libs/data";
import { BsGithub } from "react-icons/bs";
import { FiGithub } from "react-icons/fi";
import { FaLinkedin } from "react-icons/fa6";

const data = [
  "Full-Stack Developer",
  "Jam-Stack Developer",
  "Frontend Developer",
  "Next.js Developer",
  "PHP/Laravel Developer",
];

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
    <section className="relative isolate flex min-h-[85vh] md:min-h-screen max-w-[100vw] items-center overflow-x-hidden py-16 px-4">
      {/* Background effects */}
      <div className="flex justify-between w-full absolute top-0 left-0  z-[-1] h-[70vh]">
        {/* Left Blur with Reflection */}
        <div
          className="absolute left-[20%] top-1/2 z-[-1] h-[55vh] md:h-[80vh] w-20 -translate-x-1/2 -translate-y-1/2 -rotate-50 bg-blue-700 blur-[180px] 
        after:absolute after:left-1/2 after:top-0 after:h-full after:w-[2px] after:bg-gradient-to-b after:from-white/60 after:to-transparent"
        ></div>

        {/* Right Blur with Reflection */}
        <div
          className="absolute right-[15%] top-1/2 z-[-1] h-[55vh] md:h-[80vh] w-20 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-blue-700 blur-[180px] 
        after:absolute after:left-1/2 after:top-0 after:h-full after:w-[2px] after:bg-gradient-to-b after:from-white/60 after:to-transparent"
        ></div>
      </div>

      <div className="pointer-events-none absolute left-0 top-0 h-full w-full opacity-50  [mask-image:linear-gradient(to_bottom,white_1%,transparent_80%)]">
        <GridBackground />
      </div>
      {/* Masked Background */}
      <div
        ref={maskRef}
        className="absolute w-full h-full top-0 left-0 pointer-events-none opacity-3 transition-all duration-500"
        style={{
          backgroundImage: "url(/background-01.svg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          WebkitMaskImage:
            "radial-gradient(0px at 0px 0px, black, transparent)",
        }}
      ></div>

      <div className="container relative isolate mx-auto">
        <div className="relative pb-8 pt-12 sm:py-14 md:py-16">
          {/* Main heading */}
          <div className="relative isolate">
            <h1 className="__h1 mt-5 text-balance text-center tracking-wide md:mt-8 lg:mt-10 [&_*]:inline-block [&_*]:bg-clip-text [&_*]:text-transparent [&_span]:[background-image:-webkit-linear-gradient(90deg,#ececec_0%,#aaaaaa_33%,#e0e0e0_67%)] [&_strong]:font-medium [&_strong]:[background-image:-webkit-linear-gradient(45deg,#2563eb_6%,#1e40af_19%,#2563eb_100%)]">
              <span>Full-Stack</span> <span>Development</span> {" "}
              <br className="sm:!hidden" />
              <span>Services</span>{" "}
              <strong>For Seamless</strong>
              {" "}
              <br className="sm:!hidden" />
              <strong>Web</strong>{" "}
              <strong>Experience</strong>
            </h1>
          </div>

          {/* Subtitle */}
          <code className="relative mx-auto mt-4 max-w-[800px] text-center text-muted xs:mt-6 sm:mt-7 sm:text-lg md:mt-8 md:text-xl block">
            Hi! I am Muhammad Zaeem Altaf.{" "}
            <br className="md:hidden" />
            <Typewriter
              words={data}
              loop={0}
              typeSpeed={100}
              deleteSpeed={100}
              delaySpeed={1000}
            />{" "}
            <span className="inline-block w-0.5 h-6 ml-1 -mb-1 bg-blue-500 animate-pulse"></span>
          </code>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mt-10">
            <AnimatedButton text="Contact me here" arrow bg="!px-6 !text-sm !h-11 md:!px-8 md:!py-6 md:!text-lg bg-black/70"
              onClick={() => {
                scrollToView("contact");
              }
              }
            />
            <AnimatedButton text="Downlaod CV" icon={
              <HiDownload className="text-xl md:text-2xl opacity-70 transition-all  group-hover:translate-y-1" />
            } bg="group !px-6 !text-sm !h-11 md:!px-8 md:!py-6 md:!text-lg bg-black/70" href={'/MUHAMMAD ZAEEM ALTAF.pdf'} />
            <div className="flex gap-4">
              <AnimatedButton
                text={<FiGithub className="h-4 w-4" />}
                bg={`group !p-0 !w-11 !h-11 z-[100] bg-black !rounded-xl`}
                href="https://github.com/muhammadzaeemaltaf/"
                target="_blank"
              />
              <AnimatedButton
                text={<FaLinkedin className="h-4 w-4" />}
                bg={`group !p-0 !w-11 !h-11 z-[100] bg-black !rounded-xl`}
                href="https://www.linkedin.com/in/muhammadzaeemaltaf/"
                target="_blank"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
