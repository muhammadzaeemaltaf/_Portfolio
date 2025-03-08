import React from "react";

interface HeadingProps {
    heading: string;
    }

const Heading: React.FC<HeadingProps> = ({ heading }) => {
  return (
    <div className="flex justify-center">
      <h1 className="text-2xl md:text-3xl lg:text-5xl mt-5 text-balance text-center tracking-wide md:mt-8 lg:mt-10 inline-block bg-clip-text text-transparent font-medium [background-image:-webkit-linear-gradient(45deg,#2563eb_6%,#1e40af_19%,#2563eb_100%)]">
        {heading}
      </h1>
    </div>
  );
};

export default Heading;
