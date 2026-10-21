"use client"

import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"
import Link from "next/link"
import { X } from "lucide-react"
import { topProjects } from "@/libs/data"
import { AnimatedButton } from "./AnimateButton"
import { projectLines } from "./projectLines"

gsap.registerPlugin(ScrollTrigger, useGSAP)

// one card per project, centred at [left %, top %] with width in vw, kept clear of the word in the middle
const SCATTER = [
  [13, 18, 17], [40, 11, 13], [67, 13, 15], [88, 24, 15], [10, 64, 15], [90, 68, 14], [26, 86, 16], [74, 87, 17],
]
const photos = topProjects.map((p) => p.image[0]).slice(0, SCATTER.length)

const TAGLINE = "A curated selection of platforms, products and sites I've built."

// TRIONN /work layout: one stream, each card parked in a lane, all at one size
// (below md every card is a centred 90% column)
const LANE = { left: "md:ml-[4%] md:mr-auto lg:ml-[1vw]", right: "md:ml-auto md:mr-[4%] lg:mr-[1vw]", center: "md:mx-auto" }
const LAYOUT: (keyof typeof LANE)[] = ["left", "right", "left", "center", "right", "left", "center", "right"]

const Project = () => {
  const root = useRef<HTMLDivElement>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const [open, setOpen] = useState<number | null>(null)
  const [shot, setShot] = useState(0)
  const project = open === null ? null : topProjects[open]

  useEffect(() => {
    if (open !== null) dialog.current?.showModal()
  }, [open])

  // once the threads come to rest, flip the whole site to white bg / black text (see .site-light in globals.css).
  // Driven by the start alone: an `end: "max"` measured before the page below finished growing
  // (How I Work's pin spacer etc.) switched the flip back off part-way down the page.
  useEffect(() => {
    const flip = (on: boolean) => document.documentElement.classList.toggle("site-light", on)
    const st = ScrollTrigger.create({
      trigger: root.current!.querySelector(".pw-end"),
      start: "top 60%",
      onEnter: () => flip(true),
      onLeaveBack: () => flip(false),
      onRefresh: (self) => flip(self.scroll() >= self.start),
    })
    return () => {
      st.kill()
      document.documentElement.classList.remove("site-light")
    }
  }, [])

  useGSAP(
    () => {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      const intro = root.current!.querySelector<HTMLElement>(".pw-intro")!
      const word = root.current!.querySelector<HTMLElement>(".pw-word")!
      const photoEls = gsap.utils.toArray<HTMLElement>(".pw-photo")

      if (!reduce) {
        // idle levitation on the inner card, so it never fights the scroll tween on the outer one
        photoEls.forEach((el) => {
          gsap.to(el.firstElementChild, {
            y: () => gsap.utils.random(-22, 22),
            x: () => gsap.utils.random(-12, 12),
            rotation: () => gsap.utils.random(-4, 4),
            duration: () => gsap.utils.random(2.5, 4.5),
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            repeatRefresh: true,
          })
        })
      }

      // centre of "My work" inside the intro, measured live so it survives resizes
      const targetLeft = () => word.getBoundingClientRect().left - intro.getBoundingClientRect().left + word.offsetWidth / 2
      const targetTop = () => word.getBoundingClientRect().top - intro.getBoundingClientRect().top + word.offsetHeight / 2

      const tl = gsap.timeline(
        reduce
          ? { paused: true }
          : { scrollTrigger: { trigger: intro, start: "top top", end: "+=220%", pin: true, scrub: true, invalidateOnRefresh: true } }
      )
      // one by one, each card dives into the word and the word fills a step whiter
      photoEls.forEach((el, i) => {
        tl.to(el, { left: targetLeft, top: targetTop, scale: 0.05, opacity: 0, ease: "power2.in", duration: 1 }, i * 0.6)
      })
      tl.fromTo(".pw-fill", { clipPath: "inset(130% -5% -30% -5%)" }, { clipPath: "inset(-30% -5% -30% -5%)", ease: "none", duration: (photoEls.length - 1) * 0.6 + 1 }, 0)
        .to({}, { duration: 0.6 }) // hold the white word a beat before the section moves on
      if (reduce) tl.progress(1)

      // three threads draw down the stream and reveal each card as they reach it
      if (!reduce) {
        return projectLines(
          root.current!.querySelector<HTMLElement>(".pw-list")!,
          root.current!.querySelector<HTMLCanvasElement>(".pw-lines")!,
          gsap.utils.toArray<HTMLElement>(".pw-card"),
          gsap.utils.toArray<HTMLElement>(".pw-thumb"),
          intro,
          root.current!.querySelector<HTMLElement>(".pw-dot")!,
          root.current!.querySelector<HTMLElement>(".pw-end")!
        )
      }
    },
    { scope: root }
  )

  const close = () => {
    dialog.current?.close()
  }

  return (
    <div ref={root} className="relative w-full bg-black text-white">
      {/* intro: floating project cards dive into "My work" one by one until it is solid white */}
      <div className="pw-intro relative z-50 h-svh w-full overflow-hidden">
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <h2 className="pw-word relative z-20 whitespace-nowrap font-display text-[12vw] font-extrabold leading-[0.9] tracking-[-0.02em] md:text-[6vw]">
            <span className="text-black [-webkit-text-stroke:3px_white] [paint-order:stroke_fill] [stroke-linejoin:round]">My Project</span>
            <span aria-hidden className="pw-fill absolute inset-0 text-white">My Project</span>
            {/* the three threads leave from here, from behind the heading (h2 is z-20, above the canvas) */}
            <span aria-hidden className="pw-dot absolute left-1/2 top-1/2 -z-10 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 opacity-0" />
          </h2>
          <p className="mt-4 max-w-md text-sm text-white/60 md:text-base lg:mt-[1vw] lg:max-w-[30vw] lg:text-[1.1vw]">{TAGLINE}</p>
        </div>
        {photos.map((src, i) => {
          const [l, t, w] = SCATTER[i]
          return (
            <div
              key={i}
              className="pw-photo absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${l}%`, top: `${t}%`, width: `max(${w}vw, 120px)` }}
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-white/10 shadow-2xl shadow-black">
                <Image src={src} alt="" fill sizes="20vw" className="object-cover object-top" />
              </div>
            </div>
          )
        })}
      </div>

      {/* threads drawn behind the cards (fixed + viewport-sized; projectLines paints only the stream's range) */}
      <canvas aria-hidden className="pw-lines pointer-events-none fixed left-0 top-0 h-lvh w-full motion-reduce:hidden" />

      {/* stream: cards zig-zag down left / centre / right lanes */}
      <ul className="pw-list relative z-10 flex w-full flex-col gap-20 pb-32 pt-10 lg:pb-48 lg:pt-20">
        {topProjects.map((p, i) => {
          const lane = LAYOUT[i % LAYOUT.length]
          return (
            <li key={p.title} className={`pw-card mx-auto w-[90%] md:w-[50%] lg:w-[46%] ${LANE[lane]}`}>
              <button
                type="button"
                data-cursor="View"
                onClick={() => {
                  setShot(0)
                  setOpen(i)
                }}
                className="group block w-full text-left"
              >
                <div className="pw-thumb relative mb-6 aspect-[812/568] w-full overflow-hidden rounded-lg bg-white/5">
                  <Image
                    src={p.image[0]}
                    alt={p.title}
                    fill
                    quality={90}
                    sizes="(max-width: 767px) 90vw, (max-width: 1023px) 50vw, 46vw"
                    className="object-cover object-left-top transition-transform duration-[1.2s] ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-[1.03]"
                  />
                </div>
                <h3 className="font-display text-2xl font-semibold tracking-[-0.02em] sm:w-7/12 md:text-3xl lg:text-[2vw]">{p.title}</h3>
                <div className="mt-4 flex flex-col justify-between gap-6 sm:flex-row sm:items-end sm:gap-10">
                  <p className="line-clamp-2 max-w-80 text-sm text-white/60 sm:w-7/12 lg:max-w-[22vw] lg:text-[0.9vw]">{p.role}</p>
                  <span className="relative shrink-0 self-start pb-2 font-mono text-xs uppercase tracking-[0.2em] text-[#D8D8D8] lg:text-[0.75vw] sm:self-auto">
                    Explore project
                    <span className="absolute inset-x-0 bottom-0 h-px origin-left bg-[#D8D8D8] transition-transform duration-500 group-hover:scale-x-0" />
                  </span>
                </div>
              </button>
            </li>
          )
        })}
        {/* the threads come to rest here */}
        <li aria-hidden className="pw-end mx-auto h-1.5 w-1.5 rounded-full bg-[#D7D7CD] motion-reduce:hidden" />
      </ul>

      {/* details */}
      <dialog
        ref={dialog}
        data-lenis-prevent
        onClose={() => setOpen(null)}
        onClick={(e) => e.target === e.currentTarget && close()}
        className="m-auto h-svh overflow-y-auto max-h-none w-full max-w-none bg-black text-white backdrop:bg-black/70 backdrop:backdrop-blur-md md:h-[85vh] md:max-w-[1100px] md:rounded-xl md:border md:border-white/15"
      >
        {project && (
          <div className="relative">
            <button
              type="button"
              aria-label="Close"
              onClick={close}
              className="fixed right-4 top-4 z-10 rounded-full border border-white/20 bg-black/70 p-2 md:absolute"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="relative aspect-[2854/1432] w-full bg-black">
              <Image src={project.image[shot]} alt={project.title} fill quality={100} sizes="(max-width: 767px) 100vw, 1100px" className="object-cover" />
            </div>
            {project.image.length > 1 && (
              <div className="flex gap-2 overflow-x-auto px-6 pt-4">
                {project.image.map((img, j) => (
                  <button
                    key={j}
                    type="button"
                    onClick={() => setShot(j)}
                    className={`relative h-9 w-14 shrink-0 overflow-hidden rounded border ${shot === j ? "border-primary-500" : "border-white/20"}`}
                  >
                    <Image src={img} alt={`${project.title} screenshot ${j + 1}`} fill className="object-cover object-top" />
                  </button>
                ))}
              </div>
            )}
            <div className="p-6 md:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h3 className="font-display text-2xl font-semibold md:text-4xl">{project.title}</h3>
                {project.link && <AnimatedButton text="View Project" arrow href={project.link} expanded bg="shrink-0" target="_blank" />}
              </div>
              <p className="mt-3 text-white/70">{project.role}</p>
              {project.organization && project.organizationLogo && (
                <div className="mt-4 flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/20 bg-white/10">
                    <project.organizationLogo className="text-xl text-primary-500" />
                  </span>
                  {project.organizationURL ? (
                    <Link href={project.organizationURL} target="_blank" className="font-semibold">
                      {project.organization}
                    </Link>
                  ) : (
                    <span className="font-semibold">{project.organization}</span>
                  )}
                </div>
              )}
              <div className="mt-5 flex items-center gap-3">
                {project.tags.map((Tag, j) => (
                  <Tag key={j} className="h-7 w-7" />
                ))}
              </div>
              <h4 className="mt-8 font-display text-2xl font-semibold">Project Overview</h4>
              <p className="mt-3 text-white/80">{project.description}</p>
              {project.feature && (
                <>
                  <h4 className="mt-8 font-display text-2xl font-semibold">Features</h4>
                  <ul className="mt-4 grid grid-cols-1 gap-x-8 gap-y-2.5 text-sm leading-relaxed text-white/80 md:grid-cols-2">
                    {project.feature.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#2563eb]" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {project.impact && (
                <>
                  <h4 className="mt-8 font-display text-2xl font-semibold">Impact</h4>
                  <p className="mt-3 text-white/80">{project.impact}</p>
                </>
              )}
            </div>
          </div>
        )}
      </dialog>
    </div>
  )
}

export default Project
