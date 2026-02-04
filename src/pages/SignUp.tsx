import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Eye, EyeOff } from "lucide-react";

const SignUp = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    if (session) {
      navigate("/");
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <style>{`
        /* Password input styling */
        input[type="password"] {
          padding-right: 40px;
        }

        /* Password toggle button styling */
        button[aria-label*="password"],
        button[aria-label*="Password"] {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 4px 8px;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.2s ease;
        }

        button[aria-label*="password"]:hover,
        button[aria-label*="Password"]:hover {
          opacity: 0.7;
        }

        /* Wrap password input field container with relative positioning */
        .supabase-auth-input-wrapper {
          position: relative;
        }
      `}</style>
      <Navigation />
      <div className="max-w-md mx-auto py-20 px-6">
        <h1 className="text-3xl font-bold mb-8 text-center">{t('signUpToMadverse')}</h1>
        <Auth
          supabaseClient={supabase}
          view="sign_up"
          providers={[]}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: "#fff",
                  brandAccent: "#000",
                  brandButtonText: "#000",
                  defaultButtonBackground: "#2d2d2d",
                  defaultButtonBackgroundHover: "#1a1a1a",
                  defaultButtonBorder: "#555",
                  defaultButtonText: "#fff",
                  dividerBackground: "#3a3a3a",
                  inputBackground: "#1a1a1a",
                  inputBorder: "#3a3a3a",
                  inputBorderHover: "#555",
                  inputBorderFocus: "#fff",
                  inputText: "#fff",
                  inputPlaceholder: "#888",
                  inputLabelText: "#fff",
                  messageText: "#888",
                  messageTextDanger: "#ff6b6b",
                  anchorTextColor: "#fff",
                  anchorTextColorHover: "#ccc",
                },
              },
            },
          }}
          localization={{
            variables: {
              en: {
                sign_up: {
                  email_label: "Email Address",
                  password_label: "Password",
                  button_label: "Sign Up",
                  loading_button_label: "Signing Up",
                  link_text: "Already have an account? Sign in",
                },
              },
            },
          }}
          redirectTo={window.location.origin}
        />
      </div>
      <Footer />
    </div>
  );
};

export default SignUp;
