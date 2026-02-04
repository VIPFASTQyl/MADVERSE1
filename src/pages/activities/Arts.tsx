import ActivityTemplate from "./ActivityTemplate";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";
import { getActivityContentByType } from "@/lib/contentService";

const Arts = () => {
  const { t, language } = useLanguage();
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const data = await getActivityContentByType("arts", language);
        setActivities(data || []);
      } catch (error) {
        console.error("Error fetching arts activities:", error);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [language]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  const formattedActivities = activities.map((item) => ({
    name: item.item_name,
    description: item.description,
    date: item.date,
    image: item.image_url || "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
    link_url: item.link_url,
  }));

  return <ActivityTemplate title={t('arts')} activities={formattedActivities} hideDots />;
};

export default Arts;
