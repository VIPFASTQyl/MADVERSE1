import { useState, useEffect } from 'react';
import { Users, MapPin, Calendar, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { registrationService } from '@/lib/phase1Service';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
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
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentParticipants, setCurrentParticipants] = useState(participants);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    // Check if user has Supabase auth OR localStorage registration
    checkStatus();
    checkProfileStatus();
  }, [user, id]);

  const checkProfileStatus = () => {
    const registrationId = localStorage.getItem('registrationId');
    setHasProfile(!!registrationId);
  };

  const checkStatus = async () => {
    try {
      // Check Supabase auth status
      if (user) {
        const registered = await registrationService.isRegistered(user.id, id);
        setIsRegistered(registered);
      } else {
        // Check localStorage registration status
        const registrationId = localStorage.getItem('registrationId');
        if (registrationId) {
          const { data } = await supabase
            .from('activity_registrations')
            .select('id')
            .eq('registration_id', registrationId)
            .eq('activity_id', id)
            .maybeSingle();
          setIsRegistered(!!data);
        }
      }
    } catch (error) {
      console.error('Error checking status:', error);
    }
  };

  const handleRegister = async (e: React.MouseEvent) => {
    e.preventDefault();

    // Check for either Supabase auth or localStorage registration
    const registrationId = localStorage.getItem('registrationId');
    if (!user && !registrationId) {
      toast({
        title: t('registrationRequired'),
        description: t('registerFirstToJoin'),
        variant: 'destructive',
      });
      navigate('/register');
      return;
    }

    try {
      setLoading(true);
      
      if (isRegistered) {
        // Unregister from activity
        if (user) {
          await registrationService.cancelRegistration(user.id, id);
        } else if (registrationId) {
          await supabase
            .from('activity_registrations')
            .delete()
            .eq('registration_id', registrationId)
            .eq('activity_id', id);
        }
        setIsRegistered(false);
        const newCount = currentParticipants - 1;
        setCurrentParticipants(newCount);
        onParticipantsChange?.(newCount);
        toast({ description: t('unregisteredFromActivity') });
      } else {
        // Register for activity
        if (currentParticipants >= maxParticipants) {
          toast({
            title: t('activityFull'),
            description: t('activityFullDesc'),
            variant: 'destructive',
          });
          return;
        }

        if (user) {
          await registrationService.registerForActivity(user.id, id);
        } else if (registrationId) {
          await supabase
            .from('activity_registrations')
            .insert({
              registration_id: registrationId,
              activity_id: id,
              activity_title: title,
              activity_category: category,
              activity_date: date,
              activity_location: location,
            });
        }

        setIsRegistered(true);
        const newCount = currentParticipants + 1;
        setCurrentParticipants(newCount);
        onParticipantsChange?.(newCount);
        toast({ description: t('registrationSuccess') });
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
            <span>{currentParticipants}/{maxParticipants} {t('participants')}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleRegister}
            disabled={loading}
            variant={isRegistered ? 'outline' : 'default'}
            className="flex-1"
          >
            {isRegistered ? t('registered') : t('registerNow')}
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
