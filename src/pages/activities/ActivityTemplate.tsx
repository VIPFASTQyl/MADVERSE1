import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ActivityItem {
  name: string;
  description: string;
  date: string;
  image: string;
  link_url?: string;
}

interface ActivityPageProps {
  title: string;
  activities: ActivityItem[];
  hideDots?: boolean;
}

const ActivityTemplate = ({ title, activities, hideDots = false }: ActivityPageProps) => {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    const element = document.getElementById(`activity-${index}`);
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-24 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-left mb-8 sm:mb-12 md:mb-14 lg:mb-16"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 sm:mb-3 md:mb-4">
            {title}
          </h1>
        </motion.div>

        <div className="space-y-12 sm:space-y-14 md:space-y-16 lg:space-y-16 divide-y divide-white/20">
          {activities.map((activity, index) => (
            <motion.div
              key={index}
              id={`activity-${index}`}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              onViewportEnter={() => setCurrentIndex(index)}
              className={`grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-center ${
                index !== 0 ? "pt-12 sm:pt-14 md:pt-16 lg:pt-16" : ""
              }`}
            >
              {/* Image */}
              <div
                className={`${
                  index % 2 === 1 ? "md:order-2" : "md:order-1"
                } aspect-video bg-secondary/50 overflow-hidden rounded-lg`}
              >
                <img
                  src={activity.image}
                  alt={activity.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Text */}
              <div
                className={`${
                  index % 2 === 1 ? "md:order-1" : "md:order-2"
                } space-y-3 sm:space-y-4 md:space-y-5`}
              >
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
                  {activity.name}
                </h2>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
                  {activity.description}
                </p>
                <p className="text-xs sm:text-sm font-semibold text-primary">
                  {activity.date}
                </p>
                
                {activity.link_url && (
                  <div className="pt-2 sm:pt-3 md:pt-4">
                    <a
                      href={activity.link_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block"
                    >
                      <Button 
                        variant="heroOutline" 
                        className="group hover:bg-transparent text-sm sm:text-base"
                      >
                        Visit
                        <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Pagination Dots */}
        {!hideDots && (
          <div className="flex md:hidden justify-center items-center gap-2 mt-12">
            {activities.map((_, index) => (
              <button
                key={index}
                onClick={() => handleDotClick(index)}
                className={`transition-all duration-300 rounded-full ${
                  currentIndex === index
                    ? "w-3 h-3 bg-white"
                    : "w-2.5 h-2.5 border-2 border-white"
                }`}
                aria-label={`Go to activity ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ActivityTemplate;
