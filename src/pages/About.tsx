import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { useLanguage } from "../contexts/LanguageContext";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const About = () => {
  const { t } = useLanguage();

  const teamMembers = [
    { 
      nameKey: "klest", 
      titleKey: "klestDesc",
      titleKeyAbout: "klestTitleAbout",
      descKeyAbout: "klestDescAbout",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"
    },
    { 
      nameKey: "guri", 
      titleKey: "guriDesc",
      titleKeyAbout: "guriTitleAbout",
      descKeyAbout: "guriDescAbout",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80"
    },
    { 
      nameKey: "erion", 
      titleKey: "erionDesc",
      titleKeyAbout: "erionTitleAbout",
      descKeyAbout: "erionDescAbout",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80"
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* What is Madverse Section */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl lg:text-5xl font-bold mb-8 text-left">
              {t('whatIsMadverse')}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 text-left">
              {t('whatIsMadverseDescAbout')}
            </p>
            <div className="w-full h-px bg-white mb-16"></div>
          </motion.div>
        </div>
      </section>

      {/* Culture You Can Feel and Interact Section */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-8 text-left">
              {t('feelCulture')}
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 text-left whitespace-pre-line">
              {t('feelCultureDetail')}
            </p>
            <div className="w-full h-px bg-white mb-16"></div>
          </motion.div>
        </div>
      </section>

      {/* Team Members Section */}
      <section className="py-24 lg:py-32 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold text-left">
              {t('ourTeam')}
            </h2>
          </motion.div>

          <div className="space-y-24">
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="max-w-3xl"
              >
                <h3 className="text-3xl lg:text-4xl font-bold mb-6 text-left">
                  {t(member.nameKey)}
                </h3>
                <h4 className="text-xl lg:text-2xl font-semibold mb-4 text-primary">
                  {t(member.titleKeyAbout)}
                </h4>
                <p className="text-lg text-muted-foreground leading-relaxed mb-8 text-left">
                  {t(member.descKeyAbout)}
                </p>
                <Link to="/contact">
                  <Button variant="heroOutline" className="group">
                    {t('contactUs')}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <div className="w-full h-px bg-white my-16"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
