import ActivityTemplate from "./ActivityTemplate";
import { useLanguage } from "@/contexts/LanguageContext";

const Volunteering = () => {
  const { t } = useLanguage();

  const activities = [
    {
      name: "Community Clean-Up Initiative",
      description: "Help clean and beautify public spaces while making a positive environmental impact.",
      date: "Every Saturday 9 AM",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
    },
    {
      name: "Youth Mentorship Program",
      description: "Volunteer as a mentor and guide young people through their personal and academic journey.",
      date: "Flexible schedule",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
    },
    {
      name: "Event Support Volunteers",
      description: "Assist in organizing and running MADVERSE events as a volunteer team member.",
      date: "Various event dates",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    },
    {
      name: "Community Outreach Program",
      description: "Engage with underserved communities and help provide resources and support.",
      date: "Ongoing",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
    },
    {
      name: "Arts Education Volunteers",
      description: "Teach and share your artistic skills with students who need support and guidance.",
      date: "Multiple times weekly",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80",
    },
  ];

  return <ActivityTemplate title={t('volunteering')} activities={activities} />;
};

export default Volunteering;
