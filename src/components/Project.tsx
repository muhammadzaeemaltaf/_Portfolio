"use client"

import React, { useState, useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Heading from "@/components/Heading"
import { projectsData } from "@/libs/data"
import Image from "next/image"
import StackLogo from "@/components/StackLogo"
import { useMediaQuery } from "@/hooks/use-media-query"

gsap.registerPlugin(ScrollTrigger)

const Project = () => {
  const stacks = Object.keys(projectsData).filter((stack) => projectsData[stack]?.length > 0)

  const stackRefsMap = useRef(
    stacks.reduce((acc: any, stack) => {
      acc[stack] = React.createRef()
      return acc
    }, {}),
  )

  const [activeStack, setActiveStack] = useState(stacks[0] || "")
  const [expandedProject, setExpandedProject] = useState<any>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const rightColumnRef = useRef<HTMLDivElement>(null)
  const expandedCardData = useRef<{
    element: HTMLElement | null
    placeholder: HTMLElement | null
    initialRect: DOMRect | null
  }>({ element: null, placeholder: null, initialRect: null })

  const isMobile = useMediaQuery("(max-width: 768px)")
  
  // Added state to track the visibility of the section for mobile
  const [sectionInView, setSectionInView] = useState(false)

  // Observe section visibility on mobile
  useEffect(() => {
    if (!sectionRef.current || !isMobile) return
    const observer = new IntersectionObserver(
      (entries) => {
        setSectionInView(entries[0].isIntersecting)
      },
      { threshold: 0.1 }
    )
    observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [isMobile])

  useEffect(() => {
    if (!sectionRef.current) return

    let observer: IntersectionObserver
    const currentStackRefs = stackRefsMap.current

    const visibilityMap = new Map<string, number>()

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        const stack = entry.target.getAttribute("data-stack") || ""
        visibilityMap.set(stack, entry.intersectionRatio)
      })

      let maxVisibility = -1
      let mostVisibleStack = activeStack

      visibilityMap.forEach((ratio, stack) => {
        if (ratio > maxVisibility) {
          maxVisibility = ratio
          mostVisibleStack = stack
        }
      })

      if (mostVisibleStack && mostVisibleStack !== activeStack) {
        setActiveStack(mostVisibleStack)
      }
    }

    observer = new IntersectionObserver(handleIntersection, {
      root: null,
      threshold: Array.from({ length: 20 }, (_, i) => i * 0.05),
      rootMargin: "-20% 0px -20% 0px",
    })

    stacks.forEach((stack) => {
      const element = currentStackRefs[stack]?.current
      if (element) observer.observe(element)
    })

    return () => {
      observer.disconnect()
      visibilityMap.clear()
    }
  }, [stacks, activeStack])

  useEffect(() => {
    stacks.forEach((stack) => {
      if (!stackRefsMap.current[stack]) {
        stackRefsMap.current[stack] = React.createRef()
      }
    })
  }, [stacks])

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
      })
    }
  }, [])

  useEffect(() => {
    if (!rightColumnRef.current || !sectionRef.current) return

    // Only apply pin on desktop
    if (!isMobile) {
      const pinTrigger = ScrollTrigger.create({
        trigger: rightColumnRef.current,
        start: "top 100px",
        endTrigger: sectionRef.current,
        end: "bottom bottom",
        pin: true,
        pinSpacing: false,
      })

      return () => {
        pinTrigger.kill()
      }
    }
  }, [isMobile])

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

    gsap.to(cardEl, {
      top: "50%",
      left: "50%",
      xPercent: -50,
      yPercent: -50,
      height: "80vh",
      width: isMobile ? "90vw" : undefined,
      duration: 0.5,
      onComplete: () => setExpandedProject(project),
    })
  }

  const handleOverlayClick = () => {
    const { element, placeholder, initialRect } = expandedCardData.current
    if (!element || !placeholder || !initialRect) return

    gsap.to(element, {
      top: initialRect.top,
      left: window.innerWidth < 767 ? '50%': '30% ',
      width: initialRect.width,
      height: initialRect.height,
      duration: 0.5,
      onComplete: () => {
        // Clean up
        gsap.set(element, { clearProps: "all" })
        placeholder.remove()
        setExpandedProject(null)
        expandedCardData.current = { element: null, placeholder: null, initialRect: null }
      },
    })
  }

  const scrollToStack = (stack: string) => {
    const element = stackRefsMap.current[stack]?.current
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <section ref={sectionRef} className="min-h-screen pb-20 relative px-4 md:px-10">
      <Heading heading="Projects" />

      {/* Render overlay when a project is expanded */}
      {expandedProject && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 cursor-pointer" onClick={handleOverlayClick} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-[65%_auto] gap-4 mt-8">
        {/* Left Column: Projects */}
        <div className="project-container relative md:pr-10">
          {stacks.map((stack) => (
            <div
              key={stack}
              ref={stackRefsMap.current[stack]}
              data-stack={stack}
              className="mb-12 px-2 md:px-4"
              id={`stack-${stack}`}
            >
              {projectsData[stack]?.map((project, i) => (
                <div
                  key={`${stack}-${i}`}
                  onClick={(e) => handleCardClick(project, e)}
                  className={`border border-white/20 text-white p-4 m-2 rounded-lg shadow project-card cursor-pointer ${
                    expandedProject?.title === project.title
                      ? "fixed z-[100] grid grid-cols-1 gap-4"
                      : "relative grid grid-cols-[70%_auto] gap-4"
                  }`}
                >
                  {expandedProject?.title === project.title ? (
                    <div className="overflow-y-auto" style={{
                      scrollbarWidth: 'none',
                    }}>
                      {/* Expanded state: image on top full width */}
                      <div>
                        <Image
                          src={project.imageUrl || "/placeholder.svg?height=200&width=200"}
                          alt={project.title}
                          width={800}
                          height={400}
                          className="w-full h-auto rounded object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg mt-4">{project.title}</h3>
                        <p className="mt-2">{project.description}</p>
                        <div className="mt-4">
                          <p className="text-sm">Tags: {project.tags.join(", ")}</p>
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 underline text-sm mt-2 inline-block"
                          >
                            Visit Project
                          </a>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <h3 className="font-bold">{project.title}</h3>
                        <p className="line-clamp-3">{project.description}</p>
                        <button className="border mt-4 px-4 py-2 rounded-2xl cursor-pointer">Overview</button>
                      </div>
                      <div className="flex items-center justify-center">
                        <Image
                          src={project.imageUrl || "/placeholder.svg?height=200&width=200"}
                          alt={project.title}
                          width={200}
                          height={200}
                          className="rounded object-center w-full h-auto max-h-[150px] object-cover"
                        />
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Right Column: Active Stack Logo */}
        <div
          ref={rightColumnRef}
          className="hidden md:flex flex-col justify-center items-center h-[calc(100vh-200px)] md:h-[300px] sticky top-[100px]"
        >
          <div className="w-[70%] h-[70%] mb-4">{activeStack && <StackLogo stack={activeStack} />}</div>
        </div>

        {/* Mobile Stack Logo (fixed at top) */}
        {isMobile && activeStack && sectionInView && (
          <div className="fixed top-4 right-4 z-10 w-16 h-16 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center">
            <div className="w-12 h-12">
              <StackLogo stack={activeStack} />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default Project

