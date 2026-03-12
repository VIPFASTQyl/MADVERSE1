import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const partners = [
  "/partner1.png",
  "/partner2.png",
  "/partner3.png"
];

const TrustMarquee = () => {
  // Only duplicate once for seamless loop (2x total)
  const duplicatedPartners = [...partners, ...partners];
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Mobile: shorter animation distance so partners are always visible
  // Desktop: longer animation distance
  const animateX = isMobile ? [-250, -500] : [-600, -1200];
  const duration = isMobile ? 20 : 40;
  
  return (
    <section className="py-16 border-y border-border/50 overflow-hidden">
      {/* Marquee Container */}
      <div className="relative flex justify-center">
        {/* Gradient Fade Left */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
        {/* Gradient Fade Right */}
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

        <motion.div 
          className="flex gap-[65px] whitespace-nowrap"
          animate={{ x: animateX }}
          transition={{
            duration: duration,
            repeat: Infinity,
            ease: "linear",
            repeatType: "loop"
          }}
        >
          {duplicatedPartners.map((partner, i) => (
            <div
              key={`partner-${i}`}
              className="flex-shrink-0 w-48 h-24 flex items-center justify-center overflow-hidden"
            >
              <img src={partner} alt={`Partner ${(i % partners.length) + 1}`} className="w-full h-full object-contain" />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TrustMarquee;