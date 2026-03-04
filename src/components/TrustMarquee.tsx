import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const partners = [
  "/partner1.svg",
  "/partner2.svg",
  "/partner3.svg",
  "/partner4.svg",
  "/partner5.svg",
  "/partner6.svg",
  "/partner7.svg",
  "/partner8.svg",
  "/Partneri1.png"
];

const TrustMarquee = () => {
  const { language } = useLanguage();
  const duplicatedPartners = [...partners, ...partners, ...partners];
  
  return (
    <section className="py-16 border-y border-border/50 overflow-hidden">
      {/* Title */}
      <div className="text-center mb-12">
        <h2 className="text-4xl lg:text-5xl font-bold text-white">
          {language === "en" ? "Sponsors" : "Sponsorët"}
        </h2>
      </div>

      {/* Marquee Container */}
      <div className="relative flex justify-center">
        {/* Gradient Fade Left */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
        {/* Gradient Fade Right */}
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

        <motion.div 
          className="flex gap-12 justify-center"
          animate={{ x: [-1000, 0] }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {duplicatedPartners.map((partner, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-48 h-24 bg-muted/50 rounded-lg flex items-center justify-center overflow-hidden hover:bg-muted/80 transition-colors"
            >
              <img src={partner} alt={`Partner ${i + 1}`} className="w-full h-full object-contain p-2" />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TrustMarquee;