import { motion } from "framer-motion";

const partners = [
  "/partner1.png",
  "/partner2.png",
  "/partner3.png"
];

const TrustMarquee = () => {
  // 9 copies of partners for extended carousel
  const extendedPartners = [...partners, ...partners, ...partners];
  
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
          animate={{ x: -2248 }}
          transition={{
            duration: 45,
            repeat: Infinity,
            ease: "linear",
            repeatType: "loop"
          }}
          initial={{ x: 0 }}
        >
          {extendedPartners.map((partner, i) => (
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