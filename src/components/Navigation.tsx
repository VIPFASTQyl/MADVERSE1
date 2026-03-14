import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useMotionTemplate } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, Menu, X, LogOut, ArrowLeft, User } from "lucide-react";
import { Button } from "./ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";
import { UserButton } from "@clerk/clerk-react";
import ActivitiesDropdown from "./ActivitiesDropdown";

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileActivitiesOpen, setIsMobileActivitiesOpen] = useState(false);
  const [isLogoHovered, setIsLogoHovered] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { t, setLanguage, language } = useLanguage();
  const { session, isAdmin } = useAuth();

  // Try to get Clerk auth status safely
  useEffect(() => {
    try {
      // Dynamic import to avoid breaking if ClerkProvider isn't available
      import("@clerk/clerk-react").then(({ useAuth: useClerkAuth }) => {
        // We can't use hooks in useEffect, so we'll check localStorage or session instead
        const clerkSession = window?.Clerk?.session;
        setIsSignedIn(!!clerkSession);
      }).catch(() => {
        setIsSignedIn(false);
      });
    } catch {
      setIsSignedIn(false);
    }
  }, []);

  // Scroll-based navbar animation
  const { scrollY } = useScroll();
  
  // Create a motion value that maps scroll to background opacity (0-1)
  // When scrollY = 0, opacity = 0 (transparent)
  // When scrollY = 100, opacity = 1 (solid)
  const navOpacity = useTransform(scrollY, [0, 100], [0, 0.95]);
  
  // Create a template string with the opacity for rgba color
  const backgroundColor = useMotionTemplate`rgba(0, 0, 0, ${navOpacity})`;

  useEffect(() => {
    if (location.hash === '#showcase') {
      setTimeout(() => {
        const element = document.getElementById('showcase');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node) && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <motion.nav
      ref={navRef}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm"
      style={{
        // Dynamic opacity for the navbar background
        // At scroll 0: transparent, at scroll 100px: semi-opaque dark background
        backgroundColor: backgroundColor,
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* MADVERSE and Logo */}
          <div className="flex items-center gap-4">
            <div
              className="px-4 py-2 text-sm text-white hover:text-white transition-colors cursor-pointer flex items-center gap-2 relative"
              onClick={() => {
                if (location.pathname !== "/") {
                  navigate("/");
                  setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
                } else {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              onMouseEnter={() => setIsLogoHovered(true)}
              onMouseLeave={() => setIsLogoHovered(false)}
            >
              {/* Arrow - show on hover for non-home pages */}
              <motion.div
                initial={{ opacity: 0, rotate: 180 }}
                animate={{ 
                  opacity: location.pathname !== "/" && isLogoHovered ? 1 : 0,
                  rotate: location.pathname !== "/" && isLogoHovered ? 0 : 180,
                }}
                transition={{ duration: 0.2 }}
                className="absolute"
              >
                <ArrowLeft size={24} className="text-white" />
              </motion.div>
              
              {/* MADVERSE Text - hide on hover for non-home pages */}
              <motion.span
                initial={{ opacity: 1 }}
                animate={{ 
                  opacity: location.pathname !== "/" && isLogoHovered ? 0 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                MADVERSE
              </motion.span>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 ml-auto">
            <ActivitiesDropdown />
            <Link
              to="/about"
              className="px-4 py-2 text-sm text-white hover:text-white transition-colors"
            >
              {t('about')}
            </Link>
            <Link
              to="/contact"
              className="px-4 py-2 text-sm text-white hover:text-white transition-colors"
            >
              {t('contact')}
            </Link>

            {/* Language Switcher */}
            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={() => setLanguage('al')}
                className={`px-3 py-1 text-sm transition-all border border-white rounded ${
                  language === 'al'
                    ? 'bg-white text-black font-semibold'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                ALB
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 text-sm transition-all border border-white rounded ${
                  language === 'en'
                    ? 'bg-white text-black font-semibold'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                ENG
              </button>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-4 ml-4">
              {isSignedIn ? (
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "h-8 w-8",
                      userButtonPopoverCard: "bg-white border border-gray-200 shadow-lg",
                      userButtonPopoverActionButton: "text-black hover:bg-gray-100",
                      userButtonPopoverActionButtonText: "text-black",
                      userButtonPopoverDivider: "bg-gray-200",
                    }
                  }}
                />
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm text-white hover:text-white transition-colors border border-white rounded hover:border-white"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 text-sm bg-white text-black rounded hover:bg-gray-200 transition-colors"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile User Icon and Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {isSignedIn && (
              <div className="p-2">
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "h-6 w-6",
                      userButtonPopoverCard: "bg-white border border-gray-200 shadow-lg",
                      userButtonPopoverActionButton: "text-black hover:bg-gray-100",
                      userButtonPopoverActionButtonText: "text-black",
                      userButtonPopoverDivider: "bg-gray-200",
                    }
                  }}
                />
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              className="p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{
              opacity: { duration: 0.15 },
              height: { duration: 0.3 }
            }}
            className="bg-transparent border-t border-transparent"
          >
            <div className="px-4 py-4 space-y-2">
              <div
                className="block py-2 text-white hover:text-white transition-colors cursor-pointer"
                onClick={() => {
                  if (location.pathname !== "/") {
                    navigate("/");
                    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
                  } else {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                  setIsMobileMenuOpen(false);
                }}
              >
                MADVERSE
              </div>
              <a
                href="#showcase"
                className="block py-2 text-white hover:text-white transition-colors flex items-center justify-between cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileActivitiesOpen(!isMobileActivitiesOpen);
                }}
              >
                <span>{t('activities')}</span>
                <ChevronDown 
                  size={16} 
                  className={`transition-transform ${isMobileActivitiesOpen ? 'rotate-180' : ''}`}
                />
              </a>
              
              {/* Mobile Activities Dropdown */}
              <AnimatePresence>
                {isMobileActivitiesOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="pl-4 space-y-1 border-l border-transparent"
                  >
                    <Link
                      to="/activity/youth"
                      className="block py-2 text-sm text-white hover:text-white transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t('youth')}
                    </Link>
                    <Link
                      to="/activity/arts"
                      className="block py-2 text-sm text-white hover:text-white transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t('arts')}
                    </Link>
                    <Link
                      to="/activity/culture"
                      className="block py-2 text-sm text-white hover:text-white transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t('culture')}
                    </Link>
                    <Link
                      to="/activity/sports"
                      className="block py-2 text-sm text-white hover:text-white transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t('sports')}
                    </Link>
                    <Link
                      to="/activity/exhibition"
                      className="block py-2 text-sm text-white hover:text-white transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t('exhibition')}
                    </Link>
                    <Link
                      to="/activity/volunteering"
                      className="block py-2 text-sm text-white hover:text-white transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t('volunteering')}
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <Link
                to="/about"
                className="block py-2 text-white hover:text-white transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('about')}
              </Link>
              <Link
                to="/contact"
                className="block py-2 text-white hover:text-white transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('contact')}
              </Link>

              {/* Auth Buttons Mobile */}
              <div className="pt-4 border-t border-transparent space-y-2">
                {isSignedIn ? (
                  <div className="flex items-center justify-center py-2">
                    <UserButton 
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          avatarBox: "h-10 w-10",
                          userButtonPopoverCard: "bg-background border-border",
                          userButtonPopoverActionButton: "text-foreground hover:bg-secondary",
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/login"
                      className="block py-2 px-4 text-white hover:text-white border border-white rounded hover:border-white transition-colors text-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="block py-2 px-4 bg-white text-black rounded hover:bg-gray-200 transition-colors text-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>

              {/* Language Switcher Mobile */}
              <div className="pt-4 border-t border-transparent space-y-2">
                <h3 className="text-sm font-medium text-white">{t('language')}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setLanguage('en');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex-1 py-2 px-3 rounded text-sm transition-colors ${
                      language === 'en'
                        ? 'bg-white text-black font-semibold'
                        : 'border border-white text-white hover:bg-white/10'
                    }`}
                  >
                    ENG
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('al');
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex-1 py-2 px-3 rounded text-sm transition-colors ${
                      language === 'al'
                        ? 'bg-white text-black font-semibold'
                        : 'border border-white text-white hover:bg-white/10'
                    }`}
                  >
                    ALB
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.nav>
  );
};

export default Navigation;