import About from "@/components/About";
import HeroSection from "@/components/Hero";

import Image from "next/image";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <About />
      <div className="h-screen"></div>
    </div>
  );
}
