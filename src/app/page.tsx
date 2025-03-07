"use client"

import About from "@/components/About";
import HeroSection from "@/components/Hero";
import LogoLoader from "@/components/logoLoader";
import Skills from "@/components/Skills";
import locomotiveScroll from "locomotive-scroll";
import { useEffect, useRef, useState } from "react";


export default function Home() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined' && scrollRef.current) {
      const scroll = new locomotiveScroll({
        el: scrollRef.current,
        smooth: true
      });
    }
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }, []);

  return (
    <div className="overflow-hidden" >
      {loading && <LogoLoader />}
      <HeroSection />
      <About />
      <Skills/>
    </div>
  );
}
