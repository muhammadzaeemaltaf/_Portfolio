"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Heading from "@/components/Heading"
import { projectsData } from "@/libs/data"
import Image from "next/image"
import StackLogo from "@/components/StackLogo"
import { useMediaQuery } from "@/hooks/use-media-query"
import { AnimatedButton } from "./AnimateButton"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

const TopProject = () => {
  const stacks = Object.keys(projectsData).filter((stack) => projectsData[stack]?.length > 0)

  // Create a flat array of all projects with their stack information
  const allProjects = stacks.flatMap((stack) => projectsData[stack]?.map((project) => ({ ...project, stack })) || [])

  const [currentProjectIndex, setCurrentProjectIndex] = useState(0)
  const [expandedProject, setExpandedProject] = useState<any>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const rightColumnRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const expandedCardData = useRef<{
    element: HTMLElement | null
    placeholder: HTMLElement | null
    initialRect: DOMRect | null
  }>({ element: null, placeholder: null, initialRect: null })

  const isMobile = useMediaQuery("(max-width: 767px)")
  const isLarge = useMediaQuery("(max-width: 1536px)")

  // Get current project and stack
  const currentProject = allProjects[currentProjectIndex]
  const activeStack = currentProject?.stack || stacks[0]

  // Navigation functions
  const goToNextProject = () => {
    gsap.to(cardRef.current, {
      x: -50,
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        setCurrentProjectIndex((prev) => (prev + 1) % allProjects.length)
        gsap.fromTo(cardRef.current, { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.3 })
      },
    })
  }

  const goToPrevProject = () => {
    gsap.to(cardRef.current, {
      x: 50,
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        setCurrentProjectIndex((prev) => (prev - 1 + allProjects.length) % allProjects.length)
        gsap.fromTo(cardRef.current, { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.3 })
      },
    })
  }

  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill()) // Clean up all ScrollTrigger instances
    }
  }, [])

  const handleCardClick = (project: any, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const cardEl = e.currentTarget
    const rect = cardEl.getBoundingClientRect()

    // Create placeholder
    const placeholder = document.createElement("div")
    placeholder.style.width = `${rect.width}px`
    placeholder.style.height = `${rect.height}px`
    placeholder.style.margin = window.getComputedStyle(cardEl).margin
    placeholder.classList.add("invisible")
    cardEl.parentNode?.insertBefore(placeholder, cardEl)

    // Store references
    expandedCardData.current = {
      element: cardEl,
      placeholder,
      initialRect: rect,
    }

    // Animate card
    gsap.set(cardEl, {
      position: "fixed",
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      backgroundColor: "black",
      zIndex: 100,
    })

    gsap.to(cardEl.querySelector("img"), {
      width: "100%",
      height: "100%",
      borderRadius: 0,
      duration: 0.5,
    })

    gsap.to(cardEl.querySelector(".text"), {
      position: "relative",
      top: "auto",
      width: "auto",
      marginTop: "56px",
      padding: "1rem",
    })

    gsap.to(cardEl.querySelector(".text h3"), {
      fontSize: "2.5rem",
      marginBottom: "1rem",
    })

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
    })

    gsap.to(cardEl.querySelector(".text .tags"), {
      position: "relative",
      opacity: 1,
      duration: 0.5,
      delay: 0.5,
      stagger: 0.1,
      marginBottom: "2.5rem",
      y: 10,
    })

    gsap.to(".overlay", {
      opacity: 1,
      pointerEvents: "auto",
      duration: 0.5,
    })
  }

  const handleOverlayClick = () => {
    const { element, placeholder, initialRect } = expandedCardData.current
    if (!element || !placeholder || !initialRect) return

    gsap.to(element, {
      top: window.innerWidth < 767 ? initialRect.top + 170 : initialRect.top + 78,
      left: window.innerWidth < 767 ? "50%" : "32% ",
      width: initialRect.width,
      height: initialRect.height,
      padding: "1rem",
      duration: 0.5,
      onComplete: () => {
        // Clean up
        gsap.set(element, { clearProps: "all" })
        placeholder.remove()
        setExpandedProject(null)
        expandedCardData.current = {
          element: null,
          placeholder: null,
          initialRect: null,
        }
      },
    })
    gsap.to(element.querySelector("img"), {
      position: "relative",
      top: "auto",
      left: "auto",
      borderRadius: "4px",
      width: window.innerWidth >= 1536 ? "300px" : isMobile ? "" : "250px",
    })
    gsap.to(element.querySelector(".text"), {
      position: isMobile ? "" : "absolute",
      top: "16px",
      width: isMobile ? "" : "60%",
      marginTop: "0",
      padding: 0,
      duration: 0.5,
    })

    gsap.to(element.querySelector(".text h3"), {
      fontSize: window.innerWidth >= 1536 ? "24px" : "1rem",
      marginBottom: "0",
    })

    gsap.to(element.querySelector(".text .tags"), {
      position: "absolute",
      opacity: 0,
      marginBottom: "0",
      y: 0,
    })

    gsap.to(".overlay", {
      opacity: 0,
      pointerEvents: "none",
      duration: 0.5,
    })
  }

  return (
    <section ref={sectionRef} className="min-h-screen mb-20 relative px-4 md:px-10 max-w-[1700px] w-full mx-auto">
      <Heading heading="Top Projects" />

      {/* Render overlay when a project is expanded */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 cursor-pointer pointer-events-none opacity-0 overlay"
        onClick={handleOverlayClick}
      />

      <div className="grid grid-cols-1 lg:grid-cols-[65%_auto] gap-4 mt-8">
        {/* Left Column: Projects */}
        <div className="project-container relative lg:pr-10 flex flex-col gap-4">
          {/* Navigation buttons */}
          <div className="flex justify-between items-center w-full absolute top-1/2 -translate-y-1/2 z-10 px-2">
            <button
              onClick={goToPrevProject}
              className="bg-black/50 hover:bg-black/80 text-white p-3 rounded-full transition-all"
              aria-label="Previous project"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={goToNextProject}
              className="bg-black/50 hover:bg-black/80 text-white p-3 rounded-full transition-all"
              aria-label="Next project"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          {/* Current project card */}
          {currentProject && (
            <div
              ref={cardRef}
              onClick={(e) => {
                if (expandedProject?.title !== currentProject.title) {
                  handleCardClick(currentProject, e)
                }
              }}
              className={`relative md:h-[170px] 2xl:h-[200px] border border-white/20 text-white p-4 rounded-lg shadow project-card cursor-pointer ${
                expandedProject?.title === currentProject.title ? "overflow-y-auto" : ""
              }`}
            >
              {expandedProject === currentProject && (
                <AnimatedButton
                  text={<X className="h-3 w-3" />}
                  bg={`!absolute right-2 top-2 !p-2 !h-7 z-[100] bg-black md:!hidden ${
                    expandedProject?.title === currentProject.title ? "!opacity-100" : "!opacity-0"
                  }`}
                  onClick={handleOverlayClick}
                />
              )}
              <div className="flex items-center justify-end">
                <Image
                  src={currentProject.imageUrl || "/placeholder.svg?height=200&width=200"}
                  alt={currentProject.title}
                  width={1000}
                  height={1000}
                  className="rounded object-center aspect-video md:w-[250px] 2xl:w-[300px] object-cover relative"
                />
              </div>
              <div className="text relative md:absolute top-4 md:w-[60%] md:pr-10 mb-4">
                <h3 className="font-bold 2xl:text-2xl mb-3">{currentProject.title}</h3>
                <p className="line-clamp-2 mb-4 2xl:text-[18px]">{currentProject.description}</p>
                <div
                  className="tags flex justify-start items-center gap-2"
                  style={{
                    opacity: 0,
                    position: "absolute",
                  }}
                >
                  {currentProject.tags.map((Tag, i) => (
                    <span key={i} className="text-xs p-1 rounded mr-1">
                      <Tag className="h-8 w-8" />
                    </span>
                  ))}
                </div>
                <AnimatedButton
                  text={expandedProject?.title === currentProject.title ? "View Project" : "Overview"}
                  arrow={expandedProject?.title === currentProject.title}
                  href={expandedProject?.title === currentProject.title ? currentProject.link : ""}
                  expanded={expandedProject?.title === currentProject.title}
                  bg="2xl:h-12 2xl:px-7 2xl:text-xl"
                  onClick={
                    expandedProject?.title !== currentProject.title
                      ? (e) => {
                          e.stopPropagation()
                          const card = (e.currentTarget as HTMLElement).closest(".project-card")
                          if (card) {
                            handleCardClick(currentProject, { ...e, currentTarget: card } as React.MouseEvent<
                              HTMLDivElement,
                              MouseEvent
                            >)
                          }
                        }
                      : undefined
                  }
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Active Stack Logo */}
        <div className="relative lg:h-full">
          <div ref={rightColumnRef} className="hidden lg:block w-full">
            <div className="flex flex-col justify-start items-center h-full">
              <div className="w-[180px] h-[180px] min-[1400px]:h-[270px] min-[1400px]:w-[270px] mb-4 relative">
                {/* Only render the active stack logo to ensure animation triggers */}
                <StackLogo stack={activeStack} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TopProject
