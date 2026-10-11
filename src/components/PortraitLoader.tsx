"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { OUTLINE } from "./portraitOutline";

declare global {
  interface Window {
    __portraitDone?: boolean;
  }
}

const finish = () => {
  window.__portraitDone = true;
  document.body.style.overflow = "";
  window.dispatchEvent(new Event("portrait-done"));
};

// Full-screen outline of the portrait draws itself, then shrinks into the hero
// portrait's exact box (#hero-portrait) and fills in as the real photo.
const PortraitLoader = () => {
  const bgRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const target = document.getElementById("hero-portrait");
    const box = boxRef.current;
    if (!target || !box || window.__portraitDone || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      setGone(true);
      return;
    }

    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden";

    const size = Math.min(window.innerHeight, window.innerWidth * 1.5);
    gsap.set(box, { left: (window.innerWidth - size) / 2, top: (window.innerHeight - size) / 2, width: size, height: size });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          finish();
          setGone(true);
        },
      });
      tl.to(".pl-path", { strokeDashoffset: 0, duration: 1.4, ease: "power1.inOut", stagger: 0.06 })
        // measure at the last moment so the hero layout is final
        .addLabel("shrink")
        .add(() => {
          const r = target.getBoundingClientRect();
          gsap.to(box, { left: r.left, top: r.top, width: r.width, height: r.height, duration: 1.1, ease: "power3.inOut" });
        })
        // text starts while the photo is still travelling, so everything lands together
        .add(() => { window.dispatchEvent(new Event("portrait-go")); }, "shrink+=0.3")
        .to(".pl-photo", { opacity: 1, duration: 0.8, ease: "power1.out" }, "shrink+=0.2")
        .to(".pl-svg", { opacity: 0, duration: 0.6, ease: "power1.out" }, "shrink+=0.4")
        .to(bgRef.current, { opacity: 0, duration: 0.6, ease: "power1.inOut" }, "shrink")
        .to({}, { duration: 0.35 });
    });

    return () => {
      ctx.revert();
      document.body.style.overflow = "";
    };
  }, []);

  if (gone) return null;

  return (
    <div className="fixed inset-0 z-[100]" aria-hidden>
      <div ref={bgRef} className="absolute inset-0 bg-[#f7f6f2]" />
      <div ref={boxRef} className="absolute" style={{ width: "100vh", height: "100vh", left: "calc(50% - 50vh)", top: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/new-profile.png" alt="" className="pl-photo absolute inset-0 h-full w-full object-contain object-bottom opacity-0" />
        <svg viewBox="0 0 1024 1024" className="pl-svg absolute inset-0 h-full w-full" fill="none" stroke="#1d1d1f" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
          <g transform="translate(0,1024) scale(1,-1)">
            {OUTLINE.map((d, i) => (
              <path key={i} d={d} pathLength={1} className="pl-path" style={{ strokeDasharray: 1, strokeDashoffset: 1 }} />
            ))}
          </g>
        </svg>
      </div>
    </div>
  );
};

export default PortraitLoader;
