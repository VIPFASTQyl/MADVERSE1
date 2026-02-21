import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import LiquidEther from "@/components/LiquidEther";
import AnimatedBackground from "@/components/AnimatedBackground";
import ContactSection from "@/components/ContactSection";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState, useEffect } from "react";

const Contact = () => {
  const isMobile = useIsMobile();
  const [liquidEtherFailed, setLiquidEtherFailed] = useState(false);

  useEffect(() => {
    // Add error listener for WebGL issues
    const handleError = () => setLiquidEtherFailed(true);
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);
  return (
    <div className="min-h-screen bg-background relative">
      <Navigation />
      <div className="fixed inset-0 top-0 z-0 h-screen w-full pointer-events-none">
        {isMobile ? (
          <AnimatedBackground className="w-full h-full" />
        ) : liquidEtherFailed ? (
          <div className="w-full h-full bg-gradient-to-br from-purple-900 via-black to-black animate-pulse" />
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
              console.error('LiquidEther error on Contact page:', error);
              setLiquidEtherFailed(true);
            }}
          />
        )}
      </div>
      <div className="relative z-10 pointer-events-auto">
        <ContactSection />
        <Footer />
      </div>
    </div>
  );
};

export default Contact;
