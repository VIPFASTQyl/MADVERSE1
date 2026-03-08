import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { getTotalRegisteredMembers, debugCheckRegistrations } from "@/lib/activityService";
import { trackActiveSession, getActiveSessionsCount, cleanupOldSessions } from "@/lib/sessionService";
import { supabase } from "@/lib/supabaseClient";

const RegisterCTA = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [totalMembers, setTotalMembers] = useState(0);

  useEffect(() => {
    // Expose cleanup function to browser console for debugging
    (window as any).debugCleanupSessions = cleanupOldSessions;
    (window as any).debugCheckRegistrations = debugCheckRegistrations;
    let isActive = true;

    const fetchStats = async () => {
      if (!isActive) return;
      
      try {
        // Track that this user is currently online
        await trackActiveSession();

        // Get active sessions (users online in last 5 minutes)
        const activeSessions = await getActiveSessionsCount();
        if (isActive) setTotalParticipants(activeSessions);

        // Get total registered members
        const members = await getTotalRegisteredMembers();
        if (isActive) setTotalMembers(members);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    // Fetch stats immediately on mount
    fetchStats();

    // Poll every 5 seconds for faster updates
    const sessionInterval = setInterval(fetchStats, 5000);

    // Set up real-time subscription to active_sessions table for instant updates
    const sessionsSubscription = supabase
      .channel("active_sessions_" + Date.now())
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "active_sessions",
        },
        () => {
          if (isActive) {
            getActiveSessionsCount().then(count => {
              if (isActive) setTotalParticipants(count);
            });
          }
        }
      )
      .subscribe();

    // Set up real-time subscription to activity_registrations table for instant updates
    const registrationsSubscription = supabase
      .channel("registrations_" + Date.now())
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "activity_registrations",
        },
        () => {
          if (isActive) {
            getTotalRegisteredMembers().then(count => {
              if (isActive) setTotalMembers(count);
            });
          }
        }
      )
      .subscribe();

    // Cleanup
    return () => {
      isActive = false;
      clearInterval(sessionInterval);
      sessionsSubscription.unsubscribe();
      registrationsSubscription.unsubscribe();
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
                  {language === "en" ? "Total Registered Members" : "Anëtarë të Regjistruar Totale"}
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
