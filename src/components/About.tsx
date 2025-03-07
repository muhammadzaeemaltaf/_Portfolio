"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Heading from "./Heading";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);
  const imageRef = useRef<SVGImageElement>(null);
  const firstParaRef = useRef<HTMLParagraphElement>(null);
  const secondParaRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (
      !containerRef.current ||
      !circleRef.current ||
      !firstParaRef.current ||
      !secondParaRef.current
    )
      return;

    const splitTextIntoWords = (element: HTMLElement) => {
      const text = element.textContent || "";
      const words = text.split(" ").map((word) => {
        const span = document.createElement("span");
        span.className = "word";
        span.textContent = word + " ";
        return span;
      });
      element.innerHTML = "";
      words.forEach((word) => element.appendChild(word));
      return words;
    };

    const firstParaWords = splitTextIntoWords(firstParaRef.current);
    const secondParaWords = splitTextIntoWords(secondParaRef.current);

    const allWords = [...firstParaWords, ...secondParaWords];

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top center",
        end: "center 80%",
        scrub: 2,
        // markers: true,
      },
    });

    tl.to(
      circleRef.current,
      {
        attr: { r: 47 },
        duration: 0.3,
        ease: "power1.inOut",
      },
      0
    );

    tl.fromTo(
      imageRef.current,
      {
        filter: "brightness(0%)",
        duration: 4,
        ease: "slow(0.7,0.7,false)",
      },
      {
        filter: "brightness(75%)",
        duration: 0.4,
        ease: "slow(0.7,0.7,false)",
        transformOrigin: "center center",
      },
      0.1
    );

    gsap.from(allWords, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 30%",
        end: "center center",
        scrub: 0.1,
        
        // markers: true,
      },
      opacity: 0,
      y: 20,
      stagger: 0.005,
      duration: 0.1,
      ease: "power1.out",
    });
  }, []);

  return (
    <section className="relative w-full max-w-7xl mx-auto py-16 md:py-24 px-4 bg-black">
      <Heading heading="About Me" />

      <div
        ref={containerRef}
        className="flex flex-col md:flex-row items-center gap-8 md:gap-16 pt-20"
      >
        <div className="w-full md:w-1/2 relative">
          <svg
            className="content__img w-full max-w-2xl mx-auto"
            viewBox="0 0 100 100"
          >
            <defs>
              <filter id="displacementFilter1">
                <feTurbulence
                  type="fractalNoise"
                  baseFrequency="0.03"
                  numOctaves="2"
                  result="noise"
                />
                <feDisplacementMap
                  in="SourceGraphic"
                  in2="noise"
                  scale="40"
                  xChannelSelector="R"
                  yChannelSelector="G"
                />
              </filter>
              <mask id="circleMask1">
                <circle
                  ref={circleRef}
                  cx="50%"
                  cy="50%"
                  r="0"
                  data-value-final="47"
                  fill="white"
                  className="mask"
                  style={{ filter: "url(#displacementFilter1)" }}
                />
              </mask>
            </defs>
            <image
              ref={imageRef}
              xlinkHref="/profile-pic.png"
              width="100%"
              height="100%"
              mask="url(#circleMask1)"
              preserveAspectRatio="xMidYMid slice"
              style={{ transformOrigin: "center center" }}
            />
          </svg>
        </div>

        <div className="left-right__step-inner w-full md:w-1/2 md:pl-8">
          <div className="text-[16px] text-center md:text-xl md:text-start leading-relaxed text-gray-400">
            <p ref={firstParaRef} className="mb-5">
              After completing Intermediate with in Pre-Engineering, I pursued
              my passion for web development. at Memon Industrial & Technical
              Institute, where I developed and maintained responsive,
              user-friendly, and visually appealing websites. My favorite part
              of web development is creating intuitive user experiences and
              optimizing website performance. My core stack includes Next.js,
              React.js, Typescript, and Tailwind CSS. I also work with HTML,
              CSS, JavaScript, PHP, MySQL, WordPress, Bootstrap, AJAX, Framer
              Motion, and GSAP.
            </p>

            <p ref={secondParaRef}>
              {/* I'm passionate, about exploring new technologies, especially in AI. I am currently working towards a
              certification in Cloud Applied Generative AI Engineering. Currently, I am pursuing a Bachelor's degree in
              Computer Science from Virtual University (VU). I also have a keen interest in open-source projects and
              enjoy contributing to the tech community. */}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
