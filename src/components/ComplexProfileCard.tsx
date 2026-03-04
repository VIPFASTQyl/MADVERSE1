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
      <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-black rounded-3xl overflow-hidden shadow-2xl hover:shadow-cyan-900/50 hover:shadow-2xl transition-all duration-300 h-auto flex flex-col border border-cyan-500/20 hover:border-cyan-500/50">
        {/* Image Section */}
        <div className="relative pb-0 flex-shrink-0 overflow-hidden group">
          <img
            src={image}
            alt={name}
            className="w-full h-96 object-cover object-center group-hover:scale-105 transition-transform duration-300"
            loading="eager"
            decoding="sync"
          />
          {/* Image Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40"></div>
        </div>

        {/* Content Section */}
        <div className="px-8 py-10 flex-grow flex flex-col justify-start gap-6">
          {/* Info */}
          <div className="space-y-3">
            <h3 className="text-3xl font-bold text-white leading-tight">{name}</h3>
            <p className="text-cyan-400 text-base font-bold tracking-wide uppercase">{position}</p>
            {description && (
              <p className="text-gray-200 text-base leading-relaxed">
                {description}
              </p>
            )}
          </div>

          {/* Social Links */}
          {social.length > 0 && (
            <div className="flex gap-3 pt-4 border-t border-cyan-500/30">
              {social.map((link, idx) => (
                <a
                  key={idx}
                  href={link.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/30 transition-all duration-200 border border-cyan-500/30 hover:border-cyan-500/80 hover:scale-110"
                  aria-label="Social link"
                >
                  <div className="text-cyan-400 hover:text-cyan-200">
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
