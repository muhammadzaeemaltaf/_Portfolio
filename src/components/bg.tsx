import { useRef, useEffect } from 'react';
import gsap from 'gsap';

const GridBackground = () => {
  const gridRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const gridContainer = gridRef.current;
    const gridSize = 50; // Grid lines spaced 50px apart
    let width = window.innerWidth;
    let height = window.innerHeight;

    // Function to create the grid
    const createGrid = () => {
      if (!gridContainer) return;
      gridContainer.innerHTML = ''; // Clear existing grid
      // Create vertical lines
      for (let x = 0; x <= width; x += gridSize) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', (x).toString());
        line.setAttribute('y1', (0).toString());
        line.setAttribute('x2', (x).toString());
        line.setAttribute('y2', (height).toString());
        line.setAttribute('stroke', '#ffffff');
        line.setAttribute('stroke-opacity', '0.1');
        line.setAttribute('stroke-width', '0.5');
        gridContainer.appendChild(line);
      }
      // Create horizontal lines
      for (let y = 0; y <= height; y += gridSize) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', (0).toString());
        line.setAttribute('y1', (y).toString());
        line.setAttribute('x2', (width).toString());
        line.setAttribute('y2', (y).toString());
        line.setAttribute('stroke', '#ffffff');
        line.setAttribute('stroke-opacity', '0.1');
        line.setAttribute('stroke-width', '0.5');
        gridContainer.appendChild(line);
      }
    };

    // Function to animate the grid lines
    const animateGridLines = () => {
      if (!gridContainer) return;
      const gridLines = gridContainer.querySelectorAll('line');
      gridLines.forEach((line) => {
        const duration = 0.5 + Math.random() * 1.5; // 0.5-2 seconds
        const delay = Math.random() * 3; // 0-3 seconds initial delay
        const targetOpacity = 0.3 + Math.random() * 0.1; // 0.3-0.4
        gsap.to(line, {
          strokeOpacity: targetOpacity,
          duration: duration,
          yoyo: true,
          repeat: -1,
          repeatDelay: Math.random() * 2,
          delay: delay,
          ease: 'sine.inOut',
        });
      });
    };

    // Initial setup
    createGrid();
    animateGridLines();

    // Handle window resize
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      createGrid();
      animateGridLines();
    };
    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <svg
      ref={gridRef}
      id="grid-container"
      style={{
        position: 'fixed',
        width: '100vw',
        height: '100vh',
        zIndex: -1, // Keeps the grid behind other content
      }}
    />
  );
};

export default GridBackground;