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
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-20 px-6">
        <ClerkSignUp 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-black border border-white/20 shadow-2xl",
              headerTitle: "text-white text-2xl",
              headerSubtitle: "text-slate-400",
              socialButtonsBlockButton: "bg-slate-800 hover:bg-slate-700 text-white border-white/30",
              socialButtonsBlockButtonText: "text-white font-medium",
              socialButtonsIconButton: "border-white/30",
              dividerLine: "bg-white/20",
              dividerText: "text-slate-400",
              formButtonPrimary: "bg-slate-800 hover:bg-slate-700 text-white",
              footerActionLink: "text-white hover:text-slate-300",
              footerActionText: "text-slate-400",
              formFieldLabel: "text-white",
              formFieldInput: "bg-black border-white/30 text-white placeholder:text-slate-500 focus:border-white",
              formFieldInputShowPasswordButton: "text-slate-400 hover:text-white",
              identityPreviewText: "text-white",
              identityPreviewEditButton: "text-slate-400 hover:text-white",
              footer: "hidden",
            },
          }}
          routing="path"
          path="/signup"
          signInUrl="/login"
          afterSignUpUrl="/"
        />
      </div>
      
      <Footer />
    </div>
  );
};

export default SignUp;
