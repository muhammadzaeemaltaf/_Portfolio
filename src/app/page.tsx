import About from "@/components/About";
import LightBackdrop from "@/components/LightBackdrop";
import Statement from "@/components/Statement";
import HeroSection from "@/components/Hero";
import PortraitLoader from "@/components/PortraitLoader";
import Project from "@/components/Project";
import Skills from "@/components/Skills";
import Services from "@/components/Services";
import HowIWork from "@/components/HowIWork";
import Experience from "../components/Experience";
import Education from "@/components/Education";
import ContactForm from "@/components/Contact";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";

export default function Home() {
  return (
    <div className="overflow-hidden">
      <PortraitLoader />
      <LightBackdrop />
      {/* <Navbar /> */}
      <main>
        <section aria-label="Hero section" id="hero">
          <HeroSection />
        </section>
        <section aria-label="What I believe about building software" id="statement">
          <Statement />
        </section>
        <section aria-label="About Muhammad Zaeem Altaf" id="about">
          <About />
        </section>
        <section aria-label="Technical skills and technologies" id="skills">
          <Skills />
        </section>
        <section aria-label="Portfolio projects" id="projects">
          <Project />
        </section>
        <section aria-label="How I work — my process" id="how-i-work">
          <HowIWork />
        </section>
        <section aria-label="Services I offer" id="services">
          <Services />
        </section>
        <section aria-label="Professional work experience" id="experience">
          <Experience />
        </section>
        <section aria-label="Education and certifications" id="education">
          <Education />
        </section>
        <section aria-label="Contact form" id="contact">
          <ContactForm />
        </section>
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}
