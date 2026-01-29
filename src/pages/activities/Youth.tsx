import ActivityTemplate from "./ActivityTemplate";
import { useLanguage } from "@/contexts/LanguageContext";

const Youth = () => {
  const { t } = useLanguage();

  const activities = [
    {
      name: "Youth Leadership Workshop",
      description: "An intensive workshop designed to develop leadership skills and inspire young leaders to make a positive impact in their communities.",
      date: "February 15, 2026",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
    },
    {
      name: "Creative Expression Camp",
      description: "A dynamic summer camp where youth explore their creativity through art, music, dance, and digital media.",
      date: "June 20 - July 10, 2026",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
    },
    {
      name: "Youth Mentorship Program",
      description: "Connect with experienced mentors who guide you through personal development, career planning, and life skills.",
      date: "Ongoing",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    },
    {
      name: "Digital Innovation Series",
      description: "Learn cutting-edge digital skills including coding, web design, and digital marketing from industry professionals.",
      date: "March - May 2026",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
    },
    {
      name: "Community Service Initiative",
      description: "Engage in meaningful volunteer work that strengthens your community and develops your sense of social responsibility.",
      date: "Every Saturday",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
    },
  ];

  return <ActivityTemplate title={t('youth')} activities={activities} />;
};

export default Youth;
