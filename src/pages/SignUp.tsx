import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SignUp as ClerkSignUp } from "@clerk/clerk-react";
import { useAuth } from "@clerk/clerk-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import "@/styles/auth.css";

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
      
      <div className="flex-1 flex items-center justify-center w-full px-4 py-12 relative z-20 overflow-y-auto pt-32 md:pt-40">
        <div className="w-full max-w-md">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <span className="text-primary text-sm font-medium tracking-widest uppercase mb-4 block">
              Join MADVERSE
            </span>
            <h1 className="text-6xl md:text-7xl font-bold mb-12 leading-tight text-white">
              SIGN UP
            </h1>
          </motion.div>

          {/* Clerk SignUp Component */}
          <ClerkSignUp 
            appearance={{
              elements: {
                rootBox: "w-full flex justify-center",
                card: "w-full bg-transparent border-0 shadow-none",
                header: "hidden",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                
                // Social button (Google)
                socialButtonsBlockButton: "bg-white hover:bg-gray-100 text-black border-0 transition-all rounded-lg h-12 font-semibold w-full mb-6",
                socialButtonsBlockButtonText: "text-black font-semibold",
                socialButtonsIconButton: "hidden",
                
                // Divider
                dividerLine: "bg-gray-700",
                dividerText: "text-gray-400 text-sm font-medium",
                dividerContainer: "my-6",
                
                // Form styling
                formButtonPrimary: "bg-white hover:bg-gray-100 text-black font-semibold transition-all border-0 w-full h-12 rounded-lg",
                formButtonPrimaryText: "text-black font-semibold",
                
                // Form field wrapping
                formField: "mb-8",
                formFieldLabel: "text-white text-sm font-semibold mb-2 block",
                formFieldInput: "bg-transparent border border-gray-500 text-white placeholder:text-gray-500 focus:border-white focus:ring-0 focus:ring-white transition-all rounded-md h-12 px-4",
                
                // Password input wrapper
                formFieldPasswordInput: "relative",
                formFieldPasswordInputContainer: "relative",
                
                // Messages and errors styling
                formFieldErrorMessage: "text-gray-400 text-xs mt-2 font-normal",
                formMessage: "text-gray-400 text-xs mt-2 font-normal",
                
                // Footer
                footer: "hidden",
                footerActionLink: "hidden",
                footerActionText: "hidden",
                
                // Remove defaults
                main: "px-0",
                cardBox: "px-0",
              },
              variables: {
                colorPrimary: "#fff",
              }
            }}
            routing="path"
            path="/signup"
            signInUrl="/login"
            fallbackRedirectUrl="/"
            forceRedirectUrl="/"
          />

          {/* Sign In Link */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12"
          >
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <a href="/login" className="text-white hover:text-gray-200 font-semibold transition-colors">
                Log in
              </a>
            </p>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default SignUp;
