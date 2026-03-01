import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface PageTitleAnimationProps {
  title: string;
}

const PageTitleAnimation: React.FC<PageTitleAnimationProps> = ({ title }) => {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;

    // Create the animation
    gsap.fromTo(
      el,
      {
        fontSize: '3rem',
        y: 0,
        opacity: 1,
      },
      {
        fontSize: '6rem',
        y: 200,
        opacity: 0.7,
        scrollTrigger: {
          trigger: el,
          start: 'top center',
          end: 'bottom top',
          scrub: 1.2,
          markers: false, // Set to true for debugging
        },
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen overflow-hidden">
      <h1
        ref={titleRef}
        className="text-5xl md:text-7xl font-bold text-white text-center px-4"
      >
        {title}
      </h1>
    </div>
  );
};

export default PageTitleAnimation;
