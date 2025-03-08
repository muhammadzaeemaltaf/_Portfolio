"use client"
import { useEffect, useRef } from "react"

interface Skill {
  icon: React.ElementType;
  label: string;
}

interface SkillTagProps {
  skill: Skill;
  isHovering: boolean;
  mousePosition: { x: number; y: number };
  containerRect: DOMRect | null;
}

export default function SkillTag({ skill, isHovering, mousePosition, containerRect }: SkillTagProps) {
  const tagRef = useRef<HTMLLIElement>(null)
  const IconComponent = skill.icon

  useEffect(() => {
    if (isHovering && tagRef.current && containerRect) {
      const tagRect = tagRef.current.getBoundingClientRect()
      // Tag center relative to the container
      const tagCenterX = tagRect.left - containerRect.left + tagRect.width / 2
      const tagCenterY = tagRect.top - containerRect.top + tagRect.height / 2

      // Direction from tag center to mouse
      const deltaX = mousePosition.x - tagCenterX
      const deltaY = mousePosition.y - tagCenterY

      // Calculate angle to mouse
      const angle = Math.atan2(deltaY, deltaX)

      // Convert angle to percentage around the tag's border
      const xPercentage = 50 + Math.cos(angle) * 50
      const yPercentage = 50 + Math.sin(angle) * 50

      // Set CSS variables
      tagRef.current.style.setProperty("--x-percentage", `${xPercentage}%`)
      tagRef.current.style.setProperty("--y-percentage", `${yPercentage}%`)
    }
  }, [isHovering, mousePosition, containerRect])

  return (
    <li
      ref={tagRef}
      className="skill-tag relative flex items-center gap-2 border border-white/15 bg-white text-center rounded-xl px-5 py-3 text-gray-800 dark:bg-white/10 dark:text-white/80 overflow-hidden"
    >
      <div
        className="absolute inset-0 rounded-lg pointer-events-none"
        style={{
          maskImage: "radial-gradient(80px 80px at var(--x-percentage) var(--y-percentage), black, transparent)",
          WebkitMaskImage: "radial-gradient(80px 80px at var(--x-percentage) var(--y-percentage), black, transparent)",
          border: "1.5px solid rgb(193 193 193)",
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