import { createContext, useContext } from "react";
import { useAuth as useClerkAuth, useUser } from "@clerk/clerk-react";
import { isAdminEmail } from "@/lib/adminAccess";

interface AuthSession {
  user: {
    id: string | null | undefined;
    email: string | undefined;
    user_metadata: {
      email_verified: boolean;
    };
  };
}

interface AuthContextType {
  session: AuthSession | null;
  loading: boolean;
  user: ReturnType<typeof useUser>["user"];
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Fallback provider without Clerk
export const FallbackAuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthContext.Provider 
      value={{ 
        session: null, 
        loading: false, 
        user: null, 
        isAdmin: false 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Clerk-based provider
export const ClerkAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoaded } = useUser();
  const { userId } = useClerkAuth();
  const email = user?.primaryEmailAddress?.emailAddress;
  const session = user
    ? {
        user: {
          id: userId,
          email,
          user_metadata: {
            email_verified: user.primaryEmailAddress?.verification?.status === "verified",
          },
        },
      }
    : null;

  return (
    <AuthContext.Provider
      value={{
        session,
        loading: !isLoaded,
        user,
        isAdmin: isAdminEmail(email),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Default export based on environment
export const AuthProvider = FallbackAuthProvider;

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
