"use client"

import About from "@/components/About";
import HeroSection from "@/components/Hero";
import LogoLoader from "@/components/logoLoader";
import Project from "@/components/Project";
import Skills from "@/components/Skills";
import { useEffect, useState } from "react";
import Experience from "../components/Experience";
import Education from "@/components/Education";
import ContactForm from "@/components/Contact";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }, []);

  return (
    <div className="overflow-hidden">
      {loading && <LogoLoader />}
      {!loading && (
        <>
          <Navbar />
          <HeroSection />
          <About />
          <Skills />
          <Project />
          <Experience />
          <Education />
          <ContactForm />
          <Footer />
        </>
      )}
    </div>
  );
}
