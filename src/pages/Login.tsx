import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const Login = () => {
  const navigate = useNavigate();
  const { session } = useAuth();

  useEffect(() => {
    if (session) {
      navigate("/");
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-md mx-auto py-20 px-6">
        <h1 className="text-3xl font-bold mb-8 text-center">Sign In to Madverse</h1>
        <Auth
          supabaseClient={supabase}
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
            }}
          providers={["github"]}
          redirectTo={`${window.location.origin}/`}
        />
      </div>
      <Footer />
    </div>
  );
};

export default Login;
