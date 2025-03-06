"use client"

import About from "@/components/About";
import HeroSection from "@/components/Hero";
import LogoLoader from "@/components/logoLoader";
import locomotiveScroll from "locomotive-scroll";
import { useEffect, useRef, useState } from "react";


export default function Home() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    if (!scrollRef.current) return;
    const scroll = new locomotiveScroll({
      el: scrollRef.current,
      smooth: true
    });
  });

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }, []);

  return (
    <div className="overflow-hidden" ref={scrollRef} data-scroll data-scroll-speed="0.0000009" data-scroll-position="top">
      {loading && <LogoLoader />}
      <HeroSection />
      <About />
    </div>
  );
}
