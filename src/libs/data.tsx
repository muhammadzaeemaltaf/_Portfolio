import { FaBootstrap, FaGithub, FaLaravel, FaPython, FaWordpress } from "react-icons/fa6";
import { GiBearFace } from "react-icons/gi";
import { IoLogoNodejs } from "react-icons/io";
import { IoLogoVercel } from "react-icons/io5";
import { PiFramerLogoFill } from "react-icons/pi";
import { RiNextjsFill } from "react-icons/ri";
import { SiGreensock, SiJquery, SiPhp, SiReactquery, SiSanity, SiShadcnui, SiTailwindcss } from "react-icons/si";
import { TbBrandMysql, TbBrandTypescript } from "react-icons/tb";


export const skills = [
  {
    type: "Programming Language",
    name: [
      { label: "JavaScript", icon: IoLogoNodejs },
      { label: "TypeScript", icon: TbBrandTypescript  },
      { label: "Python", icon: FaPython  },
      { label: "PHP", icon: SiPhp },
    ],
  },
  {
    type: "Framework & Libraries",
    name: [
      { label: "Next.js", icon: RiNextjsFill },
      { label: "Tailwind CSS", icon: SiTailwindcss },
      { label: "Zustand", icon: GiBearFace },
      { label: "Shadcn UI", icon: SiShadcnui },
      { label: "Laravel", icon: FaLaravel },
      { label: "MySQL", icon: TbBrandMysql },
      { label: "Bootstrap", icon: FaBootstrap },
      { label: "Ajax", icon: SiJquery },
      { label: "JQuery", icon: SiJquery },
    ],
  },
  {
    type: "CMS",
    name: [
      { label: "WordPress", icon: FaWordpress },
      { label: "Sanity.io", icon: SiSanity },
    ],
  },
  {
    type: "Tools",
    name: [
      { label: "Groq", icon: SiReactquery },
      { label: "Vercel", icon: IoLogoVercel },
      { label: "GSAP", icon: SiGreensock },
      { label: "Framer Motion", icon: PiFramerLogoFill },
      { label: "Git/GitHub", icon: FaGithub },
    ],
  },
];
