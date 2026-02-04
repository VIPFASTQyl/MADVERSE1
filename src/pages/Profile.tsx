import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { profileService, UserProfile, registrationService, historyService } from '@/lib/phase1Service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { LogOut, Mail, Github } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const ACTIVITY_CATEGORIES = ['Arts', 'Culture', 'Sports', 'Volunteering', 'Youth', 'Exhibition'];

const Profile = () => {
  const { session, signOut, user } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const editFormRef = useRef<HTMLDivElement>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [registrations, setRegistrations] = useState<number>(0);
  const [activityStats, setActivityStats] = useState<any>(null);

  const [formData, setFormData] = useState({
    full_name: '',
    interests: [] as string[],
    location: '',
    phone: '',
    date_of_birth: '',
  });

  useEffect(() => {
    if (user) {
      loadProfile();
      loadStats();
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      const data = await profileService.getProfile(user!.id);
      setProfile(data);
      if (data) {
        setFormData({
          full_name: data.full_name || '',
          interests: data.interests || [],
          location: data.location || '',
          phone: data.phone || '',
          date_of_birth: data.date_of_birth || '',
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to load profile',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const regs = await registrationService.getRegisteredActivities(user!.id, 'registered');
      setRegistrations(regs.length);

      const stats = await historyService.getActivityStats(user!.id);
      setActivityStats(stats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await profileService.updateProfile(user!.id, formData);
      await loadProfile();
      setIsEditing(false);
      toast({
        title: t('profileUpdatedSuccess'),
        description: t('profileUpdatedSuccess'),
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: t('error'),
        description: t('profileUpdateFailed'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleEditClick = (value: boolean) => {
    setIsEditing(value);
    if (value && editFormRef.current) {
      setTimeout(() => {
        editFormRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    }
  };

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto max-w-4xl py-10 px-4 mt-16">
        {/* Profile Header */}
        <Card className="mb-6 border-border">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
              <div className="flex sm:flex-row flex-col sm:items-start items-center gap-6 flex-1">
                <div className="flex flex-col items-center sm:items-start gap-3">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profile?.profile_image_url || ''} />
                    <AvatarFallback>{profile?.full_name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                  {/* Mobile Edit Link */}
                  <button
                    onClick={() => handleEditClick(!isEditing)}
                    className="sm:hidden text-primary hover:underline font-medium text-sm px-3 py-2 border-2 border-white rounded"
                  >
                    {isEditing ? t('cancel') : t('editProfile')}
                  </button>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h1 className="text-3xl font-bold">{profile?.full_name || session?.user?.email || 'Your Profile'}</h1>
                  <div className="flex items-center gap-2 text-muted-foreground mt-2 justify-center sm:justify-start">
                    <Mail size={16} />
                    <span>{session?.user?.email}</span>
                  </div>
                  {session?.user?.user_metadata?.provider && (
                    <div className="flex items-center gap-2 text-muted-foreground justify-center sm:justify-start">
                      <Github size={16} />
                      <span>Signed in via {session.user.user_metadata.provider}</span>
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground mt-2">
                    Member since {new Date(profile?.created_at || session?.user?.created_at || '').toLocaleDateString()}
                  </p>
                </div>
              </div>
              {/* Desktop buttons */}
              <div className="hidden sm:flex gap-2">
                <Button onClick={() => handleEditClick(!isEditing)} variant={isEditing ? 'outline' : 'default'} className={isEditing ? '' : 'border-2 border-white'}>
                  {isEditing ? t('cancel') : t('editProfile')}
                </Button>
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <LogOut size={16} />
                  {t('logout')}
                </Button>
              </div>
              {/* Mobile Logout Button */}
              <Button
                onClick={handleLogout}
                variant="destructive"
                size="sm"
                className="sm:hidden w-full flex items-center justify-center gap-2"
              >
                <LogOut size={16} />
                {t('logout')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold">{registrations}</div>
                <p className="text-sm text-muted-foreground">{t('activitiesRegistered')}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold">{activityStats?.total_completed || 0}</div>
                <p className="text-sm text-muted-foreground">{t('completed')}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold">{activityStats?.total_favorited || 0}</div>
                <p className="text-sm text-muted-foreground">{t('favorites')}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold">{activityStats?.total_viewed || 0}</div>
                <p className="text-sm text-muted-foreground">{t('activitiesViewed')}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Details */}
        <Card className="border-border" ref={editFormRef}>
          <CardHeader>
            <CardTitle>{isEditing ? t('editProfile') : t('profileInformation')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Interests */}
            <div>
              <Label>{t('interests')}</Label>
              <div className="mt-3 flex flex-wrap gap-2">
                {ACTIVITY_CATEGORIES.map((category) => (
                  <button
                    key={category}
                    onClick={() => isEditing && toggleInterest(category)}
                    disabled={!isEditing}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      formData.interests.includes(category)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    } ${!isEditing && 'cursor-default'}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            {isEditing && (
              <>
                <div>
                  <Label htmlFor="full_name">{t('fullName')}</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    placeholder="Name Surname"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="date_of_birth">{t('dateOfBirth')}</Label>
                  <Input
                    id="date_of_birth"
                    name="date_of_birth"
                    type="date"
                    value={formData.date_of_birth}
                    onChange={handleInputChange}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="location">{t('location')}</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder={t('yourLocation')}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">{t('phone')}</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+383 4X XXX XXX"
                    className="mt-2"
                  />
                </div>
              </>
            )}

            {!isEditing && (
              <>
                <div>
                  <Label>{t('location')}</Label>
                  <p className="mt-2 text-foreground">{profile?.location || t('notSpecified')}</p>
                </div>
                <div>
                  <Label>{t('phone')}</Label>
                  <p className="mt-2 text-foreground">{profile?.phone || t('notSpecified')}</p>
                </div>
              </>
            )}

            {isEditing && (
              <div className="flex gap-3 pt-4 border-t border-border">
                <Button onClick={handleSave} disabled={loading}>
                  {loading ? t('saving') : t('saveChanges')}
                </Button>
                <Button onClick={() => setIsEditing(false)} variant="outline">
                  {t('cancel')}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
