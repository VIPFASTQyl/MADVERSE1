import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";

interface ActivityItem {
  name: string;
  description: string;
  date: string;
  image: string;
}

interface ActivityPageProps {
  title: string;
  activities: ActivityItem[];
}

const ActivityTemplate = ({ title, activities }: ActivityPageProps) => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-left mb-16"
        >
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">{title}</h1>
        </motion.div>

        <div className="space-y-16 divide-y divide-white/20">
          {activities.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`grid lg:grid-cols-2 gap-8 items-center ${
                index % 2 === 1 ? "lg:grid-cols-2" : "lg:grid-cols-2"
              } ${index !== 0 ? "pt-16" : ""}`}
            >
              {/* Image */}
              <div
                className={`${
                  index % 2 === 1 ? "lg:order-2" : "lg:order-1"
                } aspect-video bg-secondary/50 overflow-hidden`}
              >
                <img
                  src={activity.image}
                  alt={activity.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Text */}
              <div
                className={`${
                  index % 2 === 1 ? "lg:order-1" : "lg:order-2"
                } space-y-4`}
              >
                <h2 className="text-3xl lg:text-4xl font-bold">{activity.name}</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {activity.description}
                </p>
                <p className="text-sm font-semibold text-primary">{activity.date}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ActivityTemplate;
