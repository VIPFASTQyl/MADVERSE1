import React, { useEffect, useRef, useState } from 'react';
import { CarouselItem } from './Carousel';
import { motion } from 'framer-motion';

interface ProgramsMobileGridProps {
  items: CarouselItem[];
  onItemClick?: (item: CarouselItem) => void;
}

export default function ProgramsMobileGrid({ items = [], onItemClick }: ProgramsMobileGridProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const children = itemRefs.current;
        let nearest = 0;
        let minDist = Infinity;
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        children.forEach((c, i) => {
          if (!c) return;
          const r = c.getBoundingClientRect();
          const dx = Math.abs(r.left + r.width / 2 - centerX);
          if (dx < minDist) {
            minDist = dx;
            nearest = i;
          }
        });
        setActiveIndex(nearest);
      });
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      el.removeEventListener('scroll', onScroll as any);
      cancelAnimationFrame(raf);
    };
  }, [items]);

  const scrollToIndex = (index: number) => {
    const target = itemRefs.current[index];
    if (target && containerRef.current) {
      target.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto no-scrollbar" ref={containerRef} style={{ scrollSnapType: 'x mandatory', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
        <div className="flex gap-4 px-4 py-2" style={{ width: 'max-content' }}>
          <style>{`.no-scrollbar::-webkit-scrollbar { display: none; }`}</style>
          {items.map((item, i) => (
            <div
              key={String(item.id ?? i)}
              ref={(el) => (itemRefs.current[i] = el)}
              className="shrink-0 w-64 rounded-xl bg-card border border-border/30 p-3 cursor-pointer touch-pan-x" 
              style={{ scrollSnapAlign: 'center' }}
              onClick={() => onItemClick?.(item)}
            >
                <div className="h-36 w-full overflow-hidden rounded-md bg-muted mb-3">
                  {item.icon ? (
                    <div className="w-full h-full flex items-center justify-center">{item.icon}</div>
                  ) : (
                    <img src={(item as any).image || '/Hero.png'} alt={item.title} className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-lg text-foreground truncate">{item.title}</div>
                  <div className="text-xs text-muted-foreground ml-2">{(item as any).current_participants ?? 0}/{(item as any).max_participants ?? '-'}</div>
                </div>
                {item.description && <div className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.description}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center items-center gap-1 mt-4">
        {items.map((_, idx) => (
          <motion.button
            key={idx}
            onClick={() => scrollToIndex(idx)}
            className="focus:outline-none"
            aria-label={`Go to program ${idx + 1}`}
            animate={{
              width: activeIndex === idx ? 28 : 12,
              height: activeIndex === idx ? 8 : 12
            }}
            transition={{
              duration: 0.3,
              type: 'spring',
              stiffness: 200,
              damping: 25
            }}
          >
            <motion.div
              className="rounded-full"
              animate={{
                backgroundColor: activeIndex === idx ? 'hsl(var(--primary))' : 'hsl(var(--primary) / 0.3)'
              }}
              transition={{ duration: 0.3 }}
              style={{ width: '100%', height: '100%', borderRadius: 8 }}
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
}
