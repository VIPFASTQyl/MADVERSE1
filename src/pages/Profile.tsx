import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { LogOut, Mail, Github } from "lucide-react";

const Profile = () => {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-2xl mx-auto py-20 px-6">
        <h1 className="text-4xl font-bold mb-12">My Profile</h1>

        {session?.user && (
          <Card className="p-8 border border-border">
            <div className="flex items-start justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">{session.user.email}</h2>
                <div className="space-y-3 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail size={16} />
                    <span>{session.user.email}</span>
                  </div>
                  {session.user.user_metadata?.provider && (
                    <div className="flex items-center gap-2">
                      <Github size={16} />
                      <span>Signed in via {session.user.user_metadata.provider}</span>
                    </div>
                  )}
                  <div className="pt-4">
                    <p className="text-sm">
                      <span className="text-foreground">User ID:</span> {session.user.id}
                    </p>
                    <p className="text-sm">
                      <span className="text-foreground">Joined:</span>{" "}
                      {new Date(session.user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              <Button
                onClick={handleLogout}
                variant="destructive"
                className="flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </Button>
            </div>

            <div className="border-t border-border pt-8">
              <h3 className="text-lg font-semibold mb-4">Account Settings</h3>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>✅ GitHub OAuth authentication enabled</p>
                <p>✅ Two-factor authentication available</p>
                <p>✅ Session token valid until: {new Date(session.expires_at * 1000).toLocaleDateString()}</p>
              </div>
            </div>
          </Card>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
