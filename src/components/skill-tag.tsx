import { IoLogoNodejs } from "react-icons/io";

interface SkillTagProps {
    skill: {
      label: string;
      icon: React.ElementType;
    };
  }
  
  export default function SkillTag({ skill }: SkillTagProps) {
    const IconComponent = skill.icon;
    return (
      <li className="relative flex items-center gap-2 bg-white borderBlack text-center rounded-xl px-5 py-3 text-gray-800 dark:bg-white/10 dark:text-white/80 overflow-hidden">
        <div className="absolute inset-0 -top-1 -left-1 opacity-30">
        <IconComponent className="h-10 w-10"/>
        </div>
        <span className="font-semibold">
        {skill.label}
        </span>
      </li>
    );
  }
