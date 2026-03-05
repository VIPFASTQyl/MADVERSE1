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
      {/* Minimalist gradient background */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.02) 0%, rgba(0, 0, 0, 0) 70%)',
        }}
      />
      
      <Navigation />
      
      <div className="flex-1 flex items-center justify-center w-full px-4 py-12 relative z-20 overflow-y-auto">
        <div className="w-full max-w-sm">
          <ClerkSignUp 
            appearance={{
              elements: {
                rootBox: "w-full flex justify-center",
                card: "bg-white rounded-xl shadow-2xl w-full overflow-hidden",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                header: "relative pt-16 pb-0 px-8",
                
                // Avatar styling
                headerAvatarImage: "h-16 w-16 border-4 border-black",
                headerAvatarImageUrl: "h-16 w-16",
                
                // Form styling
                socialButtonsBlockButton: "bg-white hover:bg-gray-50 text-black border border-gray-300 hover:border-gray-400 transition-all rounded-lg mb-3 h-12 font-medium",
                socialButtonsBlockButtonText: "text-black font-medium",
                socialButtonsIconButton: "border-gray-300 hover:border-gray-400 rounded-lg",
                dividerLine: "bg-gray-200",
                dividerText: "text-gray-500 text-xs font-medium",
                
                formButtonPrimary: "bg-black hover:bg-gray-900 text-white font-semibold transition-all border-0 w-full h-12 rounded-lg mt-6 mb-4",
                formButtonPrimaryText: "text-white font-semibold",
                
                footerActionLink: "text-black hover:text-gray-700 font-medium",
                footerActionText: "text-gray-600 text-sm",
                footer: "text-center pt-2 pb-6",
                
                formFieldLabel: "text-black text-sm font-semibold mb-2",
                formFieldInput: "bg-gray-50 border-2 border-gray-200 text-black placeholder:text-gray-400 focus:border-black focus:ring-0 transition-colors rounded-lg h-12 px-4 mb-4",
                formFieldInputShowPasswordButton: "text-gray-500 hover:text-black transition-colors",
                
                identityPreviewText: "text-black font-medium",
                identityPreviewEditButton: "text-black hover:text-gray-700 font-medium",
                
                // Main container padding
                cardBox: "px-8 py-6",
                
                // Remove default styling
                main: "px-0",
              },
              variables: {
                colorPrimary: "#000",
                colorInputBackground: "#f3f4f6",
                colorInputBorder: "#e5e7eb",
              }
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
