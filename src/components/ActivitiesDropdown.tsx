import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const ActivitiesDropdown = () => {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activities = [
    { label: t('youth'), href: '/activity/youth' },
    { label: t('arts'), href: '/activity/arts' },
    { label: t('culture'), href: '/activity/culture' },
    { label: t('sports'), href: '/activity/sports' },
    { label: t('exhibition'), href: '/activity/exhibition' },
    { label: t('volunteering'), href: '/activity/volunteering' },
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [open]);

  return (
    <motion.div ref={dropdownRef} animate={open ? "open" : "closed"} className="relative">
      <button
        onClick={() => setOpen((pv) => !pv)}
        className="px-4 py-2 text-sm text-white hover:text-white transition-colors flex items-center gap-1"
      >
        <span>{t('activities')}</span>
        <motion.span variants={iconVariants}>
          <ChevronDown size={16} />
        </motion.span>
      </button>

      <motion.div
        initial={wrapperVariants.closed}
        variants={wrapperVariants}
        style={{ originY: "top" }}
        className="absolute left-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg overflow-hidden"
      >
        <motion.div className="py-2">
          {activities.map((activity, index) => (
            <ActivityOption 
              key={index}
              label={activity.label} 
              href={activity.href}
              setOpen={setOpen}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const ActivityOption = ({ label, href, setOpen }) => {
  return (
    <motion.div
      variants={itemVariants}
      onClick={() => setOpen(false)}
    >
      <Link
        to={href}
        className="flex items-center gap-2 w-full px-4 py-2 text-sm font-medium whitespace-nowrap text-white hover:bg-secondary transition-colors"
      >
        <span>{label}</span>
      </Link>
    </motion.div>
  );
};

export default ActivitiesDropdown;

const wrapperVariants = {
  open: {
    scaleY: 1,
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.05,
    },
  },
  closed: {
    scaleY: 0,
    opacity: 0,
    transition: {
      when: "afterChildren",
      staggerChildren: 0.05,
    },
  },
};

const iconVariants = {
  open: { rotate: 180 },
  closed: { rotate: 0 },
};

const itemVariants = {
  open: {
    opacity: 1,
    y: 0,
    transition: {
      when: "beforeChildren",
    },
  },
  closed: {
    opacity: 0,
    y: -10,
    transition: {
      when: "afterChildren",
    },
  },
};
