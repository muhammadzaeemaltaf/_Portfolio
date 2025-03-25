"use client";

import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Heading from "@/components/Heading";
import { projectsData } from "@/libs/data";
import Image from "next/image";
import StackLogo from "@/components/StackLogo";
import { useMediaQuery } from "@/hooks/use-media-query";
import { AnimatedButton } from "./AnimateButton";
import { X } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const Project = () => {
  const stacks = Object.keys(projectsData).filter(
    (stack) => projectsData[stack]?.length > 0
  );

  const stackRefsMap = useRef(
    stacks.reduce((acc: any, stack) => {
      acc[stack] = React.createRef();
      return acc;
    }, {})
  );

  const [activeStack, setActiveStack] = useState(stacks[0] || "");
  const [expandedProject, setExpandedProject] = useState<any>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const rightColumnRef = useRef<HTMLDivElement>(null);
  const expandedCardData = useRef<{
    element: HTMLElement | null;
    placeholder: HTMLElement | null;
    initialRect: DOMRect | null;
  }>({ element: null, placeholder: null, initialRect: null });

  const isMobile = useMediaQuery("(max-width: 767px)");

  // Added state to track the visibility of the section for mobile
  const [sectionInView, setSectionInView] = useState(false);

  // Observe section visibility on mobile
  useEffect(() => {
    if (!sectionRef.current || !isMobile) return;
    const observer = new IntersectionObserver(
      (entries) => {
        setSectionInView(entries[0].isIntersecting);
      },
      { threshold: 0.1 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [isMobile]);

  useEffect(() => {
    if (!sectionRef.current) return;

    let observer: IntersectionObserver;
    const currentStackRefs = stackRefsMap.current;

    const visibilityMap = new Map<string, number>();

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        const stack = entry.target.getAttribute("data-stack") || "";
        visibilityMap.set(stack, entry.intersectionRatio);
      });

      let maxVisibility = -1;
      let mostVisibleStack = activeStack;

      visibilityMap.forEach((ratio, stack) => {
        if (ratio > maxVisibility) {
          maxVisibility = ratio;
          mostVisibleStack = stack;
        }
      });

      if (mostVisibleStack && mostVisibleStack !== activeStack) {
        setActiveStack(mostVisibleStack);
      }
    };

    observer = new IntersectionObserver(handleIntersection, {
      root: null,
      threshold: Array.from({ length: 20 }, (_, i) => i * 0.05),
      rootMargin: "-20% 0px -20% 0px",
    });

    stacks.forEach((stack) => {
      const element = currentStackRefs[stack]?.current;
      if (element) observer.observe(element);
    });

    return () => {
      observer.disconnect();
      visibilityMap.clear();
    };
  }, [stacks, activeStack]);

  useEffect(() => {
    stacks.forEach((stack) => {
      if (!stackRefsMap.current[stack]) {
        stackRefsMap.current[stack] = React.createRef();
      }
    });
  }, [stacks]);

  useEffect(() => {
    if (sectionRef.current) {
      gsap.from(".project-card", {
        scrollTrigger: {
          trigger: ".project-card",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        y: 50,
        duration: 0.5,
        stagger: 0.2,
      });
    }
  }, []);

  useEffect(() => {
    if (!rightColumnRef.current || !sectionRef.current) return;

    // Only apply pin on desktop
    if (!isMobile) {
      const pinTrigger = ScrollTrigger.create({
        trigger: rightColumnRef.current,
        start: "top 100px",
        endTrigger: sectionRef.current,
        end: "bottom bottom",
        pin: true,
        pinSpacing: false,
      });

      return () => {
        pinTrigger.kill();
      };
    }
  }, [isMobile]);

  const handleCardClick = (
    project: any,
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    const cardEl = e.currentTarget;
    const rect = cardEl.getBoundingClientRect();

    // Create placeholder
    const placeholder = document.createElement("div");
    placeholder.style.width = `${rect.width}px`;
    placeholder.style.height = `${rect.height}px`;
    placeholder.style.margin = window.getComputedStyle(cardEl).margin;
    placeholder.classList.add("invisible");
    cardEl.parentNode?.insertBefore(placeholder, cardEl);

    // Store references
    expandedCardData.current = {
      element: cardEl,
      placeholder,
      initialRect: rect,
    };

    // Animate card
    gsap.set(cardEl, {
      position: "fixed",
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      backgroundColor: "black",
      zIndex: 100,
    });

    gsap.to(cardEl.querySelector("img"), {
      width: "100%",
      height: "100%",
      borderRadius: 0,
      duration: 0.5,
    });

    gsap.to(cardEl.querySelector(".text"), {
      position: "relative",
      top: "auto",
      width: "auto",
      marginTop: "56px",
      padding: "1rem",
    });

    gsap.to(cardEl.querySelector(".text h3"), {
      fontSize: "2.5rem",
      marginBottom: "1rem",
    });

    gsap.to(cardEl, {
      top: "50%",
      left: "50%",
      xPercent: -50,
      yPercent: -50,
      height: isMobile ? "100dvh" : "80vh",
      width: isMobile ? "100vw" : undefined,
      padding: 0,
      duration: 0.5,
      onComplete: () => setExpandedProject(project),
    });

    gsap.to(cardEl.querySelector(".text .tags"), {
      position: "relative",
      opacity: 1,
      duration: 0.5,
      delay: 0.5,
      stagger: 0.1,
      marginBottom: "2.5rem",
      y: 10,
    });

    gsap.to('.overlay', {
      opacity: 1,
      pointerEvents: 'auto',
      duration: 0.5
    })
  };

  const handleOverlayClick = () => {
    const { element, placeholder, initialRect } = expandedCardData.current;
    if (!element || !placeholder || !initialRect) return;

    gsap.to(element, {
      top: window.innerWidth < 767 ? initialRect.top + 170 : initialRect.top + 78,
      left: window.innerWidth < 767 ? "50%" : "32% ",
      width: initialRect.width,
      height: initialRect.height,
      padding: "1rem",
      duration: 0.5,
      onComplete: () => {
        // Clean up
        gsap.set(element, { clearProps: "all" });
        placeholder.remove();
        setExpandedProject(null);
        expandedCardData.current = {
          element: null,
          placeholder: null,
          initialRect: null,
        };
      },
    });
    gsap.to(element.querySelector("img"), {
      position: "relative",
      top: "auto",
      left: "auto",
      borderRadius: "4px",
      width: isMobile ? "" : "200px",
    });
    gsap.to(element.querySelector(".text"), {
      position: isMobile ? "" : "absolute",
      top: "16px",
      width: isMobile ? "" : "60%",
      marginTop: "0",
      padding: 0,
      duration: 0.5,
    });

    gsap.to(element.querySelector(".text h3"), {
      fontSize: "1rem",
      marginBottom: "0",
    })

    gsap.to(element.querySelector(".text .tags"), {
      position: "absolute",
      opacity: 0,
      marginBottom: "0",
      y: 0,
    });

    gsap.to('.overlay', {
      opacity: 0,
      pointerEvents: 'none',
      duration: 0.5
    })
  }


  return (
    <section
      ref={sectionRef}
      className="min-h-screen pb-20 relative px-4 md:px-10 max-w-[1400px] mx-auto"
    >
      <Heading heading="Personal Projects" />

      <p className="mt-4 text-center max-w-2xl mx-auto">Engaged in self-initiated projects to explore new technologies and methodologies, resulting in a diverse portfolio that demonstrates my commitment to continuous learning and professional growth.</p>

      {/* Render overlay when a project is expanded */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 cursor-pointer pointer-events-none opacity-0 overlay"

        onClick={handleOverlayClick}
      />


      <div className="grid grid-cols-1 lg:grid-cols-[65%_auto] gap-4 mt-8">
        {/* Left Column: Projects */}
        <div className="project-container relative lg:pr-10 grid  gap-4 md:grid-cols-1 ">
          {stacks.map((stack) => (
            <div
              key={stack}
              ref={stackRefsMap.current[stack]}
              data-stack={stack}
              className="mb-12 md:px-4 space-y-3"
              id={`stack-${stack}`}
            >
              {projectsData[stack]?.map((project, i) => (
                <div
                  key={`${stack}-${i}`}
                  onClick={(e) => {
                    if (expandedProject?.title !== project.title) {
                      handleCardClick(project, e); // Expand if not expanded
                    }
                  }}
                  className={`relative md:h-[160px] border border-white/20 text-white p-4  rounded-lg shadow project-card cursor-pointer ${expandedProject?.title === project.title
                      ? "overflow-y-auto"
                      : ""
                    }`}
                >
                  {expandedProject === project && (
                    <AnimatedButton
                      text={<X className="h-3 w-3" />}
                      bg={`!absolute right-2 top-2 !p-2 !h-7 z-[100] bg-black md:!hidden ${expandedProject?.title === project.title
                          ? "!opacity-100"
                          : "!opacity-0"
                        }`}
                      onClick={handleOverlayClick}
                    />
                  )}
                  <div className="flex items-center justify-end">
                    <Image
                      src={
                        project.imageUrl ||
                        "/placeholder.svg?height=200&width=200"
                      }
                      alt={project.title}
                      width={1000}
                      height={1000}
                      className="rounded object-center aspect-video  md:w-[200px] object-cover relative"
                    />
                  </div>
                  <div className="text relative md:absolute top-4 md:w-[60%] md:pr-10 mb-4">
                    <h3 className="font-bold">{project.title}</h3>
                    <p className="line-clamp-2 mb-4">{project.description}</p>
                    <div className="tags flex justify-start items-center gap-2"
                      style={{
                        opacity: 0,
                        position: "absolute",
                      }}
                    >
                      {project.tags.map((Tag, i) => (
                        <span
                          key={i}
                          className="text-xs p-1 rounded mr-1"
                        >
                          <Tag className="h-8 w-8" />
                        </span>
                      ))}
                    </div>
                    <AnimatedButton
                      text={
                        expandedProject?.title === project.title
                          ? "View Project"
                          : "Overview"
                      }
                      arrow={expandedProject?.title === project.title}
                      href={
                        expandedProject?.title === project.title
                          ? project.link
                          : ""
                      }
                      expanded={expandedProject?.title === project.title}
                      onClick={
                        expandedProject?.title !== project.title
                          ? (e) => {
                            e.stopPropagation();
                            const card = (e.currentTarget as HTMLElement).closest('.project-card');
                            if (card) {
                              handleCardClick(project, { ...e, currentTarget: card } as React.MouseEvent<HTMLDivElement, MouseEvent>);
                            }
                          }
                          : undefined
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Right Column: Active Stack Logo */}
        <div
          ref={rightColumnRef}
          className="hidden lg:flex flex-col justify-center items-center h-[calc(100vh-200px)] md:h-[300px] sticky top-[60px]"
        >
          <div className="w-[60%] h-[60%] mb-4">
            {activeStack && <StackLogo stack={activeStack} />}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Project;
