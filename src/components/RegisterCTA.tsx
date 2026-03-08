import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { getAllActivities, getTotalRegisteredMembers } from "@/lib/activityService";
import { supabase } from "@/lib/supabaseClient";

const RegisterCTA = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [totalMembers, setTotalMembers] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Get total registered members
        const members = await getTotalRegisteredMembers();
        setTotalMembers(members);

        // For "Active Members", use the same as total members (registered users are active)
        // Both counters now show the number of registered members
        setTotalParticipants(members);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    // Fetch stats immediately
    fetchStats();

    // Set up real-time subscription to activity_registrations table
    const subscription = supabase
      .channel("activity_registrations_channel")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to INSERT, UPDATE, DELETE
          schema: "public",
          table: "activity_registrations",
        },
        (payload: any) => {
          // When a change happens, refresh stats immediately
          console.log("🔔 Registration change detected, updating stats...");
          fetchStats();
        }
      )
      .subscribe();

    // Also set up a fallback interval refresh every 5 seconds (in case subscription misses something)
    const interval = setInterval(fetchStats, 5000);

    // Cleanup
    return () => {
      subscription.unsubscribe();
      clearInterval(interval);
    };
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
                {language === "en" ? "Join MADVERSE Today" : "Bashkohuni me MADVERSE Sot"}
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
                ? "Register to Never Miss an Activity"
                : "Regjistrohu për të Mos Humbur Aktivitete"}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto"
            >
              {language === "en"
                ? "Register with us to stay updated on all our amazing activities, exclusive events, and community updates. If you're a sponsor interested in partnering with MADVERSE, we'd love to hear from you!"
                : "Regjistrohu me ne për të mbetur i përditësuar në të gjitha aktivitetet tona, ngjarjet ekskluzive dhe përditësimet e komunitetit. Nëse jeni sponsor i interesuar të partnerizoheni me MADVERSE, do të donim të dëgjonim nga ju!"}
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
                onClick={() => navigate("/contact")}
                className="group px-8 py-4 border border-primary hover:bg-primary/10 text-primary rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 hover:gap-3"
              >
                {language === "en" ? "Become Our Sponsor!" : "Bëhuava Sponsor Ynë!"}
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
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
                <div className="text-3xl font-bold text-primary mb-2">{totalMembers}</div>
                <p className="text-sm text-muted-foreground">
                  {language === "en" ? "Total Members" : "Anëtarë Totalë"}
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
