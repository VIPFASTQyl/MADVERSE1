import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useMotionTemplate } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, Menu, X, LogOut, ArrowLeft, User } from "lucide-react";
import { Button } from "./ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileActivitiesOpen, setIsMobileActivitiesOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const mobileUserDropdownRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { t, setLanguage, language } = useLanguage();
  const { session, signOut, isAdmin } = useAuth();

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
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node) && isUserDropdownOpen) {
        setIsUserDropdownOpen(false);
      }
      if (mobileUserDropdownRef.current && !mobileUserDropdownRef.current.contains(event.target as Node) && isUserDropdownOpen) {
        setIsUserDropdownOpen(false);
      }
    };

    if (isMobileMenuOpen || isUserDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen, isUserDropdownOpen]);

  return (
    <motion.nav
      ref={navRef}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-sm"
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
              className="px-4 py-2 text-sm text-white hover:text-white transition-colors cursor-pointer flex items-center gap-2"
              onClick={() => {
                if (location.pathname !== "/") {
                  navigate("/");
                  setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
                } else {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
            >
              {location.pathname !== "/" ? (
                <ArrowLeft size={24} className="text-white" />
              ) : (
                'MADVERSE'
              )}
            </div>
            <motion.div
              whileHover={{ scale: 1.09  }}
              className="cursor-pointer"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <img src="/PNG.png" alt="Logo" className="h-[30px] w-auto" />
            </motion.div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 ml-auto">
            <div className="relative group">
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/#showcase");
                }}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                {t('activities')}
                <ChevronDown size={16} className="group-hover:rotate-180 transition-transform" />
              </button>
              <div className="absolute left-0 mt-0 w-48 bg-background border border-border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                <Link to="/activity/youth" className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                  {t('youth')}
                </Link>
                <Link to="/activity/arts" className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                  {t('arts')}
                </Link>
                <Link to="/activity/culture" className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                  {t('culture')}
                </Link>
                <Link to="/activity/sports" className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                  {t('sports')}
                </Link>
                <Link to="/activity/exhibition" className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                  {t('exhibition')}
                </Link>
                <Link to="/activity/volunteering" className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                  {t('volunteering')}
                </Link>
              </div>
            </div>
            <Link
              to="/activities"
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Register a Program
            </Link>
            <Link
              to="/about"
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('about')}
            </Link>
            <Link
              to="/contact"
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {t('contact')}
            </Link>

            {/* Language Switcher */}
            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={() => setLanguage('al')}
                className={`px-3 py-1 text-sm transition-all border border-white ${
                  language === 'al'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                ALB
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 text-sm transition-all border border-white ${
                  language === 'en'
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                ENG
              </button>
            </div>

            {/* Auth Buttons */}
            {session ? (
              <div className="relative ml-auto" ref={userDropdownRef}>
                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="p-2 text-white hover:text-white transition-colors"
                >
                  <User size={20} />
                </button>
                <AnimatePresence>
                  {isUserDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg py-2 z-50"
                    >
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        {t('profile')}
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin/dashboard"
                          className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                          onClick={() => setIsUserDropdownOpen(false)}
                        >
                          Admin
                        </Link>
                      )}
                      <div className="border-t border-border/50 my-2"></div>
                      <div className="px-4 py-2 text-sm text-muted-foreground mb-2">
                        {session.user?.email}
                      </div>
                      <button
                        onClick={async () => {
                          await signOut();
                          navigate('/');
                          setIsUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors flex items-center gap-2"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-4">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors border border-muted-foreground rounded hover:border-foreground"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm bg-white text-black rounded hover:bg-gray-200 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Language Switcher */}
          <div className="md:hidden flex items-center gap-2 mr-2" ref={mobileUserDropdownRef}>
            <button
              onClick={() => setLanguage('al')}
              className={`px-2 py-1 text-xs transition-all border border-white ${
                language === 'al'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              ALB
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 text-xs transition-all border border-white ${
                language === 'en'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              ENG
            </button>

            {/* Mobile User Icon */}
            {session && (
              <button
                onClick={() => setIsUserDropdownOpen(prev => !prev)}
                className="p-2 text-white hover:text-white transition-colors"
              >
                <User size={20} />
              </button>
            )}

            {/* Mobile User Dropdown - Inside ref */}
            <AnimatePresence>
              {isUserDropdownOpen && session && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full right-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg py-2 z-50"
                >
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                    onClick={() => setIsUserDropdownOpen(false)}
                  >
                    {t('profile')}
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                      onClick={() => setIsUserDropdownOpen(false)}
                    >
                      Admin
                    </Link>
                  )}
                  <div className="border-t border-border/50 px-4 py-2">
                    <p className="text-sm text-muted-foreground">
                      {session.user?.email}
                    </p>
                  </div>
                  <button
                    onClick={async () => {
                      await signOut();
                      navigate('/');
                      setIsUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors flex items-center gap-2"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
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
            className="bg-background border-t border-border"
          >
            <div className="px-4 py-4 space-y-2">
              <div
                className="block py-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
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
                className="block py-2 text-muted-foreground hover:text-foreground transition-colors flex items-center justify-between cursor-pointer"
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
                    className="pl-4 space-y-1 border-l border-border/50"
                  >
                    <Link
                      to="/activity/youth"
                      className="block py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t('youth')}
                    </Link>
                    <Link
                      to="/activity/arts"
                      className="block py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t('arts')}
                    </Link>
                    <Link
                      to="/activity/culture"
                      className="block py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t('culture')}
                    </Link>
                    <Link
                      to="/activity/sports"
                      className="block py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t('sports')}
                    </Link>
                    <Link
                      to="/activity/exhibition"
                      className="block py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t('exhibition')}
                    </Link>
                    <Link
                      to="/activity/volunteering"
                      className="block py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t('volunteering')}
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <Link
                to="/activities"
                className="block py-2 text-muted-foreground hover:text-foreground transition-colors font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Register a Program
              </Link>
              <Link
                to="/about"
                className="block py-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('about')}
              </Link>
              <Link
                to="/contact"
                className="block py-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('contact')}
              </Link>

              {/* Auth Buttons Mobile */}
              <div className="pt-4 border-t border-border space-y-2">
                {!session ? (
                  <div className="space-y-2">
                    <Link
                      to="/login"
                      className="block py-2 px-4 text-muted-foreground hover:text-foreground border border-muted-foreground rounded hover:border-foreground transition-colors text-center"
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
                ) : null}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.nav>
  );
};

export default Navigation;