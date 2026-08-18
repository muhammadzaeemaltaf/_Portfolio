"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { skills } from "@/libs/data"
import Heading from "./Heading"

gsap.registerPlugin(ScrollTrigger)

export default function Skills() {
  const containerRef = useRef<HTMLDivElement>(null)

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
          stagger: 0.05,
          ease: "power2.out",
        },
      )
    }
  }, [])

  return (
    <section className="flex justify-center">
      <div id="skills" className="mb-28 max-w-[53rem] scroll-mt-28 text-center sm:mb-40 px-4 md:px-0">
        <Heading heading="Skills" />
        <div
          ref={containerRef}
          className="grid gap-8 md:mt-5 relative"        >
          {skills.map((category, catIndex) => (
            <div key={catIndex} className="skill-category text-left mt-6 relative z-10">
              <h3 className="text-xl text-center font-semibold text-white mb-4">
                {category.type}
              </h3>
              <ul className="flex flex-wrap justify-center gap-3">
                {category.name.map((skill, index) => (
                  <SkillTag
                    key={index}
                    skill={skill}
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
}

function SkillTag({ skill }: SkillTagProps) {
  const IconComponent = skill.icon
  const tagRef = useRef<HTMLLIElement>(null)
  const borderRef = useRef<HTMLDivElement>(null)

  return (
    <li
      ref={tagRef}
      onPointerMove={(event) => {
        if (event.pointerType === "touch" || !borderRef.current) return
        const rect = event.currentTarget.getBoundingClientRect()
        borderRef.current.style.setProperty("--x-percentage", `${event.clientX - rect.left}px`)
        borderRef.current.style.setProperty("--y-percentage", `${event.clientY - rect.top}px`)
      }}
      className="group/skill relative flex items-center gap-2 border border-white/15 text-center rounded-xl px-4 py-2 md:px-5 md:py-3 bg-white/10 text-white/80 overflow-hidden"
    >
      {/* Animated border element */}
      <div
        ref={borderRef}
        className="absolute inset-[1px] -m-px rounded-xl pointer-events-none opacity-0 transition-opacity duration-300 hover-capable:group-hover/skill:opacity-100"
        style={{
          maskImage: "radial-gradient(150px 150px at var(--x-percentage) var(--y-percentage), black, transparent)",
          WebkitMaskImage: "radial-gradient(150px 150px at var(--x-percentage) var(--y-percentage), black, transparent)",
          border: "1px solid rgb(29, 78, 216)",
        }}
      />
      <div className="absolute inset-0 -top-1 -left-1 opacity-30">
        <IconComponent className="h-10 w-10" />
      </div>
      <span className="font-semibold relative z-10">{skill.label}</span>
    </li>
  )
}