import React, { useState, useEffect, createRef, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Heading from './Heading';
import { projectsData } from '../libs/data';
import Image from 'next/image';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const Project = () => {
  // Create list of stack keys and corresponding refs
  const stacks = Object.keys(projectsData).filter(stack => projectsData[stack]?.length > 0);
  const stackRefs = stacks.reduce((acc, stack) => {
    acc[stack] = createRef<HTMLDivElement>();
    return acc;
  }, {} as Record<string, React.RefObject<HTMLDivElement | null>>);

  const [activeStack, setActiveStack] = useState(stacks[0] || '');
  const stackNameRef = useRef<HTMLHeadingElement>(null);

  // IntersectionObserver to update activeStack
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stack = entry.target.getAttribute('data-stack');
            if (stack) setActiveStack(stack);
          }
        });
      },
      { threshold: 0.5 }
    );

    stacks.forEach((stack) => {
      if (stackRefs[stack].current) {
        observer.observe(stackRefs[stack].current as Element);
      }
    });

    return () => observer.disconnect();
  }, [stacks, stackRefs]);

  // Animate stack name when activeStack changes
  useEffect(() => {
    if (stackNameRef.current) {
      gsap.fromTo(
        stackNameRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5 }
      );
    }
  }, [activeStack]);

  // Animate project cards on scroll
  useEffect(() => {
    const scrollContainer = document.querySelector('.scroll-container');
    gsap.from('.project-card', {
      scrollTrigger: {
        trigger: '.project-card',
        scroller: scrollContainer,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
      opacity: 0,
      y: 50,
      duration: 0.5,
      stagger: 0.2,
    });
  }, []);

  return (
    <section className=''>
      <Heading
        heading="Projects"
      />
    <div className="h-[100vh] grid grid-cols-[65%_auto] gap-4">
      {/* Left Column: Projects */}
      <div
        className="overflow-y-scroll scroll-container"
        style={{ scrollBehavior: 'smooth', scrollbarWidth: 'none' }}
      >
        {stacks.map((stack) => (
          <div
            key={stack}
            ref={stackRefs[stack]}
            data-stack={stack}
            className="mb-8 px-4"
          >
            {projectsData[stack].map((project, i) => (
              <div
                key={`${stack}-${i}`}
                className="bg-white text-black p-4 m-2 rounded shadow project-card grid grid-cols-[70%_auto] gap-4"
              >
                <div>
                <h3 className="font-bold">{project.title}</h3>
                <p>{project.description}</p>
                </div>
                <div>
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  width={200}
                  height={200}
                  objectFit="cover"
                  className="rounded"
                />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Right Column: Active Stack Name */}
      <div className="flex justify-center items-center">
        <h3
          ref={stackNameRef}
          className="font-bold capitalize text-white text-2xl"
        >
          {activeStack}
        </h3>
      </div>
    </div>
    </section>
  );
};

export default Project;