"use client"

import React, { useState, useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Heading from "@/components/Heading"
import { topProjects } from "@/libs/data"
import Image from "next/image"
import { useMediaQuery } from "@/hooks/use-media-query"
import { AnimatedButton } from "./AnimateButton"
import { X } from "lucide-react"
import { IconType } from "react-icons"
import Link from "next/link"

gsap.registerPlugin(ScrollTrigger)

const Project = () => {
  const [expandedProject, setExpandedProject] = useState<any>(null)
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



  const handleCardClick = (project: any, e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const cardEl = e.currentTarget
    const rect = cardEl.getBoundingClientRect()

    // Create placeholder
    const placeholder = document.createElement("div")
    placeholder.style.width = `${rect.width}px`
    placeholder.style.height = `${rect.height}px`
    placeholder.style.margin = window.getComputedStyle(cardEl).margin
    placeholder.classList.add("invisible")
    cardEl.parentNode?.insertBefore(placeholder, cardEl)

    // Store references
    expandedCardData.current = {
      element: cardEl,
      placeholder,
      initialRect: rect,
    }

    // Animate card
    gsap.set(cardEl, {
      position: "fixed",
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      backgroundColor: "black",
      zIndex: 100,
    })

    gsap.to(cardEl.querySelector("img"), {
      width: "100%",
      height: "100%",
      borderRadius: 0,
      duration: 0.5,
      marginTop: 0
    })

    gsap.to(cardEl.querySelector(".text"), {
      position: "relative",
      top: "auto",
      width: "auto",
      marginTop: "56px",
      padding: "1rem",
    })

    gsap.to(cardEl.querySelector(".text h3"), {
      fontSize: "2.5rem",
      marginBottom: "1rem",
    })

    gsap.to(cardEl, {
      top: "50%",
      left: "50%",
      xPercent: -50,
      yPercent: -50,
      height: isMobile ? "100dvh" : "80vh",
      width: isMobile ? "100vw" : undefined,
      padding: 0,
      duration: 0.5,
      onComplete: () => setExpandedProject(project),
    })

    gsap.to(cardEl.querySelector(".text .tags"), {
      position: "relative",
      opacity: 1,
      duration: 0.5,
      delay: 0.5,
      stagger: 0.1,
      marginBottom: "2.5rem",
      y: 10,
    })

    gsap.to(".overlay", {
      opacity: 1,
      pointerEvents: "auto",
      duration: 0.5,
    })
  }

  const handleOverlayClick = () => {
    const { element, placeholder, initialRect } = expandedCardData.current
    if (!element || !placeholder || !initialRect) return

    gsap.to(element, {
      top: window.innerWidth < 767 ? initialRect.top + 260 : initialRect.top + 80,
      left: "50%",
      width: initialRect.width,
      height: initialRect.height,
      padding: "1rem",
      duration: 0.5,
      onComplete: () => {
        // Clean up
        gsap.set(element, { clearProps: "all" })
        placeholder.remove()
        setExpandedProject(null)
        expandedCardData.current = {
          element: null,
          placeholder: null,
          initialRect: null,
        }
      },
    })
    gsap.to(element.querySelector("img"), {
      position: "relative",
      top: "auto",
      left: "auto",
      borderRadius: "4px",
      width: window.innerWidth >= 1536 ? "300px" : isMobile ? "" : "250px",
      marginTop: element.querySelector("img")?.classList.contains('mt-6') ? "24px" : "",
    })
    gsap.to(element.querySelector(".text"), {
      position: isMobile ? "" : "absolute",
      top: "16px",
      width: isMobile ? "" : "60%",
      marginTop: "0",
      padding: 0,
      duration: 0.5,
    })

    gsap.to(element.querySelector(".text h3"), {
      fontSize: window.innerWidth >= 1536 ? "24px" : "1rem",
      marginBottom: "0",
    })

    gsap.to(element.querySelector(".text .tags"), {
      position: "absolute",
      opacity: 0,
      marginBottom: "0",
      y: 0,
    })

    gsap.to(".overlay", {
      opacity: 0,
      pointerEvents: "none",
      duration: 0.5,
    })
  }

  return (
    <section ref={sectionRef} className="min-h-screen mb-20 relative px-4 md:px-10 max-w-[1700px] w-full mx-auto">
      <Heading heading="Top Projects" />


      {/* Render overlay when a project is expanded */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 cursor-pointer pointer-events-none opacity-0 overlay"
        onClick={handleOverlayClick}
      />

      <div className="grid grid-cols-1 lg:w-[70%] justify-items-center gap-4 mt-8 mx-auto">
        {/* Left Column: Projects */}
        <div className="project-container relative w-full flex flex-col gap-4">

          {topProjects?.map((project, i) => {
            const IconComponent = project.organizationLogo as IconType
            return (
              <div
                key={i}
                onClick={(e) => {
                  if (expandedProject?.title !== project.title) {
                    handleCardClick(project, e) // Expand if not expanded
                  }
                }}
                className={`relative ${project.organization ? 'md:h-[220px] 2xl:h-[250px]' : 'md:h-[170px] 2xl:h-[200px]'} border border-white/20 text-white p-4 rounded-lg shadow project-card cursor-pointer ${expandedProject?.title === project.title ? "overflow-y-auto" : ""}`}
            >
                {expandedProject === project && (
                  <AnimatedButton
                    text={<X className="h-3 w-3" />}
                    bg={`!absolute right-2 top-2 !p-2 !h-7 z-[100] bg-black md:!hidden ${expandedProject?.title === project.title ? "!opacity-100" : "!opacity-0"
                      }`}
                    onClick={handleOverlayClick}
                  />
                )}
                <div className={`flex items-center justify-end`}>
                  <Image
                    src={project.image || "/placeholder.svg?height=200&width=200" || "/placeholder.svg"}
                    alt={project.title}
                    width={1000}
                    height={1000}
                    className={`rounded object-center aspect-video md:w-[250px] 2xl:w-[300px] object-cover relative ${project.organization ? 'mt-6' : ''}`}
                  />
                </div>
                <div className="text relative md:absolute top-4 md:w-[60%] md:pr-10 mb-4">
                  <h3 className="font-bold 2xl:text-2xl mb-3">{project.title}</h3>
                  <p className="line-clamp-2 mb-4 2xl:text-[18px]">{project.description}</p>
                  {project.organization && (
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 flex items-center justify-center rounded-lg overflow-hidden bg-white/10 mb-4 border border-white/20">
                        <IconComponent className="text-primary-500 text-xl" />
                      </div>
                      {project.organizationURL && (
                        <Link href={project.organizationURL} target="_blank" className="font-semibold mb-4">{project.organization}</Link>
                      )}  
                    </div>
                  )
                  }
                  <div
                    className="tags flex justify-start items-center gap-2"
                    style={{
                      opacity: 0,
                      position: "absolute",
                    }}
                  >
                    {project.tags.map((Tag, i) => (
                      <span key={i} className="text-xs p-1 rounded mr-1">
                        <Tag className="h-8 w-8" />
                      </span>
                    ))}
                  </div>
                  <AnimatedButton
                    text={expandedProject?.title === project.title ? "View Project" : "Overview"}
                    arrow={expandedProject?.title === project.title}
                    href={expandedProject?.title === project.title ? project.link : ""}
                    expanded={expandedProject?.title === project.title}
                    bg={`2xl:h-12 2xl:px-7 2xl:text-xl ${(expandedProject?.title === project.title && !project.link) ? "hidden" : "block"}`}
                    onClick={
                      expandedProject?.title !== project.title
                        ? (e) => {
                          e.stopPropagation()
                          const card = (e.currentTarget as HTMLElement).closest(".project-card")
                          if (card) {
                            handleCardClick(project, { ...e, currentTarget: card } as React.MouseEvent<
                              HTMLDivElement,
                              MouseEvent
                            >)
                          }
                        }
                        : undefined
                    }
                  />
                </div>
              </div>
            )
          })}

        </div>


      </div>
    </section>
  )
}

export default Project
