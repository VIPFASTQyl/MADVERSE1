import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const SignUp = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handlePhoneChange = (value: string) => {
    let cleaned = value.replace(/[^\d+]/g, '');
    if (cleaned && !cleaned.startsWith('+')) {
      cleaned = '+' + cleaned;
    }
    setPhone(cleaned);
  };

  const validateForm = (): string | null => {
    if (!fullName.trim()) return "Full Name is required";
    if (!email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "Please enter a valid email";
    if (!phone.trim()) return "Phone Number is required";
    return null;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      // First, check if email already exists
      const { data: existingUser, error: fetchError } = await supabase
        .from('registrations')
        .select('id')
        .eq('email', email.trim())
        .single();

      if (!fetchError && existingUser) {
        // Email already registered - login to existing profile
        localStorage.setItem('registrationId', existingUser.id);
        localStorage.setItem('registrationEmail', email.trim());
        setSuccess(true);
        setTimeout(() => {
          navigate("/profile");
        }, 2000);
        return;
      }

      // Email doesn't exist - create new registration
      const { data, error: insertError } = await supabase
        .from('registrations')
        .insert([
          {
            full_name: fullName.trim(),
            email: email.trim(),
            phone: phone.trim(),
          }
        ])
        .select();

      if (insertError) throw insertError;

      // Store registration ID in localStorage for profile access
      if (data && data.length > 0) {
        localStorage.setItem('registrationId', data[0].id);
        localStorage.setItem('registrationEmail', email.trim());
      }

      // Send notification email to admin
      try {
        const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';
        const notificationResponse = await fetch(`${backendUrl}/api/notifications/registration`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fullName: fullName.trim(),
            email: email.trim(),
            phone: phone.trim(),
          }),
        });

        if (!notificationResponse.ok) {
          console.warn('⚠️ Failed to send admin notification');
        } else {
          console.log('✅ Admin notification sent successfully');
        }
      } catch (notificationError) {
        console.warn('⚠️ Notification service error:', notificationError);
        // Don't fail registration if notification fails
      }

      setSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Registration failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="w-full max-w-md">
            <Card className="border-border shadow-none">
              <CardContent className="space-y-6 pt-12 pb-12">
                <div className="text-center space-y-4">
                  <CheckCircle2 className="h-16 w-16 mx-auto text-green-500" />
                  <h3 className="text-2xl font-semibold">Registration Successful</h3>
                  <p className="text-sm text-muted-foreground">
                    Thank you for registering. We'll contact you soon.
                  </p>
                  <p className="text-xs text-muted-foreground pt-4">
                    Redirecting to home in a moment...
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-md mx-auto py-20 px-6">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-3xl text-center">Register</CardTitle>
            <p className="text-sm text-muted-foreground text-center mt-2">
              Join Madverse today
            </p>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSignUp} className="space-y-4">
              {/* Full Name */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold mb-2">
                  Full Name
                </label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Name Surname"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={loading}
                  className="bg-input border-border"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold mb-2">
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Example@mail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="bg-input border-border"
                />
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold mb-2">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  type="text"
                  placeholder="+383 4X XXX XXX"
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  disabled={loading}
                  className="bg-input border-border"
                  inputMode="numeric"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full mt-8 bg-primary text-primary-foreground hover:bg-primary/90 font-semibold h-11"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  "Register"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default SignUp;
