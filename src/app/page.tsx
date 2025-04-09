"use client"

import About from "@/components/About";
import HeroSection from "@/components/Hero";
import LogoLoader from "@/components/logoLoader";
import Project from "@/components/Project";
import Skills from "@/components/Skills";
import { useEffect, useState } from "react";
import Experience from "../components/Experience";
import Education from "@/components/Education";
import TopProject from "@/components/TopProjects";


export default function Home() {
  const [loading, setLoading] = useState(true)

  

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
      {/* <TopProject /> */}
      <Project/>
      <Experience />
      <Education />
    </div>
  );
}
