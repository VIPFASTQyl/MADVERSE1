import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface FeatureSectionProps {
  badge: string;
  title: string;
  description: string;
  reversed?: boolean;
  image?: string;
}

const FeatureSection = ({ badge, title, description, reversed = false, image }: FeatureSectionProps) => {
  const { t } = useLanguage();

  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${reversed ? 'lg:flex-row-reverse' : ''}`}>
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: reversed ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className={`space-y-6 ${reversed ? 'lg:order-2' : ''}`}
          >
            <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary">
              {badge}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              {title}
            </h2>
            <p className="text-lg text-muted-foreground max-w-md">
              {description}
            </p>
            <Link to="/about" className="mt-4 block">
              <Button variant="heroOutline" className="group hover:bg-transparent">
                {t('about')}
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>

          {/* Image Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: reversed ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className={`${reversed ? 'lg:order-1' : ''}`}
          >
            <div className="relative aspect-[4/3] bg-card rounded-2xl border border-border overflow-hidden">
              {image ? (
                <img src={image} alt={title} className="w-full h-full object-cover" />
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
                  <div className="absolute inset-4 bg-secondary/50 rounded-lg" />
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;