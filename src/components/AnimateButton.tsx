import React, { useEffect, useState } from "react";
import Link from "next/link";

export const AnimatedButton = ({
  text = "Book a call",
  arrow = false,
  href = "#",
  bg = "",
  expanded = false,
  target= "",
  type = "button",
  onClick,
}: {
  text?: string | React.ReactNode;
  arrow?: boolean;
  href?: string;
  bg?: string;
  target?: string;
  expanded?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: (e: React.MouseEvent) => void;
}) => {
  const [prevText, setPrevText] = useState(text);
  const [currentText, setCurrentText] = useState(text);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (text !== currentText) {
      setIsAnimating(true);
      setPrevText(currentText);
      setCurrentText(text);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [text]);

  // Determine if the button should be a Link or a regular button
  const isLink = href && href !== "#" && href !== "";

  // Common classes for both Link and button
  const commonClasses = `group/button cursor-pointer flex w-fit items-center justify-center gap-x-2 font-bricolage shadow-[inset_0_2px_2px_rgba(10,60,207,0.5),inset_0_-2px_#1d4ed8,_0_0_0_4px_rgba(10,60,207,0.05),_0_20px_80px_-10px_rgba(10,60,207,0.43)] duration-300 hover:shadow-[inset_0_2px_2px_rgba(10,60,207,0.5),inset_0_-2px_#1d4ed8,_0_0_0_4px_rgba(10,60,207,0.05),_0_20px_80px_-10px_rgba(10,60,207,0.8),0_0_5px_#60a5fa,inset_0_0_5px_#60a5fa] __liquid-button-wrapper h-11 rounded-[1.5rem] px-6 text-base/4 font-medium md:h-10 md:px-6 md:text-sm ${bg} ${
    expanded ? "expanded" : ""
  }`;

  // Common button content
  const buttonContent = (
    <>
      <span className="relative inline-block overflow-hidden">
        {typeof text === "string" ? (
          text.split("").map((char, index) => (
            <span
              key={index}
              className="inline-block whitespace-pre duration-500 [transition-timing-function:cubic-bezier(0.77,0,0.18,1)] group-hover/button:-translate-y-full"
            >
              {char}
            </span>
          ))
        ) : (
          text
        )}
        <span className="absolute left-0 top-0">
          {typeof text === "string" ? (
            text.split("").map((char, index) => (
              <span
                key={index}
                className="inline-block translate-y-full whitespace-pre duration-500 [transition-timing-function:cubic-bezier(0.77,0,0.18,1)] group-hover/button:translate-y-0"
              >
                {char}
              </span>
            ))
          ) : (
            text
          )}
        </span>
      </span>
      {arrow && (
        <span className="relative flex size-4 sm:size-[18px] shrink-0 overflow-hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 12"
            strokeWidth="0.75"
            className="absolute inset-0 m-auto translate-x-[calc(-100%-20px)] duration-500 [transition-timing-function:cubic-bezier(0.77,0,0.18,1)] group-hover/button:translate-x-0"
          >
            <path
              d="M13.3333 0.166687C13.3333 0.78502 13.9442 1.70835 14.5625 2.48335C15.3575 3.48335 16.3075 4.35585 17.3967 5.02169C18.2133 5.52085 19.2033 6.00002 20 6.00002M20 6.00002C19.2033 6.00002 18.2125 6.47919 17.3967 6.97835C16.3075 7.64502 15.3575 8.51752 14.5625 9.51585C13.9442 10.2917 13.3333 11.2167 13.3333 11.8334M20 6.00002H0"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 12"
            strokeWidth="0.75"
            className="absolute inset-0 m-auto duration-500 [transition-timing-function:cubic-bezier(0.77,0,0.18,1)] group-hover/button:translate-x-[calc(100%+20px)]"
          >
            <path
              d="M13.3333 0.166687C13.3333 0.78502 13.9442 1.70835 14.5625 2.48335C15.3575 3.48335 16.3075 4.35585 17.3967 5.02169C18.2133 5.52085 19.2033 6.00002 20 6.00002M20 6.00002C19.2033 6.00002 18.2125 6.47919 17.3967 6.97835C16.3075 7.64502 15.3575 8.51752 14.5625 9.51585C13.9442 10.2917 13.3333 11.2167 13.3333 11.8334M20 6.00002H0"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </span>
      )}
    </>
  );

  // Render Link or button based on href
  if (isLink) {
    return (
      <Link
        className={commonClasses}
        style={{ "--is-animation-running": "running" } as React.CSSProperties}
        href={href}
        target={target}
        onClick={(e) => {
          e.stopPropagation(); // Prevent event bubbling to parent
          if (onClick) onClick(e);
        }}
      >
        {buttonContent}
      </Link>
    );
  } else {
    return (
      <button
        className={commonClasses}
        type={type}
        style={{ "--is-animation-running": "running" } as React.CSSProperties}
        onClick={(e) => {
          e.stopPropagation(); // Prevent event bubbling to parent
          if (onClick) onClick(e);
        }}
      >
        {buttonContent}
      </button>
    );
  }
};