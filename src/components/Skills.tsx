"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { skills } from "@/libs/data"
import Heading from "./Heading"
import SkillTag from "./skill-tag"

gsap.registerPlugin(ScrollTrigger)

export default function Skills() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const skillItems = containerRef.current?.querySelectorAll(".skill-category li")

    if (skillItems) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%", // When the section enters viewport
        },
      })

      tl.fromTo(
        skillItems,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.1, // This ensures they appear one by one
          scrub: true,
          ease: "power2.out",
        }
      )
    }
  }, [])

  return (
    <section className="flex justify-center">
      <div id="skills" className="mb-28 max-w-[53rem] scroll-mt-28 text-center sm:mb-40">
        <Heading heading="Skills" />

        <div ref={containerRef} className="grid gap-8">
          {skills.map((category, catIndex) => (
            <div key={catIndex} className="skill-category text-left mt-6">
              <h3 className="text-xl text-center font-semibold text-gray-900 dark:text-white mb-4">
                {category.type}
              </h3>
              <ul className="flex flex-wrap justify-center gap-3">
                {category.name.map((skill, index) => (
                  <SkillTag key={index} skill={skill} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
