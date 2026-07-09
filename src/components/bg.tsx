import { useRef, useEffect } from 'react';

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
        line.classList.add('grid-flicker-line');
        randomizeLine(line);
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
        line.classList.add('grid-flicker-line');
        randomizeLine(line);
        gridContainer.appendChild(line);
      }
    };

    // CSS-driven flicker (compositor-only, no per-line JS tweens) — hundreds of
    // GSAP tweens running forever on a fixed, always-visible layer was the main
    // scroll-jank source; the browser handles this far cheaper as CSS animation.
    const randomizeLine = (line: SVGLineElement) => {
      const duration = 1 + Math.random() * 3; // 1-4s full cycle
      const delay = -Math.random() * duration; // negative delay desyncs start phase
      const targetOpacity = 0.3 + Math.random() * 0.1; // 0.3-0.4
      line.style.setProperty('--flicker-duration', `${duration}s`);
      line.style.setProperty('--flicker-delay', `${delay}s`);
      line.style.setProperty('--flicker-opacity', targetOpacity.toString());
    };

    // Initial setup
    createGrid();

    // Handle window resize
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      createGrid();
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