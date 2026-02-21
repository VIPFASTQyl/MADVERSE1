import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";

const VerificationPending = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  useEffect(() => {
    if (session?.user?.user_metadata?.email_verified) {
      navigate("/");
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      <div className="flex-1 flex items-center justify-center px-6 pt-16">
        <div className="w-full max-w-md">
          <Card className="border-border shadow-none">
            <CardContent className="space-y-8 pt-12 pb-12">
              <div className="text-center space-y-4">
                <Mail className="h-14 w-14 mx-auto text-primary" />
                <h3 className="text-2xl font-semibold">Verify your email</h3>
                <p className="text-sm text-muted-foreground">
                  We sent a confirmation link to:
                </p>
                <p className="text-sm font-medium bg-muted p-3 rounded">
                  {email || "your email"}
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Click the link in your email to activate your account. The link expires in 24 hours.
                </p>
              </div>

              <div className="text-xs text-muted-foreground pt-6 border-t space-y-2">
                <p>Didn't receive the email? Check your spam folder or try signing up again.</p>
                <p className="pt-2">If you need further assistance, feel free to contact our support team.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VerificationPending;
