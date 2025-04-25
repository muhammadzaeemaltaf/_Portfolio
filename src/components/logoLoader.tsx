"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";

interface LogoLoaderProps {
  width?: number;
  height?: number;
  className?: string;
  duration?: number;
}

const LogoLoader: React.FC<LogoLoaderProps> = ({
  width = 200,
  height = 200,
  className = "",
  duration = 1.5,
}) => {
  const pathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (pathRef.current) {
      const path = pathRef.current;
      const length = path.getTotalLength();

      // Set up the starting position
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;

      // Define the animation
      const animation = path.animate(
        [{ strokeDashoffset: length }, { strokeDashoffset: 0 }],
        {
          duration: duration * 1000,
          fill: "forwards",
          easing: "ease-in-out",
        }
      );
    }
  }, [duration]);

  return (
    <div className="w-full min-h-[100dvh] flex justify-center items-center fixed top-0 left-0 bg-black/90 z-50">
      <svg
        width={width}
        height={height}
        viewBox="0 0 1080 1080"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <path
          ref={pathRef}
          d="M953,544.89c-.09,230.58-186.67,418.73-415,418.5-232.61-.23-419.12-186.86-419-419.25.13-231.38,186.85-418.51,417.5-418.42C766.87,125.82,953.05,313.2,953,544.89ZM417.49,899.59c149.09,58.56,376.68-.15,465.08-210.3,83-197.2-17.38-426.24-218.15-498.53-206-74.16-428.37,39.33-489.34,250.52C115.08,649.08,247,834.76,378,882.74l89-126.61c-53.29-8.15-57.35-18-27.88-60.62q39.53-57.07,79.08-113.88L352.87,351l-4.38,1.72V376.5q0,177.22,0,354.44c0,14.81-1.32,29.74-20.81,30-19.31.29-21.59-14-21.59-29.18,0-144.73-.31-289.47.73-434.19.07-10.18,7.87-24.34,16.4-29.48,13.46-8.13,24,2.61,32.43,14.48,36.24,51.18,73,102,109.55,153C490.83,471.3,516.52,507,543.86,545L711.6,303.66c-70.22,0-134.45-.12-198.67.09-15.15,0-30-1.28-29.88-20.58.1-19.1,14.78-20.63,30-20.58,72.37.22,144.73,0,217.1.15,13.71,0,31.66-3.64,35.45,13.83,2.34,10.81-2.51,25.84-9.15,35.51C674.16,431.88,591,551,508,670.36q-13.1,18.85-26.27,37.65l5.78,6c7.31-6,16.39-10.73,21.67-18.17q120.4-169.67,239.93-340c8.21-11.65,16.08-24.09,33.47-18.55,16.84,5.37,18.09,19.21,17.81,34q-3.43,180.5-6.51,361c-.24,14.36-1.8,28.33-19.57,28.79-18.74.49-22-13-21.64-28.87q1.56-74.19,2.09-148.4c.35-52.79.08-105.58.08-163.1L550.18,711.19H579c34,0,67.94-.17,101.9.13,13.42.12,23.22,6.09,23.46,20.8.24,14.92-9.86,20.28-23.07,21.3-5.14.4-10.33.15-15.5.15-42.83,0-85.66-.31-128.48.32-7.33.11-17.77,2-21.4,6.92C482.49,806.44,450.3,852.94,417.49,899.59Z"
          fill="none"
          stroke="#ffffff"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default LogoLoader;
