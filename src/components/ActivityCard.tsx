import { useState, useEffect } from 'react';
import { Heart, Users, MapPin, Calendar, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { favoriteService, registrationService } from '@/lib/phase1Service';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface ActivityCardProps {
  id: string;
  title: string;
  category: string;
  date: string;
  location: string;
  participants: number;
  maxParticipants: number;
  image: string;
  description?: string;
  onRegisterSuccess?: () => void;
  onParticipantsChange?: (newCount: number) => void;
}

export const ActivityCard = ({
  id,
  title,
  category,
  date,
  location,
  participants,
  maxParticipants,
  image,
  description,
  onRegisterSuccess,
  onParticipantsChange,
}: ActivityCardProps) => {
  const { user } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentParticipants, setCurrentParticipants] = useState(participants);

  useEffect(() => {
    if (user) {
      checkStatus();
    }
  }, [user, id]);

  const checkStatus = async () => {
    try {
      const favorited = await favoriteService.isFavorited(user!.id, id);
      setIsFavorited(favorited);

      const registered = await registrationService.isRegistered(user!.id, id);
      setIsRegistered(registered);
    } catch (error) {
      console.error('Error checking status:', error);
    }
  };

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please log in to save favorites',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      if (isFavorited) {
        await favoriteService.removeFavorite(user.id, id);
        setIsFavorited(false);
        toast({ description: 'Removed from favorites' });
      } else {
        await favoriteService.addFavorite(user.id, id);
        setIsFavorited(true);
        toast({ description: 'Added to favorites' });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: 'Error',
        description: 'Failed to update favorite',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: 'Login Required',
        description: 'Please log in to register for activities',
        variant: 'destructive',
      });
      return;
    }

    try {
      setLoading(true);
      if (isRegistered) {
        await registrationService.cancelRegistration(user.id, id);
        setIsRegistered(false);
        const newCount = currentParticipants - 1;
        setCurrentParticipants(newCount);
        onParticipantsChange?.(newCount);
        toast({ description: 'Registration cancelled' });
      } else {
        // Allow registration without requiring profile completion
        await registrationService.registerForActivity(user.id, id);
        setIsRegistered(true);
        const newCount = currentParticipants + 1;
        setCurrentParticipants(newCount);
        onParticipantsChange?.(newCount);
        toast({ description: 'Successfully registered for activity' });
        onRegisterSuccess?.();
      }
    } catch (error) {
      console.error('Error registering:', error);
      toast({
        title: 'Error',
        description: 'Failed to update registration. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow border-border">
      <div className="relative overflow-hidden h-48">
        <img src={image} alt={title} className="w-full h-full object-cover hover:scale-105 transition-transform" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute top-3 left-3">
          <span className="bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded">
            {category}
          </span>
        </div>
        <button
          onClick={handleFavorite}
          disabled={loading}
          className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full transition-colors"
        >
          <Heart size={20} className={isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'} />
        </button>
      </div>

      <CardContent className="p-4">
        <h3 className="text-lg font-bold mb-2 line-clamp-2">{title}</h3>
        {description && <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{description}</p>}

        <div className="space-y-2 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar size={16} />
            <span>{new Date(date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={16} />
            <span>{location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={16} />
            <span>{currentParticipants}/{maxParticipants} participants</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleRegister}
            disabled={loading}
            variant={isRegistered ? 'outline' : 'default'}
            className="flex-1"
          >
            {isRegistered ? 'Registered' : 'Register Now'}
          </Button>
          {isRegistered && (
            <div className="flex items-center gap-1 px-2 text-green-600 text-sm font-medium">
              <Zap size={16} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityCard;
