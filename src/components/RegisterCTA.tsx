import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { getAllActivities } from "@/lib/activityService";

const RegisterCTA = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [totalPrograms, setTotalPrograms] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const activities = await getAllActivities();
        setTotalPrograms(activities.length);
        
        // Calculate total participants
        const total = activities.reduce(
          (sum, activity) => sum + (activity.current_participants || 0),
          0
        );
        setTotalParticipants(total);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <section className="relative py-24 lg:py-32 bg-gradient-to-b from-background to-background/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl border border-border/50 bg-gradient-to-br from-primary/5 to-accent/5 p-12 md:p-20 text-center overflow-hidden"
        >
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -ml-48 -mb-48" />

          {/* Content */}
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="inline-block text-xs font-semibold tracking-widest uppercase text-primary mb-6">
                {language === "en" ? "Join Our Community" : "Bashkohuni me Komunitetin Tonë"}
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent"
            >
              {language === "en"
                ? "Create Your MADVERSE PROFILE"
                : "Krijo Profilin Tuaj në MADVERSE"}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto"
            >
              {language === "en"
                ? "Register with MADVERSE to unlock your access. Once registered, you can explore and enroll in our programs, participate in cultural events, and connect with thousands of community members."
                : "Regjistrohu me MADVERSE për të hyrë brenda. Pasi të regjistrohesh, mund të eksplorosh dhe të regjistrohet në programet tona, të marrësh pjesë në ngjarjet kulturore dhe të lidhesh me mijëra anëtarë të komunitetit."}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <button
                onClick={() => navigate("/signup")}
                className="group px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 hover:gap-3"
              >
                {language === "en" ? "Register Now" : "Regjistrohu Tani"}
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>

              <button
                onClick={() => navigate("/activities")}
                className="px-8 py-4 border border-primary/50 hover:border-primary/100 text-foreground rounded-lg font-semibold transition-all duration-300 hover:bg-primary/5"
              >
                {language === "en" ? "Explore Programs" : "Eksploroni Programet"}
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="grid grid-cols-2 gap-8 mt-16 pt-8 border-t border-border/30"
            >
              <div>
                <div className="text-3xl font-bold text-primary mb-2">
                  {totalParticipants > 0 ? totalParticipants.toLocaleString() : "0"}
                </div>
                <p className="text-sm text-muted-foreground">
                  {language === "en" ? "Active Members" : "Anëtarë Aktivë"}
                </p>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">{totalPrograms}</div>
                <p className="text-sm text-muted-foreground">
                  {language === "en" ? "Programs" : "Programet"}
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default RegisterCTA;
