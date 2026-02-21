import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminRoute } from "./components/AdminRoute";
import ScrollToTop from "./components/ScrollToTop";
import { lazy, Suspense } from "react";
import BackToTop from "@/components/BackToTop";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  console.error("Missing Clerk Publishable Key - check your .env.local file");
}

// Lazy load all page components to reduce initial bundle
const Index = lazy(() => import("./pages/Index"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Register = lazy(() => import("./pages/SignUp"));
const Login = lazy(() => import("./pages/Login"));
const Verify = lazy(() => import("./pages/Verify"));
const VerificationPending = lazy(() => import("./pages/VerificationPending"));
const Profile = lazy(() => import("./pages/Profile"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Activities = lazy(() => import("./pages/Activities"));
// Activity sub-pages (simple pages) restored below
const Youth = lazy(() => import("./pages/activities/Youth"));
const Arts = lazy(() => import("./pages/activities/Arts"));
const Culture = lazy(() => import("./pages/activities/Culture"));
const Sports = lazy(() => import("./pages/activities/Sports"));
const Exhibition = lazy(() => import("./pages/activities/Exhibition"));
const Volunteering = lazy(() => import("./pages/activities/Volunteering"));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-background">
    <style>{`
      @keyframes dotToCylinder {
        0%, 100% {
          transform: scaleY(1);
        }
        50% {
          transform: scaleY(2.5);
        }
      }
      .dot-animation {
        animation: dotToCylinder 1.4s ease-in-out infinite;
      }
      .dot-1 { animation-delay: 0s; }
      .dot-2 { animation-delay: 0.2s; }
      .dot-3 { animation-delay: 0.4s; }
    `}</style>
    <div className="text-center">
      <div className="flex justify-center gap-2 mb-4">
        <div className="dot-animation dot-1 w-2 h-2 bg-primary rounded-full"></div>
        <div className="dot-animation dot-2 w-2 h-2 bg-primary rounded-full"></div>
        <div className="dot-animation dot-3 w-2 h-2 bg-primary rounded-full"></div>
      </div>
      <p className="text-lg font-semibold text-muted-foreground">Loading...</p>
    </div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});

const App = () => {
  // Temporarily render without Clerk if key is missing - for debugging
  const hasClerkKey = PUBLISHABLE_KEY && PUBLISHABLE_KEY.length > 10;
  
  if (!hasClerkKey) {
    console.warn('⚠️ Clerk key not found - running in fallback mode');
    return (
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
                <ScrollToTop />
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/signup" element={<Register />} />
                    <Route path="/login" element={
                      <div className="min-h-screen bg-background flex items-center justify-center">
                        <div className="text-center space-y-4 p-8">
                          <h1 className="text-2xl font-bold">Authentication Disabled</h1>
                          <p className="text-muted-foreground">Please configure Clerk keys to enable login</p>
                        </div>
                      </div>
                    } />
                    <Route path="/activities" element={<Activities />} />
                    <Route path="/activity/youth" element={<Youth />} />
                    <Route path="/activity/arts" element={<Arts />} />
                    <Route path="/activity/culture" element={<Culture />} />
                    <Route path="/activity/sports" element={<Sports />} />
                    <Route path="/activity/exhibition" element={<Exhibition />} />
                    <Route path="/activity/volunteering" element={<Volunteering />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
                <BackToTop />
              </BrowserRouter>
            </TooltipProvider>
          </AuthProvider>
        </LanguageProvider>
      </QueryClientProvider>
    );
  }

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <AuthProvider>
            <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
              <ScrollToTop />
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/signup" element={<Register />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/verify" element={<Verify />} />
                  <Route path="/verification-pending" element={<VerificationPending />} />
                  <Route
                    path="/profile"
                    element={<Profile />}
                  />
                  <Route
                    path="/admin/dashboard"
                    element={
                      <AdminRoute>
                        <AdminDashboard />
                      </AdminRoute>
                    }
                  />
                  <Route path="/activities" element={<Activities />} />
                  {/* Simple activity detail pages (title + LiquidEther) */}
                  <Route path="/activity/youth" element={<Youth />} />
                  <Route path="/activity/arts" element={<Arts />} />
                  <Route path="/activity/culture" element={<Culture />} />
                  <Route path="/activity/sports" element={<Sports />} />
                  <Route path="/activity/exhibition" element={<Exhibition />} />
                  <Route path="/activity/volunteering" element={<Volunteering />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
              <BackToTop />
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  </ClerkProvider>
  );
};

export default App;
