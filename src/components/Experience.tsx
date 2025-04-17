"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import type { IconType } from "react-icons"
import Heading from "./Heading"
import { experiencesData } from "@/libs/data"
import Link from "next/link"

gsap.registerPlugin(ScrollTrigger)

export default function Experience() {
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
      ".timeline-line",
      { scaleY: 0, transformOrigin: "top" },
      { scaleY: 1, duration: 0.8, ease: "power3.out" }
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
          "-=0.2" // Start pulse slightly before content box finishes
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

  // Optional: Handle hover/focus animations with GSAP
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
    <section id="experience" className="scroll-mt-28 mb-28 sm:mb-40">
      <Heading heading="Experience" />
      <div ref={timelineRef} className="relative max-w-5xl mx-auto mt-16">
        {/* Timeline center line - centered on desktop, left-aligned on mobile */}
        <div className="timeline-line absolute md:left-1/2 left-10 top-0 w-1 h-full md:-translate-x-1/2 bg-gray-200 dark:bg-gray-700"></div>

        {/* Timeline items */}
        {experiencesData.map((item, index) => {
          const isEven = index % 2 === 0
          const IconComponent = item.icon as IconType

          return (
            <div
              key={index}
              onMouseEnter={() => handleItemFocus(index)}
              onMouseLeave={() => handleItemBlur(index)}
              onFocus={() => handleItemFocus(index)}
              onBlur={() => handleItemBlur(index)}
              tabIndex={0}
              ref={(el) => {
                timelineItemsRef.current[index] = el
              }}
              className="relative mb-6 flex items-center px-3"
            >
              {/* Date - on left for even, right for odd (desktop only) */}
              <div
                className={`absolute w-[calc(50%-2rem)] ${
                  isEven ? "left-0 text-right pr-2" : "right-0 text-left pl-2"
                } hidden md:block`}
              >
                <span className="text-lg font-medium text-gray-500 dark:text-gray-400">
                  {item.date}
                </span>
              </div>

              {/* Timeline dot with icon - stays still */}
              <div
                className="timeline-dot absolute overflow-hidden md:left-1/2 left-4 md:-translate-x-1/2 items-center flex justify-center w-12 h-12 rounded-full bg-white dark:bg-gray-800 border-4 border-gray-200 dark:border-gray-700 z-10"
              >
                <IconComponent className="text-primary-500 text-xl" />
              </div>

              {/* Content box - slides in */}
              <div
                className={`content-box md:w-[calc(50%-2rem)] w-[calc(100%-3rem)] ${
                  isEven ? "md:ml-auto md:mr-6" : "md:mr-auto md:ml-6"
                } ml-10 p-6 rounded-lg shadow-md bg-gray-800/50 border border-gray-700`}
              >
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <Link
                    href={item.href}
                    target="_blank"
                    className="text-sm text-gray-600 dark:text-gray-300"
                  >
                    {item.location}
                  </Link>
                  <span className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400 md:hidden">
                    {item.date}
                  </span>
                  <p className="mt-2 text-gray-700 dark:text-gray-300">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}