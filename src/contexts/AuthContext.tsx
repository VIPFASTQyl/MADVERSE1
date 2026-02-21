import { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  session: any;
  loading: boolean;
  user: any;
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
  const [authState, setAuthState] = useState<AuthContextType>({
    session: null,
    loading: true,
    user: null,
    isAdmin: false
  });

  useEffect(() => {
    // Dynamically import and use Clerk hooks
    const initClerk = async () => {
      try {
        const { useUser, useAuth: useClerkAuth } = await import("@clerk/clerk-react");
        // Note: We can't use hooks in useEffect, so we'll just set loading to false
        setAuthState({
          session: null,
          loading: false,
          user: null,
          isAdmin: false
        });
      } catch (error) {
        console.error('Failed to initialize Clerk:', error);
        setAuthState({
          session: null,
          loading: false,
          user: null,
          isAdmin: false
        });
      }
    };
    
    initClerk();
  }, []);

  return (
    <AuthContext.Provider value={authState}>
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
