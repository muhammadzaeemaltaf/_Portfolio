"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import type { IconType } from "react-icons"
import Heading from "./Heading"
import { experiencesData } from "@/libs/data"

gsap.registerPlugin(ScrollTrigger)

export default function Experience() {
  const timelineRef = useRef<HTMLDivElement >(null)
  const timelineItemsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (!timelineRef.current) return

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
      { scaleY: 1, duration: 0.8, ease: "power3.out" },
    )

    // Animate each timeline item
    timelineItemsRef.current.forEach((item, index) => {
      if (!item) return

      // For mobile (one direction) and desktop (alternating directions)
      const direction = window.innerWidth < 768 ? 1 : index % 2 === 0 ? 1 : -1

      gsap.fromTo(
        item,
        {
          opacity: 0,
          x: direction * 50,
        },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 80%",
          },
        },
      )
    })
  }, [])

  return (
    <section id="experience" className="scroll-mt-28 mb-28 sm:mb-40">
      <Heading heading="Experience" />
      <div ref={timelineRef} className="relative max-w-5xl mx-auto mt-16">
        {/* Timeline center line - centered on desktop, left-aligned on mobile */}
        <div className="timeline-line absolute md:left-1/2  left-10 top-0 w-1 h-full md:-translate-x-1/2 bg-gray-200 dark:bg-gray-700"></div>

        {/* Timeline items */}
        {experiencesData.map((item, index) => {
          const isEven = index % 2 === 0
          const IconComponent = item.icon as IconType

          return (
            <div
              key={index}
              ref={(el) => { timelineItemsRef.current[index] = el }}
              className="relative mb-12 flex items-center px-3"
            >
              {/* Date - on left for even, right for odd (desktop only) */}
              <div
                className={`absolute w-[calc(50%-2rem)] ${isEven ? "left-0 text-right pr-2" : "right-0 text-left pl-2"} hidden md:block`}
              >
                <span className="text-lg font-medium text-gray-500 dark:text-gray-400">{item.date}</span>
              </div>

              {/* Timeline dot with icon - centered on desktop, left-aligned on mobile */}
              <div className="absolute md:left-1/2 left-4 md:-translate-x-1/2 items-center flex justify-center w-12 h-12 rounded-full bg-white dark:bg-gray-800 border-4 border-gray-200 dark:border-gray-700 z-10">
                <IconComponent className="text-primary-500 text-xl" />
              </div>

              {/* Content box - alternating on desktop, always right on mobile */}
              <div
                className={`md:w-[calc(50%-2rem)] w-[calc(100%-3rem)] 
                                    ${isEven ? "md:ml-auto md:-mr-3" : "md:mr-auto md:-ml-2"} 
                                    ml-10 p-6 rounded-lg shadow-md
                                    bg-gray-800/50 border border-gray-700`}
              >
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{item.location}</p>
                  <span className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400 md:hidden">
                    {item.date}
                  </span>
                  <p className="mt-2 text-gray-700 dark:text-gray-300">{item.description}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

