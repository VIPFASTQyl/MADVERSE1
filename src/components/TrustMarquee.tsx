import React from 'react';
import LogoLoop from './LogoLoop';
import type { LogoItem } from './LogoLoop';

const partners: LogoItem[] = [
  { src: "/partner1.png", alt: "Partner 1" },
  { src: "/partner2.png", alt: "Partner 2" },
  { src: "/partner3.png", alt: "Partner 3" }
];

const TrustMarquee = () => {
  // Custom render to make partner1 smaller
  const renderPartner = (item: LogoItem, key: React.Key) => {
    const isPartner1 = 'src' in item && item.src === "/partner1.png";
    
    return (
      <img
        key={key}
        className={`h-[var(--logoloop-logoHeight)] w-auto block object-contain [-webkit-user-drag:none] pointer-events-none [image-rendering:-webkit-optimize-contrast] motion-reduce:transition-none transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover/item:scale-120 ${
          isPartner1 ? 'scale-75' : ''
        }`}
        src={'src' in item ? item.src : ''}
        alt={'alt' in item ? item.alt : ''}
        loading="lazy"
        decoding="async"
        draggable={false}
      />
    );
  };

  return (
    <section className="py-16 border-y border-border/50 overflow-hidden">
      <LogoLoop
        logos={partners}
        speed={75}
        direction="left"
        logoHeight={96}
        gap={65}
        pauseOnHover={false}
        fadeOut={true}
        fadeOutColor="#000000"
        scaleOnHover={true}
        renderItem={renderPartner}
        ariaLabel="Partner companies"
        className="w-full"
      />
    </section>
  );
};

export default TrustMarquee;