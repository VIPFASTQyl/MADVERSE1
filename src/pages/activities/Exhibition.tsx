import ActivityTemplate from "./ActivityTemplate";
import { useLanguage } from "@/contexts/LanguageContext";

const Exhibition = () => {
  const { t } = useLanguage();

  const activities = [
    {
      name: "Emerging Artists Showcase",
      description: "A dedicated exhibition platform for up-and-coming artists to display their innovative work.",
      date: "January 20 - February 15, 2026",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
    },
    {
      name: "Contemporary Art Biennial",
      description: "A major exhibition celebrating contemporary art movements and artistic trends.",
      date: "March 1 - April 30, 2026",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
    },
    {
      name: "Photography Exhibition",
      description: "Explore stunning photographs capturing moments from around the world.",
      date: "May 10 - June 10, 2026",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    },
    {
      name: "Digital Art & Design Expo",
      description: "Experience cutting-edge digital art, graphic design, and multimedia creations.",
      date: "June 20 - July 20, 2026",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
    },
    {
      name: "Youth Artist Exhibition",
      description: "A celebration of young talented artists presenting their creative visions.",
      date: "July 25 - August 25, 2026",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
    },
  ];

  return <ActivityTemplate title={t('exhibition')} activities={activities} />;
};

export default Exhibition;
