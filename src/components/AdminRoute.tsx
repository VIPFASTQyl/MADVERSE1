import { Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

interface AdminRouteProps {
  children: React.ReactNode;
}

const ADMIN_EMAIL = "fastvip02@gmail.com";

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user, isLoaded } = useUser();

  // Still loading user info
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userEmail = user.primaryEmailAddress?.emailAddress;
  const isAdmin = userEmail === ADMIN_EMAIL;

  // Not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground text-lg">You don't have permission to access this page.</p>
          <p className="text-sm text-muted-foreground">Current user: {userEmail}</p>
          <Navigate to="/" replace />
        </div>
      </div>
    );
  }

  // Is admin - allow access
  return <>{children}</>;
};
