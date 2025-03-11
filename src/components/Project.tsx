"use client"

import React, { useState, useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Heading from "@/components/Heading"
import { projectsData } from "@/libs/data"
import Image from "next/image"
import StackLogo from "@/components/StackLogo" // Adjust the import path as needed

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
  const sectionRef = useRef(null)
  const rightColumnRef = useRef(null)

  // IntersectionObserver to update activeStack
  useEffect(() => {
    if (!sectionRef.current) return

    let observer: IntersectionObserver
    const currentStackRefs = stackRefsMap.current

    // Track intersection ratios to find most visible section
    const visibilityMap = new Map<string, number>()

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        const stack = entry.target.getAttribute("data-stack") || ""
        visibilityMap.set(stack, entry.intersectionRatio)
      })

      // Find stack with highest visibility
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
      root: null, // Use viewport as root
      threshold: Array.from({ length: 20 }, (_, i) => i * 0.05), // Multiple thresholds
      rootMargin: "-20% 0px -20% 0px", // Center-oriented detection
    })

    // Observe all stack sections
    stacks.forEach((stack) => {
      const element = currentStackRefs[stack]?.current
      if (element) observer.observe(element)
    })

    return () => {
      observer.disconnect()
      visibilityMap.clear()
    }
  }, [stacks, activeStack]) // Add activeStack to dependencies

  // Animate project cards on scroll
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

  // Pin the right column while scrolling
  useEffect(() => {
    if (!rightColumnRef.current || !sectionRef.current) return

    // Removed global kill call that was disabling other ScrollTriggers
    const pinTrigger = ScrollTrigger.create({
      trigger: rightColumnRef.current,
      start: "top 100px", // Start pinning when the element is 100px from the top
      endTrigger: sectionRef.current,
      end: "bottom bottom", // End pinning at the bottom of the section
      pin: true,
      pinSpacing: false,
    })

    return () => {
      pinTrigger.kill()
    }
  }, [])

  // Function to scroll to a specific stack section
  const scrollToStack = (stack: string) => {
    const element = stackRefsMap.current[stack]?.current
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <section ref={sectionRef} className="min-h-screen pb-20 relative">
      <Heading heading="Projects" />

      {/* Optional: Stack navigation buttons */}
      <div className="flex flex-wrap gap-2 mb-4 px-4 sticky top-10 bg-black/80 py-2 z-10 backdrop-blur-sm">
        {stacks.map((stack) => (
          <button
            key={`nav-${stack}`}
            onClick={() => scrollToStack(stack)}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              activeStack === stack ? "bg-white text-black" : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            {stack}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[65%_auto] gap-4">
        {/* Left Column: Projects */}
        <div className="relative project-container">
          {stacks.map((stack) => (
            <div
              key={stack}
              ref={stackRefsMap.current[stack]}
              data-stack={stack}
              className="mb-12 px-4"
              id={`stack-${stack}`}
            >
              {projectsData[stack]?.map((project, i) => (
                <div
                  key={`${stack}-${i}`}
                  className="border border-white/20 text-white p-4 m-2 rounded-lg shadow project-card grid grid-cols-1 md:grid-cols-[70%_auto] gap-4"
                >
                  <div>
                    <h3 className="font-bold">{project.title}</h3>
                    <p>{project.description}</p>
                  </div>
                  <div>
                    <Image
                      src={project.imageUrl || "/placeholder.svg?height=200&width=200"}
                      alt={project.title}
                      width={200}
                      height={200}
                      className="rounded object-center w-full h-auto"
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
          className="flex flex-col justify-center items-center h-[calc(100vh-200px)] md:h-[300px]"
        >
          <div className="w-[70%] h-[70%] mb-4">{activeStack && <StackLogo stack={activeStack} />}</div>
        </div>
      </div>
    </section>
  )
}

export default Project