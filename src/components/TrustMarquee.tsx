import { motion } from "framer-motion";

const partners = [
  "/partner1.png",
  "/partner2.png",
  "/partner3.png",
  "/partner4.png",
  "/partner5.png",
  "/partner6.png",
  "/partner7.png",
  "/partner8.png"
];

const TrustMarquee = () => {
  return (
    <section className="py-12 border-y border-border/50 overflow-hidden">
      {/* Marquee Container */}
      <div className="relative">
        {/* Gradient Fade Left */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10" />
        {/* Gradient Fade Right */}
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10" />

        <div className="flex marquee pause-animation">
          {[...partners, ...partners].map((partner, i) => (
            <div
              key={i}
              className="flex-shrink-0 mx-8 w-24 h-10 bg-muted/50 rounded-lg flex items-center justify-center overflow-hidden"
            >
              <img src={partner} alt={`Partner ${i + 1}`} className="w-full h-full object-contain" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustMarquee;