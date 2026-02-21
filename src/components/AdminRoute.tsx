import { Navigate } from "react-router-dom";

interface AdminRouteProps {
  children: React.ReactNode;
}

const ADMIN_EMAIL = "fastvip02@gmail.com";

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const registrationEmail = localStorage.getItem('registrationEmail');
  const isAdmin = registrationEmail === ADMIN_EMAIL;

  if (!registrationEmail) {
    return <Navigate to="/" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
