import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

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

  // Component renders nothing - just redirects silently
  return null;
};

export default Verify;
