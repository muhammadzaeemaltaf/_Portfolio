"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import type { IconType } from "react-icons"
import Heading from "./Heading"
import { educationData } from "@/libs/data"
import { SlCalender } from "react-icons/sl"

gsap.registerPlugin(ScrollTrigger)

export default function Education() {
  const timelineRef = useRef<HTMLDivElement>(null)
  const timelineItemsRef = useRef<(HTMLDivElement | null)[]>([])
  const [activeItem, setActiveItem] = useState<number | null>(null)

  useEffect(() => {
    if (!timelineRef.current) return

    // Main timeline for the vertical line animation
    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: timelineRef.current,
        start: "top 70%",
      },
    })

    // Animate the timeline line
    timeline.fromTo(
      ".education-timeline-line",
      { scaleY: 0, transformOrigin: "top" },
      { scaleY: 1, duration: 1.5, ease: "power3.out" }
    )

    // Animate each timeline item
    timelineItemsRef.current.forEach((item, index) => {
      if (!item) return

      // Select the content box and dot elements
      const contentBox = item.querySelector(".content-box")
      const dot = item.querySelector(".timeline-dot")

      if (!contentBox || !dot) return

      // Determine slide direction: right on mobile, alternating on desktop
      const direction = window.innerWidth < 768 ? 1 : index % 2 === 0 ? 1 : -1

      // Create a timeline for each item triggered on scroll
      const itemTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: item,
          start: "top 80%",
        },
      })

      // Slide in the content box
      itemTimeline.fromTo(
        contentBox,
        {
          opacity: 0,
          x: direction * 50, // Slide from left or right
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
        }
      )

      // Pulse the dot when the content box arrives
      itemTimeline
        .to(
          dot,
          {
            scale: 1.2,
            duration: 0.2,
            ease: "power2.out",
          },
          "-=0.2" 
        )
        .to(dot, {
          scale: 1,
          duration: 0.2,
          ease: "power2.in",
        })
    })

    // Cleanup ScrollTriggers on unmount
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  // Micro-animation for hover/focus
  const handleItemFocus = (index: number) => {
    setActiveItem(index)
    if (timelineItemsRef.current[index]) {
      const dot = timelineItemsRef.current[index].querySelector(".timeline-dot")
      if (dot) {
        gsap.to(dot, {
          scale: 1.1,
          duration: 0.3,
          ease: "power2.out",
        })
      }
    }
  }

  const handleItemBlur = (index: number) => {
    setActiveItem(null)
    if (timelineItemsRef.current[index]) {
      const dot = timelineItemsRef.current[index].querySelector(".timeline-dot")
      if (dot) {
        gsap.to(dot, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        })
      }
    }
  }

  return (
    <section
      id="education"
      className="scroll-mt-28 mb-28 sm:mb-40 max-w-[1700px] w-full mx-auto"
    >
      <Heading heading="Education & Certifications" />
      <div ref={timelineRef} className="relative max-w-5xl mx-auto mt-16">
        {/* Timeline center line - centered on desktop, left-aligned on mobile */}
        <div className="education-timeline-line absolute md:left-1/2 left-10 top-0 w-1 h-full md:-translate-x-1/2 bg-gradient-to-b from-[#1e40af]/70 to-[#1e40af] dark:from-[#1e40af]/80 dark:to-[#1e40af]"></div>

        {/* Timeline items */}
        {educationData.map((item, index) => {
          const isEven = index % 2 === 0
          const IconComponent = item.icon as IconType

          return (
            <div
              key={index}
              ref={(el) => {
                timelineItemsRef.current[index] = el
              }}
              className="relative mb-8 flex items-center"
              onMouseEnter={() => handleItemFocus(index)}
              onMouseLeave={() => handleItemBlur(index)}
              onFocus={() => handleItemFocus(index)}
              onBlur={() => handleItemBlur(index)}
              tabIndex={0}
            >
              {/* Date - on left for even, right for odd (desktop only) */}
              <div
                className={`absolute w-[calc(50%-2rem)] ${
                  item.type !== "certificate"
                    ? "left-0 text-right pr-2"
                    : "right-0 text-left pl-2"
                } hidden md:block`}
              >
                <span className="text-lg font-medium text-gray-500 dark:text-gray-400">
                  {item.type.charAt(0).toUpperCase() +
                    item.type.slice(1).toLowerCase()}
                </span>
              </div>

              {/* Timeline dot with icon - stays still */}
              <div
                className="timeline-dot absolute md:left-1/2 left-5 md:-translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-[#1e40af]/60 border-2 border-[#1e40af] z-10"
              >
                <IconComponent className="text-xl text-zinc-400" />
              </div>

              {/* Content box - slides in */}
              <div
                className={`content-box md:w-[calc(50%-2rem)] w-[calc(100%-4rem)] ${
                  item.type !== "certificate"
                    ? "md:ml-auto md:mr-6"
                    : "md:mr-auto md:ml-6"
                } ml-12 p-6 rounded-lg shadow-md bg-[#1e40af]/10 dark:bg-[#1e40af]/10 border-[#1e40af]/30 dark:border-[#1e40af]/50 border`}
              >
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {item.institution}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {item.fields.map((field, fieldIndex) => (
                      <span
                        key={fieldIndex}
                        className="text-xs px-2 py-1 rounded-full bg-[#1e40af]/10 dark:bg-[#1e40af]/20 text-zinc-400"
                      >
                        {field}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-start items-center gap-2 mt-3 ml-1">
                    <SlCalender className="text-[#1e40af]/70 dark:text-[#1e40af]/60" />
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {item.date}
                    </span>
                  </div>

                  {item.description && (
                    <p className="mt-2 text-gray-700 dark:text-gray-300">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}