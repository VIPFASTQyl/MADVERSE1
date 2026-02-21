import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import LiquidEther from '@/components/LiquidEther';
import AnimatedBackground from '@/components/AnimatedBackground';
import { useUser } from '@clerk/clerk-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Mail, User as UserIcon, Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Profile = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [liquidEtherFailed, setLiquidEtherFailed] = useState(false);
  const { isLoaded, isSignedIn, user } = useUser();

  useEffect(() => {
    const handleError = () => setLiquidEtherFailed(true);
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate('/login');
    }
  }, [isLoaded, isSignedIn, navigate]);

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
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
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">{user.fullName || `${user.firstName} ${user.lastName}`}</h1>
            <p className="text-muted-foreground">
              {user.createdAt && `Member since ${new Date(user.createdAt).toLocaleDateString()}`}
            </p>
          </div>

          <Card className="mb-8 border-border">
            <CardHeader>
              <CardTitle className="text-2xl">Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-6">
                <div className="flex items-start gap-4 pb-4 border-b border-border">
                  <UserIcon className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                    <p className="text-lg font-semibold">{user.fullName || `${user.firstName} ${user.lastName}`}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 pb-4 border-b border-border">
                  <Mail className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Email Address</p>
                    <p className="text-base">{user.emailAddresses[0]?.emailAddress}</p>
                  </div>
                </div>

                {user.createdAt && (
                  <div className="flex items-start gap-4">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground mb-1">Member Since</p>
                      <p className="text-base">{new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4">
                <Button
                  onClick={() => {
                    toast({
                      title: "Profile Settings",
                      description: "Click your avatar in the navigation to manage your account settings.",
                    });
                  }}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-11"
                >
                  Manage Account Settings
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardContent className="pt-6">
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>• Your profile is managed by Clerk - a secure authentication provider</p>
                <p>• Click your avatar in the navigation to update your profile information</p>
                <p>• Your account information is encrypted and securely stored</p>
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
