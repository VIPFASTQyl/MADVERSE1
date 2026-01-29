import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "../contexts/LanguageContext";

const tabs = [
  { id: "tab1", label: "Klest Drançolli", description: "Age: 20 | Klest is the Founder of madverse, leading our vision and driving innovation across all operations.", buttonLabel: "About", buttonLink: "/about" },
  { id: "tab2", label: "Guri Gacaferi", description: "Age: 21 | Guri is the Finance Administrator of madverse, managing our financial operations and ensuring sustainable growth.", buttonLabel: "About", buttonLink: "/about" },
  { id: "tab3", label: "Erion Gashi", description: "Age: 20 | Erion is our Researcher, exploring emerging technologies and discovering new opportunities to push madverse forward.", buttonLabel: "About", buttonLink: "/about" },
  { id: "tab4", label: "Join Madverse", description: "If you have the skills and passion to join and contribute, feel free to sign up and be part of our growing team!", buttonLabel: "Join us!", buttonLink: "/contact" },
  { id: "tab5", label: "Join Madverse", description: "If you have the skills and passion to join and contribute, feel free to sign up and be part of our growing team!", buttonLabel: "Join us!", buttonLink: "/contact" },
];

const TabsSection = () => {
  const [activeTab, setActiveTab] = useState("tab1");
  const { t } = useLanguage();

  const tabs = [
    { id: "tab1", labelKey: "klest", descKey: "klestDesc", buttonLabelKey: "about", buttonLink: "/about" },
    { id: "tab2", labelKey: "guri", descKey: "guriDesc", buttonLabelKey: "about", buttonLink: "/about" },
    { id: "tab3", labelKey: "erion", descKey: "erionDesc", buttonLabelKey: "about", buttonLink: "/about" },
    { id: "tab4", labelKey: "joinMadverse", descKey: "joinDesc", buttonLabelKey: "joinUs", buttonLink: "/contact" },
    { id: "tab5", labelKey: "joinMadverse", descKey: "joinDesc", buttonLabelKey: "joinUs", buttonLink: "/contact" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab((prevTab) => {
        const currentIndex = tabs.findIndex(tab => tab.id === prevTab);
        const nextIndex = (currentIndex + 1) % tabs.length;
        return tabs[nextIndex].id;
      });
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 lg:py-32 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="text-xs font-semibold tracking-widest uppercase text-primary block mb-4">
             {t('madverseMembers')} 
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            {t('ourTeam')}
          </h2>
        </motion.div>

        {/* Tab Buttons */}
        <motion.div
        
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center gap-4 mb-12"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-white"
                  : "bg-black border-2 border-white"
              }`}
            />
          ))}
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-card rounded-2xl border border-border p-8 lg:p-12"
        >
          <div className="grid lg:grid-cols-2 gap-8 items-center h-96">
            <div className="space-y-6 flex flex-col h-full">
              <h3 className="text-2xl lg:text-3xl font-bold">
                {t(tabs.find(tab => tab.id === activeTab)?.labelKey || "")}
              </h3>
              <p className="text-muted-foreground flex-grow">
                {t(tabs.find(tab => tab.id === activeTab)?.descKey || "")}
              </p>
              <div className="pt-4 lg:pt-12">
                <Link to={tabs.find(t => t.id === activeTab)?.buttonLink || "/"}>
                  <Button variant="heroOutline" className="group hover:bg-transparent">
                    {tabs.find(t => t.id === activeTab)?.id === "tab4" || tabs.find(t => t.id === activeTab)?.id === "tab5" 
                      ? t(tabs.find(t => t.id === activeTab)?.buttonLabelKey || "")
                      : `${t(tabs.find(t => t.id === activeTab)?.buttonLabelKey || "")} ${t(tabs.find(tab => tab.id === activeTab)?.labelKey || "")}`}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="aspect-video bg-secondary/50 rounded-xl overflow-hidden">
              <img 
                src={`https://images.unsplash.com/photo-${
                  activeTab === "tab1" ? "1507003211169-0a1dd7228f2d" :
                  activeTab === "tab2" ? "1552664730-d307ca884978" :
                  activeTab === "tab3" ? "1517694712202-14dd9538aa97" :
                  "1552664730-d307ca884978"
                }?w=800&q=80`}
                alt={tabs.find(t => t.id === activeTab)?.label}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TabsSection;