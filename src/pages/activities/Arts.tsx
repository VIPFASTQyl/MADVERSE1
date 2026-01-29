import ActivityTemplate from "./ActivityTemplate";
import { useLanguage } from "@/contexts/LanguageContext";

const Arts = () => {
  const { t } = useLanguage();

  const activities = [
    {
      name: "Contemporary Art Exhibition",
      description: "Discover works from emerging and established local artists showcasing diverse artistic visions and techniques.",
      date: "January 25 - February 28, 2026",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
    },
    {
      name: "Painting & Drawing Workshops",
      description: "Learn fundamental and advanced techniques in painting and drawing from professional artists.",
      date: "Every Wednesday 6-8 PM",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
    },
    {
      name: "Digital Art Masterclass",
      description: "Explore digital illustration, graphic design, and animation with industry experts.",
      date: "March 1 - April 15, 2026",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    },
    {
      name: "Street Art Festival",
      description: "Witness and participate in collaborative street art projects that transform urban spaces into galleries.",
      date: "May 10-12, 2026",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
    },
    {
      name: "Sculpture & 3D Art Workshop",
      description: "Create stunning sculptural pieces using various materials and 3D modeling techniques.",
      date: "April 5 - May 17, 2026",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
    },
  ];

  return <ActivityTemplate title={t('arts')} activities={activities} />;
};

export default Arts;
