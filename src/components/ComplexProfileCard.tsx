import { motion } from "framer-motion";
import { Mail, Github, Linkedin, Twitter } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface SocialLink {
  icon: React.ReactNode;
  link: string;
  color?: string;
}

interface ComplexProfileCardProps {
  image: string;
  name: string;
  position: string;
  description: string;
  social?: SocialLink[];
  index?: number;
}

const ComplexProfileCard = ({
  image,
  name,
  position,
  description,
  social = [],
  index = 0,
}: ComplexProfileCardProps) => {
  const isMobile = useIsMobile();

  // Image-only version (for team showcase)
  if (isMobile) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="h-full flex-shrink-0 w-40"
      >
        <div className="bg-gradient-to-b from-gray-800 to-black rounded-2xl overflow-hidden shadow-2xl h-full flex flex-col items-center justify-center p-4">
          {/* Mobile Image */}
          <div className="relative mb-4 w-24 h-24 rounded-full overflow-hidden border-2 border-cyan-400">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
          {/* Mobile Name Only */}
          <h3 className="text-lg font-bold text-white text-center">{name}</h3>
        </div>
      </motion.div>
    );
  }

  // Desktop version - show full card
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="h-full"
    >
      <div className="bg-gradient-to-b from-gray-800 to-black rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 h-full flex flex-col">
        {/* Image Section */}
        <div className="relative pb-0">
          <img
            src={image}
            alt={name}
            className="w-full h-96 object-cover object-center"
            loading="eager"
            decoding="sync"
          />
        </div>

        {/* Content Section */}
        <div className="px-6 py-8 flex-grow flex flex-col justify-between">
          {/* Info */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-1">{name}</h3>
            <p className="text-cyan-400 text-sm font-semibold mb-4">{position}</p>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              {description}
            </p>
          </div>

          {/* Social Links */}
          {social.length > 0 && (
            <div className="flex gap-3 pt-4 border-t border-gray-700">
              {social.map((link, idx) => (
                <a
                  key={idx}
                  href={link.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 border border-white/10 hover:border-white/30"
                  aria-label="Social link"
                >
                  <div className="text-white">
                    {link.icon}
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ComplexProfileCard;
