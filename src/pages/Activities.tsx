import { useEffect, useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ActivityCard from '@/components/ActivityCard';
import { historyService } from '@/lib/phase1Service';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { getAllActivities, Activity } from '@/lib/activityService';
import { supabase } from '@/lib/supabaseClient';
import { Loader2 } from 'lucide-react';

const ACTIVITY_CATEGORIES = ['Arts', 'Culture', 'Sports', 'Volunteering', 'Youth', 'Exhibition'];

export default function Activities() {
  const { user } = useAuth();
  const { t, language } = useLanguage();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Load activities from database
  useEffect(() => {
    const loadActivities = async () => {
      setLoading(true);
      const data = await getAllActivities();
      // Filter by current language
      const filtered = data.filter((activity: Activity) => activity.language === language);
      setActivities(filtered);
      setLoading(false);
    };
    loadActivities();

    // Subscribe to real-time changes in activity_content table
    const subscription = supabase
      .channel('activity_updates')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'activity_content' },
        (payload: any) => {
          console.log('Real-time update received:', payload);
          // Update the participant count in real-time
          setActivities((prev) =>
            prev.map((activity) =>
              activity.id === payload.new.id
                ? {
                    ...activity,
                    current_participants: payload.new.current_participants || 0,
                  }
                : activity
            )
          );
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [language]);

  // Filter activities by selected category
  const displayedActivities =
    selectedCategory === null
      ? activities
      : activities.filter((activity) => activity.category === selectedCategory);

  const handleActivityView = async (activityId: string) => {
    if (user) {
      await historyService.trackAction(user.id, activityId, 'viewed');
    }
  };

  const handleRegisterSuccess = () => {
    // Activities will update in real-time via subscription
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <div className="flex-1 mt-16">
        <div className="container mx-auto max-w-7xl py-10 px-4">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">{t('registerAProgram')}</h1>
            <p className="text-lg text-muted-foreground">
              {t('discoverExcitingPrograms')}
            </p>
          </div>

          {/* Category Filter */}
          <Card className="mb-8 p-6 border-border">
            <h2 className="text-lg font-semibold mb-4">{t('filterByCategory')}</h2>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => setSelectedCategory(null)}
                variant={selectedCategory === null ? 'default' : 'outline'}
                className="rounded-full"
              >
                {t('allPrograms')}
              </Button>
              {ACTIVITY_CATEGORIES.map((category) => (
                <Button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  className="rounded-full"
                >
                  {category}
                </Button>
              ))}
            </div>
          </Card>

          {/* Activities Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : displayedActivities.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedActivities.map((activity) => (
                <div
                  key={activity.id}
                  onClick={() => handleActivityView(activity.id)}
                  className="cursor-pointer"
                >
                  <ActivityCard
                    id={activity.id}
                    title={activity.title}
                    category={activity.category}
                    date={activity.date_time || ''}
                    location={activity.location || ''}
                    participants={activity.current_participants || 0}
                    maxParticipants={activity.max_participants || 50}
                    image={activity.image_url || ''}
                    description={activity.description}
                    onRegisterSuccess={() => handleRegisterSuccess()}
                    onParticipantsChange={(newCount) => {
                      setActivities((prev) =>
                        prev.map((act) =>
                          act.id === activity.id
                            ? { ...act, current_participants: newCount }
                            : act
                        )
                      );
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground">
                No programs found in this category. Try selecting a different category!
              </p>
            </div>
          )}

          {/* Activity Count */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground">
              Showing {displayedActivities.length} of {activities.length} programs
              {selectedCategory && ` in ${selectedCategory}`}
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
