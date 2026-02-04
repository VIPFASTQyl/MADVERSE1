import { motion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const ShowcaseGrid = () => {
  const isMobile = useIsMobile();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [api, setApi] = useState<any>(null);

  const items = [
    { titleKey: "youthPrograms", categoryKey: "youth", image: "/src/assets/project-1.jpg", link: "/activity/youth" },
    { titleKey: "artWorkshops", categoryKey: "arts", image: "/src/assets/project-2.jpg", link: "/activity/arts" },
    { titleKey: "culturalEvents", categoryKey: "culture", image: "/src/assets/project-3.jpg", link: "/activity/culture" },
    { titleKey: "sportsActivities", categoryKey: "sports", image: "/src/assets/project-1.jpg", link: "/activity/sports" },
    { titleKey: "exhibitions", categoryKey: "exhibition", image: "/src/assets/project-2.jpg", link: "/activity/exhibition" },
    { titleKey: "volunteering", categoryKey: "volunteering", image: "/src/assets/project-3.jpg", link: "/activity/volunteering" },
  ];

  const handlePrevious = () => {
    api?.scrollPrev();
  };

  const handleNext = () => {
    api?.scrollNext();
  };

  useEffect(() => {
    if (!api) {
      return;
    }

    const onSelect = () => {
      setCurrentIndex(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  if (isMobile) {
    // Mobile: Keep carousel with drag function
    return (
      <section id="showcase" className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <span className="text-xs font-semibold tracking-widest uppercase text-primary block mb-4">
              {t('eventsActivitiesBadge')}
            </span>
          </motion.div>

          {/* Carousel */}
          <Carousel
            opts={{
              align: "center",
              loop: true,
            }}
            className="w-full max-w-6xl mx-auto"
            onSelect={(index) => setCurrentIndex(index)}
            setApi={setApi}
          >
            <CarouselContent>
              {items.map((item, index) => (
                <CarouselItem key={index} className="basis-full">
                  <div className="flex justify-center">
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.5, delay: 0.1 }}
                      whileHover={{ y: -8, transition: { duration: 0.2 } }}
                      className="group cursor-pointer w-full max-w-sm"
                      onClick={() => navigate(item.link)}
                    >
                      <div className="relative aspect-[4/5] bg-card rounded-2xl border border-border overflow-hidden mb-4">
                        <img src={item.image} alt={t(item.titleKey)} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/10 group-hover:from-primary/10 group-hover:to-accent/20 transition-all duration-500" />

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                            <ArrowUpRight className="w-5 h-5 text-primary-foreground" />
                          </div>
                        </div>
                      </div>

                      <span className="text-xs text-primary font-medium uppercase tracking-wider">
                        {t(item.categoryKey)}
                      </span>
                      <h3 className="text-lg font-semibold mt-1 group-hover:text-primary transition-colors">
                        {t(item.titleKey)}
                      </h3>
                    </motion.div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Pagination Dots with Arrows */}
          <div className="flex justify-center items-center gap-4 mt-8">
            {/* Left Arrow */}
            <motion.button
              animate={{ x: [-5, 5, -5] }}
              transition={{ duration: 3.5, repeat: Infinity }}
              onClick={handlePrevious}
              className="flex-shrink-0 hover:text-primary transition-colors"
            >
              <ChevronLeft size={24} className="text-white" />
            </motion.button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {items.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    api?.scrollTo(index);
                  }}
                  className={`transition-all duration-300 rounded-full ${
                    currentIndex === index
                      ? "w-3 h-3 bg-white"
                      : "w-2.5 h-2.5 border-2 border-white"
                  }`}
                  aria-label={`Go to activity ${index + 1}`}
                />
              ))}
            </div>

            {/* Right Arrow */}
            <motion.button
              animate={{ x: [5, -5, 5] }}
              transition={{ duration: 3.5, repeat: Infinity }}
              onClick={handleNext}
              className="flex-shrink-0 hover:text-primary transition-colors"
            >
              <ChevronRight size={24} className="text-white" />
            </motion.button>
          </div>
        </div>
      </section>
    );
  }

  // PC: Remove slider, make it go from right to left, make them bigger
  return (
    <section id="showcase" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold tracking-widest uppercase text-primary block mb-4">
            {t('eventsActivitiesBadge')}
          </span>
        </motion.div>

        {/* Grid with right-to-left animation */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {items.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group cursor-pointer"
              onClick={() => navigate(item.link)}
            >
              <div className="relative aspect-[4/5] bg-card rounded-2xl border border-border overflow-hidden mb-4">
                <img src={item.image} alt={t(item.titleKey)} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/10 group-hover:from-primary/10 group-hover:to-accent/20 transition-all duration-500" />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                    <ArrowUpRight className="w-5 h-5 text-primary-foreground" />
                  </div>
                </div>
              </div>

              <span className="text-xs text-primary font-medium uppercase tracking-wider">
                {t(item.categoryKey)}
              </span>
              <h3 className="text-lg font-semibold mt-1 group-hover:text-primary transition-colors">
                {t(item.titleKey)}
              </h3>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ShowcaseGrid;
