import ActivityTemplate from "./ActivityTemplate";
import { useLanguage } from "@/contexts/LanguageContext";

const Culture = () => {
  const { t } = useLanguage();

  const activities = [
    {
      name: "Traditional Music Festival",
      description: "Experience authentic performances from local musicians celebrating traditional and contemporary sounds.",
      date: "February 1-3, 2026",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
    },
    {
      name: "Dance Workshop Series",
      description: "Learn traditional and modern dance forms from skilled choreographers and cultural experts.",
      date: "Every Friday 7-9 PM",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
    },
    {
      name: "Cultural Heritage Exhibition",
      description: "Explore displays showcasing the rich history, crafts, and traditions of our community.",
      date: "March 15 - April 15, 2026",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    },
    {
      name: "Food & Culinary Celebration",
      description: "Taste traditional dishes and learn about cultural cuisine through cooking demonstrations and tasting events.",
      date: "April 10, 2026",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
    },
    {
      name: "Language & Literature Festival",
      description: "Celebrate storytelling, poetry, and literature through readings, workshops, and cultural discussions.",
      date: "May 20-22, 2026",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
    },
  ];

  return <ActivityTemplate title={t('culture')} activities={activities} />;
};

export default Culture;
