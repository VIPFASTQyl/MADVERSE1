import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";

const Footer = () => {
  const { t } = useLanguage();

  const getHoverClass = (name: string) => {
    switch (name) {
      case "Instagram":
        return "hover:text-[#FF7A00]";
      case "Facebook":
        return "hover:text-[#39569c]";
      case "YouTube":
        return "hover:text-[#FF0000]";
      default:
        return "hover:text-foreground";
    }
  };
  return (
    <footer className="py-16 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <motion.img
            src="/MADVESERlong.png"
            alt="MADVERSE Logo"
            className="h-12"
            whileHover={{ scaleX: 1.2 }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            {t('copyrightText')}
          </p>
          
          <div className="flex items-center gap-4">
            {[
              { name: "Instagram", url: "https://www.instagram.com/madverse_org/" },
              { name: "YouTube", url: "https://www.youtube.com/channel/UCbowHpyDkY6y6lmtkBgjK7w" },
              { name: "Facebook", url: "https://www.facebook.com/profile.php?id=61586336113573" }
            ].map((social) => (
              <motion.a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -3 }}
                className={`text-sm text-muted-foreground ${getHoverClass(social.name)} transition-colors`}
              >
                {social.name}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;