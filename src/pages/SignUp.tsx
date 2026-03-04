import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SignUp as ClerkSignUp } from "@clerk/clerk-react";
import { useAuth } from "@clerk/clerk-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const SignUp = () => {
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      navigate("/");
    }
  }, [isSignedIn, navigate]);

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-visible">
      {/* Animated gradient background */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 0%, rgba(255, 255, 255, 0.05) 0%, rgba(0, 0, 0, 0) 50%)',
          animation: 'float 20s ease-in-out infinite',
        }}
      />
      
      <Navigation />
      
      <div className="flex-1 flex items-center justify-center w-full px-4 md:px-8 lg:px-16 py-12 overflow-y-auto overflow-x-visible relative z-20">
        <div className="w-full max-w-md">
          <ClerkSignUp 
            appearance={{
              elements: {
                rootBox: "w-full box-border overflow-visible",
                card: "bg-black border-2 border-white rounded-lg shadow-2xl p-8 w-full box-border overflow-visible pt-[130px]",
                headerTitle: "text-white text-2xl font-bold",
                headerSubtitle: "text-slate-400 text-sm",
                socialButtonsBlockButton: "bg-transparent hover:bg-white/5 text-white border border-white/30 hover:border-white transition-all",
                socialButtonsBlockButtonText: "text-white font-medium",
                socialButtonsIconButton: "border-white/30 hover:border-white",
                dividerLine: "bg-white/20",
                dividerText: "text-slate-500 text-xs",
                formButtonPrimary: "bg-white hover:bg-white/90 text-black font-semibold transition-all border border-white w-full",
                footerActionLink: "text-white hover:text-slate-300 transition-colors",
                footerActionText: "text-slate-400 text-sm",
                formFieldLabel: "text-white text-sm font-medium",
                formFieldInput: "bg-black border-2 border-white text-white placeholder:text-white focus:border-white focus:ring-2 focus:ring-white/20 transition-all rounded-md w-full",
                formFieldInputShowPasswordButton: "text-slate-400 hover:text-white transition-colors",
                identityPreviewText: "text-white",
                identityPreviewEditButton: "text-slate-400 hover:text-white transition-colors",
                footer: "hidden",
              },
            }}
            routing="path"
            path="/signup"
            signInUrl="/login"
            fallbackRedirectUrl="/"
            forceRedirectUrl="/"
          />
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default SignUp;
