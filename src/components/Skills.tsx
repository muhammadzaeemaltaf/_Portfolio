"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { skills } from "@/libs/data"
import Heading from "./Heading"

gsap.registerPlugin(ScrollTrigger)

export default function Skills() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [mousePosition, setMousePosition] = useState({ clientX: 0, clientY: 0 })

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
          stagger: 0.09,
          ease: "power2.out",
        },
      )
    }
  }, [])

  // Track mouse position over the container
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ clientX: e.clientX, clientY: e.clientY })
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener("mousemove", handleMouseMove)
      return () => container.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <section className="flex justify-center">
      <div id="skills" className="mb-28 max-w-[53rem] scroll-mt-28 text-center sm:mb-40">
        <Heading heading="Skills" />
        <div
          ref={containerRef}
          className="grid gap-8 mt-5 relative"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {skills.map((category, catIndex) => (
            <div key={catIndex} className="skill-category text-left mt-6 relative z-10">
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

interface SkillTagProps {
  skill: {
    label: string
    icon: React.ElementType
  }
  isHovering: boolean
  mousePosition: { clientX: number; clientY: number }
}

function SkillTag({ skill, isHovering, mousePosition }: SkillTagProps) {
  const IconComponent = skill.icon
  const tagRef = useRef<HTMLLIElement>(null)
  const borderRef = useRef<HTMLDivElement>(null)

  // Update border position based on mouse coordinates
  useEffect(() => {
    if (!tagRef.current || !borderRef.current) return

    const rect = tagRef.current.getBoundingClientRect()
    const x = mousePosition.clientX - rect.left
    const y = mousePosition.clientY - rect.top
    const xPercent = (x / rect.width) * 100
    const yPercent = (y / rect.height) * 100

    gsap.set(borderRef.current, {
      "--x-percentage": `${xPercent}%`,
      "--y-percentage": `${yPercent}%`,
    })
  }, [mousePosition])

  return (
    <li
      ref={tagRef}
      className="relative flex items-center gap-2 border border-white/15 bg-white text-center rounded-xl px-5 py-3 text-gray-800 dark:bg-white/10 dark:text-white/80 overflow-hidden"
    >
      {/* Animated border element */}
      <div
        ref={borderRef}
        className="absolute inset-[1px] -m-px rounded-xl pointer-events-none"
        style={{
          maskImage: "radial-gradient(150px 150px at var(--x-percentage) var(--y-percentage), black, transparent)",
          WebkitMaskImage: "radial-gradient(150px 150px at var(--x-percentage) var(--y-percentage), black, transparent)",
          border: "1px solid rgb(29, 78, 216)",
          opacity: isHovering ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />
      <div className="absolute inset-0 -top-1 -left-1 opacity-30">
        <IconComponent className="h-10 w-10" />
      </div>
      <span className="font-semibold relative z-10">{skill.label}</span>
    </li>
  )
}