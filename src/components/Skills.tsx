"use client"

import React, { useState, useRef, useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { skills } from "@/libs/data"
import Heading from "./Heading"
import SkillTag from "@/components/skill-tag"

gsap.registerPlugin(ScrollTrigger)

export default function Skills() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [containerRect, setContainerRect] = useState<DOMRect | null>(null)

  // Scroll animation for skill items
  useEffect(() => {
    const skillItems = containerRef.current?.querySelectorAll(".skill-category li")
    if (skillItems) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
        },
      })
      tl.fromTo(
        skillItems,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          ease: "power2.out",
        },
      )
    }
  }, [])

  // Track mouse position relative to the container
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        setContainerRect(rect)
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        setMousePosition({ x, y })
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener("mousemove", handleMouseMove)
      return () => container.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <section 
    ref={containerRef}
    className="flex justify-center w-full">
      <div id="skills" className="mb-28 scroll-mt-28 w-full text-center sm:mb-40">
        <Heading heading="Skills" />
        <div
          className="grid gap-8 mt-5 justify-center relative"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {skills.map((category, catIndex) => (
            <div key={catIndex} className="skill-category text-left mt-6 relative z-10 max-w-[53rem]">
              <h3 className="text-xl text-center font-semibold text-gray-900 dark:text-white mb-4">
                {category.type}
              </h3>
              <ul className="flex flex-wrap justify-center gap-3">
                {category.name.map((skill, index) => (
                  <SkillTag
                    key={index}
                    skill={skill}
                    isHovering={isHovering}
                    mousePosition={mousePosition}
                    containerRect={containerRect}
                  />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}