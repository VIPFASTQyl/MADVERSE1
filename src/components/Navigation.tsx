import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { ChevronDown, Menu, X, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { t, setLanguage, language } = useLanguage();
  const { session, signOut, isAdmin } = useAuth();

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
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* MADVERSE and Logo */}
          <div className="flex items-center gap-4">
            <div
              className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              onClick={() => {
                if (location.pathname !== "/") {
                  navigate("/");
                  setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
                } else {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
            >
              MADVERSE
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
              <div className="flex items-center gap-2 ml-4">
                <Link
                  to="/profile"
                  className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Profile
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin/dashboard"
                    className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <button
                  onClick={async () => {
                    await signOut();
                    navigate('/');
                  }}
                  className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="ml-4 px-4 py-2 text-sm bg-white text-black rounded hover:bg-gray-200 transition-colors"
              >
                Login
              </Link>
            )}
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
                className="block py-2 text-muted-foreground hover:text-foreground transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/#showcase");
                  setIsMobileMenuOpen(false);
                }}
              >
                {t('activities')}
              </a>
              
              {/* Mobile Activities Dropdown */}
              <div className="pl-4 space-y-1 border-l border-border/50">
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
              </div>
              
              <Link
                to="/about"
                className="block py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('about')}
              </Link>
              <Link
                to="/contact"
                className="block py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {t('contact')}
              </Link>

              {/* Language Options */}
              <div className="pt-4 border-t border-border">
                <p className="text-sm font-medium mb-2">{t('language')}</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setLanguage('al')}
                    className={`px-3 py-1 text-sm rounded-md transition-all ${
                      language === 'al'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary hover:bg-secondary/80'
                    }`}
                  >
                    ALB
                  </button>
                  <button
                    onClick={() => setLanguage('en')}
                    className={`px-3 py-1 text-sm rounded-md transition-all ${
                      language === 'en'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary hover:bg-secondary/80'
                    }`}
                  >
                    ENG
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