"use client";

import { useRef } from "react";
import Image, { StaticImageData } from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { scrollToView } from "@/libs/data";
import Bookmyspot from "../../public/project/bms.png";
import Sq1Orbit from "../../public/project/sq1orbit_1.png";
import VaultSneaks from "../../public/project/vaultsneaks.png";
import LexnisSite from "../../public/project/lexnis-bh.png";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type ServiceLink = { label: string; href: string };

type Service = {
  title: string;
  summary: string;
  detail: string;
  tags: string[];
  // the showcase visual: a real project screenshot, or a drawn diagram where no project exists to show
  media:
    | { kind: "image"; src: StaticImageData; caption: string }
    | { kind: "agent"; caption: string };
  links: ServiceLink[];
};

// every claim below is taken from the Projects, Skills and Education data; every link is a live project or a section of this page
const services: Service[] = [
  {
    title: "Full-Stack Web Apps",
    summary:
      "Bookings, payments and notifications that stay in sync from database to screen.",
    detail:
      "I build the back end, the data model and the interface together, so business rules live in one place. BookMySpot runs a 9-state booking lifecycle, PayFast payments and real-time updates on exactly that footing.",
    tags: ["Laravel", "Next.js", "MySQL", "TypeScript"],
    media: { kind: "image", src: Bookmyspot, caption: "BookMySpot" },
    links: [
      { label: "BookMySpot", href: "https://bms.innovativewidget.com/" },
      { label: "All projects", href: "#projects" },
    ],
  },
  {
    title: "Admin Panels & Dashboards",
    summary:
      "Operations teams get one place to run the product instead of a pile of spreadsheets.",
    detail:
      "Next.js admin portals covering deals, brands and ads, ticket tracking with department-wise analytics and audit logging, and SOS operations, shaped around how each team actually works.",
    tags: ["Next.js", "React", "Zustand", "Shadcn UI"],
    media: { kind: "image", src: Sq1Orbit, caption: "Squareone Orbit" },
    links: [{ label: "View related work", href: "#projects" }],
  },
  {
    title: "E-Commerce & Payments",
    summary:
      "One checkout that handles cash on delivery and cards without two separate systems.",
    detail:
      "Dynamic Stripe Checkout with live currency conversion, a webhook-confirmed online path beside instant cash-on-delivery orders, and Sanity keeping the catalogue editable. PayFast covers local payments.",
    tags: ["Stripe", "Sanity", "Next.js", "PayFast"],
    media: { kind: "image", src: VaultSneaks, caption: "VaultSneaks" },
    links: [
      { label: "VaultSneaks", href: "https://vaultsneaks.vercel.app/" },
      { label: "All projects", href: "#projects" },
    ],
  },
  {
    title: "Animated Frontends",
    summary: "Marketing sites that tell their story as people scroll.",
    detail:
      "Scroll-driven GSAP storytelling, image reveals and count-up stats, with the SEO groundwork (self-hosted fonts, JSON-LD, sitemap, Open Graph) built in from the first commit.",
    tags: ["GSAP", "Framer Motion", "Next.js", "Tailwind"],
    media: { kind: "image", src: LexnisSite, caption: "Lexnis Technologies" },
    links: [
      {
        label: "Lexnis Technologies",
        href: "https://www.lexnistechnologies.bh/",
      },
      { label: "Square One Mall", href: "https://squareonemall.vercel.app/" },
    ],
  },
  {
    title: "AI Agents & Tooling",
    summary:
      "Assistants that can act: call tools, read your data and report back.",
    detail:
      "Agents built with the OpenAI Agents SDK and the Laravel AI SDK, with MCP connecting the tools and data they need. Backed by a Cloud Applied Generative AI Engineer certification.",
    tags: ["OpenAI Agents SDK", "MCP", "Laravel AI SDK", "Python"],
    media: { kind: "agent", caption: "Illustrative: agent loop" },
    links: [
      { label: "The AI stack", href: "#skills" },
      { label: "Certification", href: "#education" },
    ],
  },
];

const isInternal = (href: string) => href.startsWith("#");

// drawn stand-in for the AI card, which has no project screenshot
const AgentLoop = () => (
  <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-3 bg-gradient-to-br from-[#1d2424] to-[#0f1111] p-8 font-mono text-xs uppercase tracking-wide text-white/80 lg:gap-[1vw] lg:text-[0.8vw]">
    {["Prompt", "Agent", "MCP tools", "Your data", "Report"].map((n, i, a) => (
      <span key={n} className="flex items-center gap-3 lg:gap-[1vw]">
        <span className="rounded-full border border-white/25 px-4 py-2 lg:px-[1.2vw] lg:py-[0.6vw]">
          {n}
        </span>
        {i < a.length - 1 && <span aria-hidden>→</span>}
      </span>
    ))}
  </div>
);

const pad = (n: number) => String(n).padStart(2, "0");

// how much the neighbours of the active service fade back
const LIST_DIM = 0.18;
const CARD_DIM = 0.35;

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const trigger = useRef<ScrollTrigger | null>(null);

  // clicking a title scrolls the pinned scene to that service's card
  const goTo = (i: number) => {
    const st = trigger.current;
    if (!st) return;
    const y = st.start + (i / (services.length - 1)) * (st.end - st.start);
    const lenis = (
      window as Window & {
        portfolioLenis?: {
          scrollTo: (y: number, o?: { duration?: number }) => void;
        };
      }
    ).portfolioLenis;
    if (lenis) lenis.scrollTo(y, { duration: 1.1 });
    else window.scrollTo({ top: y, behavior: "smooth" });
  };

  useGSAP(
    () => {
      const section = sectionRef.current!;
      const rows = gsap.utils.toArray<HTMLElement>(".sv-row", section);
      const cards = gsap.utils.toArray<HTMLElement>(".sv-card", section);
      const listEl = section.querySelector<HTMLElement>(".sv-list")!;
      const stackEl = section.querySelector<HTMLElement>(".sv-stack")!;
      const last = services.length - 1;
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      // centre of each item inside its own column, measured on every refresh
      let rowC: number[] = [];
      let cardC: number[] = [];
      const measure = () => {
        rowC = rows.map((r) => r.offsetTop + r.offsetHeight / 2);
        cardC = cards.map((c) => c.offsetTop + c.offsetHeight / 2);
      };
      const at = (arr: number[], p: number) => {
        const i = Math.min(Math.floor(p), last - 1 < 0 ? 0 : last - 1);
        const f = last === 0 ? 0 : p - i;
        return arr[i] + ((arr[i + 1] ?? arr[i]) - arr[i]) * f;
      };

      const render = (p: number) => {
        gsap.set(listEl, { y: -at(rowC, p) });
        gsap.set(stackEl, { y: -at(cardC, p) });
        rows.forEach((r, i) => {
          const d = Math.min(Math.abs(i - p), 1);
          gsap.set(r, { opacity: 1 - (1 - LIST_DIM) * d });
        });
        cards.forEach((c, i) => {
          const d = Math.abs(i - p);
          gsap.set(c, { opacity: Math.max(0, 1 - (1 - CARD_DIM) * d) });
        });
      };

      measure();
      render(0);
      if (reduce) return;

      // same arrival as About and Skills: heading rises out of a mask, the rest fades up
      gsap.from(".sv-char", {
        scrollTrigger: { trigger: section, start: "top 85%" },
        yPercent: 115,
        duration: 0.9,
        ease: "power4.out",
        stagger: 0.03,
      });
      gsap.from(".sv-fade", {
        scrollTrigger: { trigger: section, start: "top 85%" },
        y: 16,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
      });
      gsap.from(".sv-in", {
        scrollTrigger: { trigger: section, start: "top 80%" },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        stagger: 0.15,
      });

      const proxy = { p: 0 };
      const tween = gsap.to(proxy, {
        p: last,
        ease: "none",
        onUpdate: () => render(proxy.p),
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${last * 90}%`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          snap: {
            snapTo: 1 / last,
            duration: { min: 0.2, max: 0.5 },
            ease: "power2.inOut",
          },
          onRefresh: () => {
            measure();
            render(proxy.p);
          },
        },
      });
      trigger.current = tween.scrollTrigger ?? null;
      return () => {
        trigger.current = null;
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative h-[100svh] w-full overflow-hidden bg-black text-white"
    >
      <div className="relative h-full w-full">
        <header className="absolute inset-x-0 top-0 z-20 flex items-start justify-between bg-gradient-to-b from-black via-black/90 to-transparent px-6 pb-8 pt-6 lg:px-[3vw] lg:pt-[2.6vh]">
          <h2
            aria-label="Our Services"
            className="font-display text-lg font-medium tracking-[-0.02em] lg:text-[1.2vw]"
          >
            <span aria-hidden className="block overflow-hidden pb-[0.1em]">
              {"Our Services".split("").map((c, i) => (
                <span key={i} className="sv-char inline-block">
                  {c === " " ? "\u00A0" : c}
                </span>
              ))}
            </span>
          </h2>
        </header>

        {/* left: big titles, the active one is centred and bright */}
        <div className="sv-in absolute left-[3vw] top-[52%] hidden w-[38%] lg:block">
          <ul className="sv-list absolute left-0 top-0 w-full">
            {services.map((s, i) => (
              <li key={s.title} className="sv-row py-[2.8vh]">
                <button
                  type="button"
                  onClick={() => goTo(i)}
                  className="block cursor-pointer text-left"
                >
                  <span className="block font-display text-[1.05vw] tracking-[-0.01em]">
                    ({pad(i + 1)})
                  </span>
                  <span className="mt-[0.6vh] block font-display text-[3vw] font-medium leading-[1.05] tracking-[-0.04em]">
                    {s.title}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* right: image cards travel upwards in step with the list */}
        <div className="sv-in absolute inset-x-4 top-[52%] lg:inset-x-auto lg:left-auto lg:right-[3vw] lg:w-[46.5vw]">
          <div className="sv-stack absolute left-0 top-0 flex w-full flex-col gap-[3vh]">
            {services.map((s, i) => (
              <article
                key={s.title}
                className="sv-card relative h-[56svh] w-full shrink-0 overflow-hidden rounded-[1.25rem] bg-[#0f1111] lg:h-[64svh] lg:rounded-[1.8vw]"
              >
                {s.media.kind === "image" ? (
                  <Image
                    src={s.media.src}
                    alt={s.media.caption}
                    fill
                    sizes="(min-width: 1024px) 47vw, 100vw"
                    className="object-cover object-top"
                    priority={i === 0}
                  />
                ) : (
                  <AgentLoop />
                )}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/20" />
                <span className="absolute left-5 top-5 rounded-full bg-black/45 px-3 py-1.5 text-[0.7rem] font-medium uppercase tracking-wide backdrop-blur-md lg:left-[1.5vw] lg:top-[1.5vw] lg:px-[0.9vw] lg:py-[0.5vw] lg:text-[0.8vw]">
                  ({pad(i + 1)}) {s.tags.slice(0, 2).join(" · ")}
                </span>
                <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 lg:inset-x-[1.5vw] lg:bottom-[1.5vw]">
                  <div>
                    <p className="text-[0.65rem] font-medium uppercase tracking-wide text-white/70 lg:text-[0.75vw]">
                      {s.media.caption}
                    </p>
                    <h3 className="font-display text-2xl font-medium tracking-[-0.03em] lg:text-[2.4vw]">
                      {s.title}
                    </h3>
                  </div>
                  <a
                    href={s.links[0].href}
                    {...(isInternal(s.links[0].href)
                      ? {
                          onClick: (e: React.MouseEvent) => {
                            e.preventDefault();
                            scrollToView(s.links[0].href.slice(1));
                          },
                        }
                      : { target: "_blank", rel: "noopener noreferrer" })}
                    className="shrink-0 rounded-full border border-white/30 bg-black/40 px-4 py-2 text-xs backdrop-blur-md transition-colors hover:bg-white hover:text-black lg:px-[1.1vw] lg:py-[0.6vw] lg:text-[0.85vw]"
                  >
                    View ↗
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
