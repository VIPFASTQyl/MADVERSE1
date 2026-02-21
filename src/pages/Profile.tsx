import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import LiquidEther from '@/components/LiquidEther';
import AnimatedBackground from '@/components/AnimatedBackground';
import { supabase } from '@/lib/supabaseClient';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Loader2, Mail, Phone, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface RegistrationProfile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  created_at: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [liquidEtherFailed, setLiquidEtherFailed] = useState(false);
  const [profile, setProfile] = useState<RegistrationProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [registeredPrograms, setRegisteredPrograms] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    const handleError = () => setLiquidEtherFailed(true);
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  useEffect(() => {
    loadProfile();
    loadRegisteredPrograms();
  }, []);

  const loadRegisteredPrograms = async () => {
    try {
      const registrationId = localStorage.getItem('registrationId');
      if (!registrationId) return;

      // Fetch registered activities from activity_registrations table
      const { data, error } = await supabase
        .from('activity_registrations')
        .select('*')
        .eq('registration_id', registrationId)
        .order('registered_at', { ascending: false });

      if (error) throw error;
      setRegisteredPrograms(data || []);
    } catch (error) {
      console.error('Error loading registered programs:', error);
    }
  };

  const loadProfile = async () => {
    try {
      setLoading(true);
      const registrationId = localStorage.getItem('registrationId');
      const registrationEmail = localStorage.getItem('registrationEmail');

      if (!registrationId || !registrationEmail) {
        // Try to redirect to register if no registration found
        navigate('/register');
        return;
      }

      // Fetch registration data from registrations table
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .eq('id', registrationId)
        .single();

      if (error) throw error;

      if (data) {
        setProfile(data);
        setFormData({
          full_name: data.full_name,
          email: data.email,
          phone: data.phone,
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const registrationId = localStorage.getItem('registrationId');

      if (!registrationId) {
        throw new Error('Registration ID not found');
      }

      // Validate form
      if (!formData.full_name.trim()) {
        toast({
          title: 'Validation Error',
          description: 'Full Name is required',
          variant: 'destructive',
        });
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
        toast({
          title: 'Validation Error',
          description: 'Please enter a valid email',
          variant: 'destructive',
        });
        return;
      }

      if (!formData.phone.trim()) {
        toast({
          title: 'Validation Error',
          description: 'Phone Number is required',
          variant: 'destructive',
        });
        return;
      }

      const { error } = await supabase
        .from('registrations')
        .update({
          full_name: formData.full_name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
        })
        .eq('id', registrationId);

      if (error) throw error;

      // Update localStorage email
      localStorage.setItem('registrationEmail', formData.email.trim());

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setIsEditing(false);
      await loadProfile();

      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhoneChange = (value: string) => {
    let cleaned = value.replace(/[^\d+]/g, '');
    if (cleaned && !cleaned.startsWith('+')) {
      cleaned = '+' + cleaned;
    }
    setFormData((prev) => ({
      ...prev,
      phone: cleaned,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="w-full max-w-md">
            <Card className="border-border shadow-none">
              <CardContent className="space-y-6 pt-12 pb-12">
                <div className="text-center space-y-4">
                  <CheckCircle2 className="h-16 w-16 mx-auto text-green-500" />
                  <h3 className="text-2xl font-semibold">Updated Successfully</h3>
                  <p className="text-sm text-muted-foreground">
                    Your profile has been updated.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <div className="fixed inset-0 top-0 z-0 h-screen w-full pointer-events-none">
        {isMobile ? (
          <AnimatedBackground className="w-full h-full" />
        ) : liquidEtherFailed ? (
          <div className="w-full h-full bg-gradient-to-br from-cyan-900 via-black to-black animate-pulse" />
        ) : (
          <LiquidEther
            colors={['#00CED1', '#AFEEEE', '#FFFFFF']}
            mouseForce={isMobile ? 8 : 15}
            cursorSize={isMobile ? 60 : 100}
            isViscous={false}
            viscous={isMobile ? 15 : 25}
            iterationsViscous={isMobile ? 8 : 16}
            iterationsPoisson={isMobile ? 8 : 16}
            resolution={isMobile ? 0.25 : 0.4}
            isBounce={false}
            autoDemo={!isMobile}
            autoSpeed={isMobile ? 0.25 : 0.4}
            autoIntensity={1}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
            onError={(error) => {
              console.error('LiquidEther error on Profile page:', error);
              setLiquidEtherFailed(true);
            }}
          />
        )}
      </div>
      <div className="relative z-10 pointer-events-auto">
        <Navigation />
        <div className="container mx-auto max-w-2xl py-10 px-4 mt-16">
        {/* Profile Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{profile?.full_name}</h1>
          <p className="text-muted-foreground">
            {profile?.created_at && `Member since ${new Date(profile.created_at).toLocaleDateString()}`}
          </p>
        </div>

        {/* Profile Card */}
        <Card className="mb-8 border-border">
          <CardHeader>
            <CardTitle className="text-2xl">Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isEditing ? (
              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <label htmlFor="full_name" className="block text-sm font-semibold mb-2">
                    Full Name
                  </label>
                  <Input
                    id="full_name"
                    name="full_name"
                    type="text"
                    placeholder="Name Surname"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    disabled={isSaving}
                    className="bg-input border-border"
                  />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold mb-2">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Example@mail.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isSaving}
                    className="bg-input border-border"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold mb-2">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="text"
                    placeholder="+383 4X XXX XXX"
                    value={formData.phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    disabled={isSaving}
                    className="bg-input border-border"
                    inputMode="numeric"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-11"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </Button>
                  <Button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        full_name: profile?.full_name || '',
                        email: profile?.email || '',
                        phone: profile?.phone || '',
                      });
                    }}
                    variant="outline"
                    disabled={isSaving}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Display Mode */}
                <div className="space-y-4">
                  <div className="flex items-start gap-4 pb-4 border-b border-border">
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                      <p className="text-lg font-semibold">{profile?.full_name}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 pb-4 border-b border-border">
                    <Mail className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-1">Email Address</p>
                      <p className="text-base">{profile?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Phone className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-1">Phone Number</p>
                      <p className="text-base">{profile?.phone}</p>
                    </div>
                  </div>
                </div>

                {/* Edit Button */}
                <div className="pt-4">
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-11"
                  >
                    Edit Profile
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Registered Programs Section */}
        <Card className="mb-8 border-border">
          <CardHeader>
            <CardTitle className="text-2xl">Registered Programs</CardTitle>
            <p className="text-sm text-muted-foreground mt-2">
              Programs you've registered for
            </p>
          </CardHeader>
          <CardContent>
            {registeredPrograms.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">You haven't registered for any programs yet</p>
                <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <a href="/activities">Browse Programs</a>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {registeredPrograms.map((program: any) => (
                  <div key={program.id} className="p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{program.activity_title}</h3>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">{program.activity_category}</span>
                    </div>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      {program.activity_date && <span>📅 {program.activity_date}</span>}
                      {program.activity_location && <span>📍 {program.activity_location}</span>}
                    </div>
                    {program.registered_at && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Registered on {new Date(program.registered_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Section */}
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>• Keep your profile information up to date so we can reach you easily</p>
              <p>• Your email and phone are used for program notifications</p>
              <p>• Changes are saved immediately to our database</p>
            </div>
          </CardContent>
        </Card>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Profile;
