import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { registrationService, favoriteService, ActivityRegistration } from '@/lib/phase1Service';
import { toast } from '@/hooks/use-toast';
import { Heart, Trash2, Check } from 'lucide-react';

interface ActivityData {
  id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  image: string;
}

// Mock function to get activity data - replace with actual API call
async function getActivityData(activityId: string): Promise<ActivityData> {
  // This should call your actual activity API
  return {
    id: activityId,
    title: 'Activity Title',
    category: 'Category',
    date: new Date().toISOString(),
    location: 'Location',
    image: '/api/placeholder.jpg',
  };
}

export const MyActivitiesSection = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState<ActivityRegistration[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('registered');

  useEffect(() => {
    if (user) {
      loadActivities();
    }
  }, [user]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const regs = await registrationService.getUserRegistrations(user!.id);
      setRegistrations(regs);

      const favs = await favoriteService.getUserFavorites(user!.id);
      setFavorites(favs);
    } catch (error) {
      console.error('Error loading activities:', error);
      toast({
        title: 'Error',
        description: 'Failed to load activities',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (activityId: string) => {
    try {
      await favoriteService.removeFavorite(user!.id, activityId);
      setFavorites(favorites.filter((id) => id !== activityId));
      toast({ description: 'Removed from favorites' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove favorite',
        variant: 'destructive',
      });
    }
  };

  const handleCancelRegistration = async (activityId: string) => {
    try {
      await registrationService.cancelRegistration(user!.id, activityId);
      setRegistrations(registrations.filter((reg) => reg.activity_id !== activityId));
      toast({ description: 'Registration cancelled' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to cancel registration',
        variant: 'destructive',
      });
    }
  };

  const handleMarkComplete = async (activityId: string) => {
    try {
      await registrationService.markActivityCompleted(user!.id, activityId);
      await loadActivities();
      toast({ description: 'Activity marked as completed' });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to mark activity complete',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>My Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="registered">
              Registered ({registrations.filter((r) => r.status === 'registered').length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({registrations.filter((r) => r.status === 'completed').length})
            </TabsTrigger>
            <TabsTrigger value="favorites">Favorites ({favorites.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="registered" className="space-y-4">
            {registrations.filter((r) => r.status === 'registered').length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No registered activities yet. Start exploring!
              </p>
            ) : (
              registrations
                .filter((r) => r.status === 'registered')
                .map((registration) => (
                  <div key={registration.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold">{registration.activity_id}</h4>
                      <p className="text-sm text-muted-foreground">
                        Registered on {new Date(registration.registered_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleMarkComplete(registration.activity_id)}
                        size="sm"
                        variant="outline"
                      >
                        <Check size={16} /> Mark Done
                      </Button>
                      <Button
                        onClick={() => handleCancelRegistration(registration.activity_id)}
                        size="sm"
                        variant="destructive"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ))
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {registrations.filter((r) => r.status === 'completed').length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No completed activities yet.</p>
            ) : (
              registrations
                .filter((r) => r.status === 'completed')
                .map((registration) => (
                  <div key={registration.id} className="flex items-center justify-between p-4 border border-border rounded-lg bg-green-50 dark:bg-green-950/20">
                    <div className="flex-1">
                      <h4 className="font-semibold">{registration.activity_id}</h4>
                      <p className="text-sm text-muted-foreground">
                        Completed on {new Date(registration.completed_at || '').toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-green-600 font-semibold flex items-center gap-1">
                      <Check size={20} /> ✓
                    </div>
                  </div>
                ))
            )}
          </TabsContent>

          <TabsContent value="favorites" className="space-y-4">
            {favorites.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No favorite activities yet. Start saving your favorites!
              </p>
            ) : (
              favorites.map((activityId) => (
                <div key={activityId} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-semibold">{activityId}</h4>
                    <p className="text-sm text-muted-foreground">Added to favorites</p>
                  </div>
                  <Button
                    onClick={() => handleRemoveFavorite(activityId)}
                    size="sm"
                    variant="outline"
                    className="text-red-600"
                  >
                    <Heart size={16} fill="currentColor" /> Remove
                  </Button>
                </div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MyActivitiesSection;
