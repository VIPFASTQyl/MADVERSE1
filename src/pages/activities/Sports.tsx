import ActivityTemplate from "./ActivityTemplate";
import { useLanguage } from "@/contexts/LanguageContext";

const Sports = () => {
  const { t } = useLanguage();

  const activities = [
    {
      name: "Community Football League",
      description: "Join teams in a competitive yet friendly football league promoting teamwork and athletic development.",
      date: "March - June 2026",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
    },
    {
      name: "Basketball Tournament",
      description: "Compete in our annual basketball tournament featuring various age groups and skill levels.",
      date: "April 5-20, 2026",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
    },
    {
      name: "Fitness & Wellness Classes",
      description: "Participate in yoga, pilates, CrossFit, and other fitness programs for all levels.",
      date: "Year-round, Multiple times weekly",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    },
    {
      name: "Trail Running & Hiking Events",
      description: "Explore nature while staying active through organized running and hiking adventures.",
      date: "Every other Saturday",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
    },
    {
      name: "Tennis Championship",
      description: "Compete in singles and doubles matches in our annual tennis championship.",
      date: "May 1-31, 2026",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
    },
  ];

  return <ActivityTemplate title={t('sports')} activities={activities} />;
};

export default Sports;
