"use client"

import React, { useState, useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Flip } from "gsap/Flip"
import Heading from "@/components/Heading"
import { topProjects } from "@/libs/data"
import Image from "next/image"
import { useMediaQuery } from "@/hooks/use-media-query"
import { AnimatedButton } from "./AnimateButton"
import { X } from "lucide-react"
import { IconType } from "react-icons"
import Link from "next/link"

gsap.registerPlugin(ScrollTrigger, Flip)

const Project = () => {
  const [expandedProject, setExpandedProject] = useState<any>(null)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isTitleStuck, setIsTitleStuck] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const expandedCardData = useRef<{
    element: HTMLElement | null
    placeholder: HTMLElement | null
    initialRect: DOMRect | null
  }>({ element: null, placeholder: null, initialRect: null })

  const isMobile = useMediaQuery("(max-width: 767px)")

  useEffect(() => {
    if (sectionRef.current) {
      gsap.from(".project-card", {
        scrollTrigger: {
          trigger: ".project-card",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.2,
      })
    }
  }, [])

  // Fade in the expanded-only content (tags, thumbnails, overview) once it mounts,
  // and track whether the sticky title bar has scrolled to the top of the card.
  useEffect(() => {
    const element = expandedCardData.current.element
    if (expandedProject && element) {
      const items = element.querySelectorAll(".reveal-item")
      gsap.fromTo(
        items,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.08, ease: "power2.out" }
      )

      const sentinel = element.querySelector(".title-sentinel")
      if (sentinel) {
        const observer = new IntersectionObserver(
          ([entry]) => setIsTitleStuck(!entry.isIntersecting),
          { root: element, threshold: 0 }
        )
        observer.observe(sentinel)
        return () => observer.disconnect()
      }
    }
  }, [expandedProject])

  const handleCardClick = (project: any, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const cardEl = e.currentTarget
    const computedStyle = window.getComputedStyle(cardEl)

    // Capture the card's current (grid) position/size so Flip can morph from it precisely.
    const state = Flip.getState(cardEl)
    const rect = cardEl.getBoundingClientRect()

    // Placeholder keeps this card's exact grid cell reserved so sibling
    // cards don't reshuffle columns while this card floats above the grid.
    const placeholder = document.createElement("div")
    placeholder.style.width = `${rect.width}px`
    placeholder.style.height = `${rect.height}px`
    placeholder.style.gridColumn = computedStyle.gridColumn
    placeholder.style.gridRow = computedStyle.gridRow
    placeholder.classList.add("invisible")
    cardEl.parentNode?.insertBefore(placeholder, cardEl)

    expandedCardData.current = {
      element: cardEl,
      placeholder,
      initialRect: rect,
    }

    gsap.set(document.body, { overflow: "hidden" })

    const modalWidth = isMobile ? window.innerWidth : Math.min(1100, window.innerWidth * 0.9)
    const modalHeight = isMobile ? window.innerHeight : window.innerHeight * 0.85

    gsap.set(cardEl, {
      position: "fixed",
      top: "50%",
      left: "50%",
      xPercent: -50,
      yPercent: -50,
      width: modalWidth,
      height: modalHeight,
      margin: 0,
      overflow: "hidden",
      backgroundColor: "black",
      zIndex: 100,
    })

    Flip.from(state, {
      duration: 0.7,
      ease: "power2.inOut",
      onComplete: () => {
        setExpandedProject(project)
        gsap.set(cardEl, { overflow: "auto" })
      },
    })

    gsap.to(".overlay", {
      opacity: 1,
      pointerEvents: "auto",
      duration: 0.3,
      ease: "power2.out",
    })
  }

  const handleOverlayClick = () => {
    const { element, placeholder, initialRect } = expandedCardData.current
    if (!element || !placeholder || !initialRect) return

    const state = Flip.getState(element)

    gsap.set(document.body, { overflow: "auto" })
    gsap.set(element, { overflow: "hidden" })
    // Unmount expanded-only content immediately so it doesn't linger while the card shrinks back.
    setExpandedProject(null)
    setActiveImageIndex(0)
    setIsTitleStuck(false)

    gsap.set(element, {
      position: "fixed",
      top: initialRect.top,
      left: initialRect.left,
      xPercent: 0,
      yPercent: 0,
      width: initialRect.width,
      height: initialRect.height,
    })

    Flip.from(state, {
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => {
        gsap.set(element, { clearProps: "all" })
        placeholder.remove()
        expandedCardData.current = {
          element: null,
          placeholder: null,
          initialRect: null,
        }
      },
    })

    gsap.to(".overlay", {
      opacity: 0,
      pointerEvents: "none",
      duration: 0.3,
      ease: "power2.out",
    })
  }

  return (
    <section ref={sectionRef} className="min-h-screen mb-20 relative px-4 md:px-10 max-w-[1400px] w-full mx-auto" id="projects">
      <Heading heading="Top Projects" />

      {/* Render overlay when a project is expanded */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 cursor-pointer pointer-events-none opacity-0 overlay"
        onClick={handleOverlayClick}
      />

      <div className="project-container relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {topProjects?.map((project, i) => {
          const IconComponent = project.organizationLogo as IconType
          const isExpanded = expandedProject?.title === project.title
          const hasGallery = project.image.length > 1
          const displayedImage = isExpanded ? project.image[activeImageIndex] : project.image[0]

          return (
            <div
              key={i}
              onClick={(e) => {
                if (!isExpanded) {
                  handleCardClick(project, e)
                }
              }}
              className="project-card relative flex flex-col h-full border border-white/20 text-white rounded-lg shadow cursor-pointer overflow-hidden"
            >
              {isExpanded && (
                <AnimatedButton
                  text={<X className="h-3 w-3" />}
                  bg={`!absolute right-2 top-2 !p-2 !h-7 z-[100] bg-black md:!hidden ${isExpanded ? "!opacity-100" : "!opacity-0"}`}
                  onClick={handleOverlayClick}
                />
              )}

              <div className="relative w-full aspect-video overflow-hidden shrink-0">
                <Image
                  src={displayedImage || "/placeholder.svg?height=200&width=200"}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>

              {isExpanded && hasGallery && (
                <div className="thumbnails reveal-item flex gap-2 px-4 pt-3">
                  {project.image.map((img, imgIdx) => (
                    <button
                      key={imgIdx}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setActiveImageIndex(imgIdx)
                      }}
                      className={`relative w-14 h-9 rounded overflow-hidden border shrink-0 ${activeImageIndex === imgIdx ? "border-primary-500" : "border-white/20"}`}
                    >
                      <Image src={img} alt={`${project.title} screenshot ${imgIdx + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}

              <div className="text flex flex-col flex-1 p-4">
                {isExpanded && <div className="title-sentinel h-px" />}
                <div
                  className={
                    isExpanded
                      ? `sticky top-0 z-20 -mx-4 -mt-4 mb-3 px-4 pt-4 pb-3 bg-black transition-colors duration-200 ${isTitleStuck ? "border-b border-white/15" : ""}`
                      : "mb-3"
                  }
                >
                  <h3 className={`font-bold transition-[font-size] ${isExpanded ? "text-2xl md:text-3xl 2xl:text-4xl" : "2xl:text-2xl"}`}>{project.title}</h3>
                </div>
                <p className="line-clamp-2 mb-4 2xl:text-[18px]">{project.role}</p>
                {project.organization && (
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 flex items-center justify-center rounded-lg overflow-hidden bg-white/10 mb-4 border border-white/20">
                      <IconComponent className="text-primary-500 text-xl" />
                    </div>
                    {project.organizationURL && (
                      <Link href={project.organizationURL} target="_blank" className="font-semibold mb-4">
                        {project.organization}
                      </Link>
                    )}
                  </div>
                )}
                {isExpanded && (
                  <div className="tags reveal-item flex justify-start items-center gap-2">
                    {project.tags.map((Tag, tagIdx) => (
                      <span key={tagIdx} className="text-xs p-1 rounded mr-1">
                        <Tag className="h-8 w-8" />
                      </span>
                    ))}
                  </div>
                )}
                <div className="animated-button mt-auto">
                  <AnimatedButton
                    text={isExpanded ? "View Project" : "Overview"}
                    arrow={isExpanded}
                    href={isExpanded ? project.link : ""}
                    expanded={isExpanded}
                    bg={`2xl:h-12 2xl:px-7 2xl:text-xl ${isExpanded && !project.link ? "hidden" : "block mt-4"}`}
                    target={isExpanded ? "_blank" : undefined}
                    onClick={
                      !isExpanded
                        ? (e) => {
                          e.stopPropagation()
                          const card = (e.currentTarget as HTMLElement).closest(".project-card")
                          if (card) {
                            handleCardClick(project, { ...e, currentTarget: card } as React.MouseEvent<HTMLDivElement, MouseEvent>)
                          }
                        }
                        : undefined
                    }
                  />
                </div>

                {isExpanded && (
                  <div className="overview-wrapper reveal-item mt-6">
                    <h2 className="font-semibold text-3xl">Project Overview</h2>
                    <p className="my-5">{expandedProject.description}</p>
                    <h2 className="font-semibold text-3xl">Features</h2>
                    {expandedProject.feature && (
                      <ul className="my-5 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2.5 text-sm leading-relaxed text-white/80">
                        {expandedProject.feature.map((item: string, featureIdx: number) => (
                          <li key={featureIdx} className="flex items-start">
                            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full [background-image:-webkit-linear-gradient(45deg,#2563eb_6%,#1e40af_19%,#2563eb_100%)] mr-2"/>
                            {item}</li>
                        ))}
                      </ul>
                    )}
                    <h2 className="font-semibold text-3xl my-5">Impact</h2>
                    <p>{expandedProject.impact}</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default Project
