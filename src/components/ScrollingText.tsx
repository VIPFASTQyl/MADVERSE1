import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const ScrollingText = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <section ref={containerRef} className="py-16 overflow-hidden border-y border-border/30">
      <motion.div style={{ x }} className="flex whitespace-nowrap">
        {[...Array(4)].map((_, i) => (
          <span
            key={i}
            className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mx-8 select-none"
          >MADVERSE &nbsp;
          </span>
        ))}
      </motion.div>
    </section>
  );
};

export default ScrollingText;