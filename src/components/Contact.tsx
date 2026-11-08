"use client";

import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const FIELDS = [
  { name: "name", label: "What should I call you?", type: "text", placeholder: "Your name", hint: "A name would help." },
  { name: "email", label: "Where can I reach you?", type: "email", placeholder: "you@example.com", hint: "A valid email, please." },
  { name: "message", label: "Tell me what’s on your mind.", type: "textarea", placeholder: "The idea, the sticking point, or the question…", hint: "Tell me a little about the idea." },
] as const;

const line =
  "w-full resize-none bg-transparent pb-4 text-g-lg text-white outline-none transition-colors duration-500 placeholder:text-white/40 focus:placeholder:text-white/20 lg:pb-[1vw]";

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [touched, setTouched] = useState(false); // hints show only after the first submit attempt
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      gsap.from(".ct-in", {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: { trigger: root.current, start: "top 70%" },
      });
    },
    { scope: root },
  );

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setTouched(true);
    if (!form.checkValidity()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", { method: "POST", body: new FormData(form) });
      if (!res.ok) throw new Error();
      form.reset();
      setTouched(false);
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" ref={root} className="relative w-full bg-black px-4 py-24 text-white lg:px-[1vw] lg:py-[7vw]">
      <div className="grid gap-4 lg:grid-cols-2 lg:gap-x-[3vw]">
        <p className="ct-in font-mono text-g-label uppercase tracking-[0.15em] text-white/50 ">The first few words</p>
        <p className="ct-in text-g-base text-white/90 ">No presentation needed. Just enough to begin</p>
      </div>

      <form noValidate onSubmit={onSubmit} className="mt-12 flex flex-col gap-10 lg:mt-[5vw] lg:gap-[3vw]">
        {FIELDS.map((f, i) => (
          <label key={f.name} className="ct-in group grid gap-4 lg:grid-cols-2 lg:gap-x-[3vw]">
            <span className="flex gap-4 text-g-xl text-white/60 transition-colors duration-500 group-focus-within:text-white lg:gap-[1.2vw] ">
              <span className="pt-1 font-mono text-g-label ">0{i + 1}</span>
              {f.label}
            </span>
            <span className="block">
              <span className="relative block border-b border-white/20 after:absolute after:inset-x-0 after:-bottom-px after:h-px after:origin-left after:scale-x-0 after:bg-white after:transition-transform after:duration-700 after:ease-out group-focus-within:after:scale-x-100">
              {f.type === "textarea" ? (
                <textarea name={f.name} required maxLength={5000} rows={7} placeholder={f.placeholder} className={line} />
              ) : (
                <input name={f.name} type={f.type} required maxLength={500} placeholder={f.placeholder} className={line} />
              )}
              </span>
              <span className={`mt-3 block min-h-4 text-g-label text-white/60 transition-all duration-500 ${touched ? "opacity-0 -translate-y-1 group-has-[:invalid]:translate-y-0 group-has-[:invalid]:opacity-100" : "opacity-0"}`}>
                {f.hint}
              </span>
            </span>
          </label>
        ))}

        <div className="ct-in flex items-center gap-6 lg:justify-end">
          <p role="status" className={`text-g-sm ${status === "error" ? "text-red-400" : "text-white/60"}`}>
            {status === "sent" && "Sent. I’ll get back to you soon."}
            {status === "error" && "Couldn’t send. Please try again."}
          </p>
          <button
            type="submit"
            disabled={status === "sending"}
            className="rounded-full bg-white px-8 py-3 text-g-sm font-medium text-black transition-all duration-500 disabled:opacity-50 lg:px-[2.4vw] lg:py-[0.9vw] "
          >
            {status === "sending" ? "Sending…" : "Send"}
          </button>
        </div>
      </form>
    </section>
  );
}
