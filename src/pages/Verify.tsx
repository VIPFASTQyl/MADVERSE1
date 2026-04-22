import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import SEO from "@/components/SEO";

const Verify = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        // Check if user is already logged in (verified)
        const session = await supabase.auth.getSession();
        if (session.data.session) {
          // Retrieve pending profile from localStorage
          const pendingProfile = localStorage.getItem("pendingUserProfile");
          if (pendingProfile) {
            const profileData = JSON.parse(pendingProfile);
            localStorage.setItem("justVerifiedProfile", JSON.stringify(profileData));
          }

          // Redirect immediately to profile
          navigate("/profile");
        }
      } catch (error) {
        console.error("Verification error:", error);
        navigate("/");
      }
    };

    verifyEmail();
  }, [navigate]);

  return (
    <SEO
      title="Verify Email"
      description="Verify your MADVERSE email address to finish setting up your account."
      canonical="https://www.madverse-ks.page/verify"
    />
  );
};

export default Verify;
