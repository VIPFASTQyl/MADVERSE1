import { useEffect, useState, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getActivitiesByLanguage } from "@/lib/activityService";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";

interface Program {
  id: string;
  title: string;
  category: string;
  image: string;
  currentParticipants: number;
  maxParticipants: number;
}

// Demo programs shown immediately
const getDemoPrograms = (language: string): Program[] => [
  {
    id: "demo-1",
    title: language === "en" ? "Youth Development" : "Zhvillimi i Të Rinjve",
    category: language === "en" ? "Youth" : "Të Rinj",
    image: "/Hero.png",
    currentParticipants: 24,
    maxParticipants: 50,
  },
  {
    id: "demo-2",
    title: language === "en" ? "Arts Workshop" : "Punëtori Arti",
    category: language === "en" ? "Arts" : "Arti",
    image: "/Hero.png",
    currentParticipants: 18,
    maxParticipants: 40,
  },
  {
    id: "demo-3",
    title: language === "en" ? "Cultural Exchange" : "Këmbimi Kulturor",
    category: language === "en" ? "Culture" : "Kultura",
    image: "/Hero.png",
    currentParticipants: 32,
    maxParticipants: 60,
  },
  {
    id: "demo-4",
    title: language === "en" ? "Sports Academy" : "Akademia e Sportit",
    category: language === "en" ? "Sports" : "Sporti",
    image: "/Hero.png",
    currentParticipants: 45,
    maxParticipants: 80,
  },
  {
    id: "demo-5",
    title: language === "en" ? "Community Service" : "Shërbim Komunitar",
    category: language === "en" ? "Volunteering" : "Vullnetarizëm",
    image: "/Hero.png",
    currentParticipants: 36,
    maxParticipants: 100,
  },
];

const ProgramsCarousel3D = () => {
  const { language } = useLanguage();
  
  // Initialize with demo programs immediately
  const [programs, setPrograms] = useState<Program[]>(getDemoPrograms(language));
  const [currentSlide, setCurrentSlide] = useState(0);
  const [tiltState, setTiltState] = useState<{ [key: string]: { x: number; y: number } }>({});
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    loadPrograms();
  }, [language]);

  const loadPrograms = async () => {
    try {
      console.log("🎠 Loading real programs for language:", language);
      const activities = await getActivitiesByLanguage(language);
      
      if (activities && activities.length > 0) {
        console.log("🎠 Real programs loaded:", activities);
        const mappedPrograms: Program[] = activities.map((activity: any) => ({
          id: activity.id,
          title: activity.title,
          category: activity.category,
          image: activity.image_url || "/Hero.png",
          currentParticipants: activity.current_participants || 0,
          maxParticipants: activity.max_participants || 50,
        }));
        setPrograms(mappedPrograms);
      }
    } catch (error) {
      console.error("Error loading real programs:", error);
      // Keep showing demo programs if error
    }
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev === 0 ? programs.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev === programs.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, programId: string) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    
    // Calculate position relative to card center
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    // Calculate tilt (max 8 degrees)
    const tiltX = y * 16;
    const tiltY = x * -16;
    
    setTiltState(prev => ({
      ...prev,
      [programId]: { x: tiltX, y: tiltY }
    }));
  };

  const handleMouseLeave = (programId: string) => {
    setTiltState(prev => ({
      ...prev,
      [programId]: { x: 0, y: 0 }
    }));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current !== null) {
      const touchEndX = e.changedTouches[0].clientX;
      const distance = touchStartX.current - touchEndX;
      
      // 50px swipe threshold
      if (distance > 50) {
        // Swiped left - go to next
        goToNext();
      } else if (distance < -50) {
        // Swiped right - go to previous
        goToPrevious();
      }
    }
    
    touchStartX.current = null;
  };

  if (programs.length === 0) {
    return null;
  }

  // Both mobile and desktop: Same 3D fan layout, responsive sizing
  return (
    <div className="w-full bg-black py-12 md:py-20">
      <style>{`
        .carousel-wrapper {
          position: relative;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 16px;
          perspective: 1200px;
        }

        @media (min-width: 768px) {
          .carousel-wrapper {
            padding: 0 80px;
          }
        }

        .carousel-header {
          margin-bottom: 32px;
        }

        @media (min-width: 768px) {
          .carousel-header {
            margin-bottom: 60px;
          }
        }

        .carousel-header h2 {
          font-size: 24px;
          font-weight: bold;
          color: white;
          margin: 0 0 12px 0;
        }

        @media (min-width: 768px) {
          .carousel-header h2 {
            font-size: 36px;
            margin: 0 0 16px 0;
          }
        }

        .carousel-header .divider {
          width: 60px;
          height: 3px;
          background: #ef4444;
          border-radius: 2px;
        }

        @media (min-width: 768px) {
          .carousel-header .divider {
            width: 80px;
            height: 4px;
          }
        }

        .slick-slider {
          position: relative;
          display: block;
          background: black;
          padding: 30px 0 60px 0;
          perspective: 1200px;
          height: 280px;
          touch-action: pan-y;
        }

        @media (min-width: 768px) {
          /* push the carousel lower so hover lift doesn't overlap the header */
          .slick-slider {
            padding: 60px 0 128px 0;
            height: 384px;
          }
        }

        .slick-list {
          position: relative;
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
          overflow: visible;
          touch-action: pan-y;
        }

        .slick-track {
          position: relative;
          width: 100%;
          height: 100%;
          perspective: 1200px;
          transform-style: preserve-3d;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .slick-slide {
          position: relative;
          width: 200px;
          height: 240px;
          margin: 0;
          padding: 0;
          transform-style: preserve-3d;
          transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);
          flex-shrink: 0;
        }

        @media (min-width: 768px) {
          .slick-slide {
            width: 384px;
            height: 384px;
          }
        }

        .slick-slide:hover {
          z-index: 100 !important;
          transform: translateY(-10px) !important;
        }

        @media (min-width: 768px) {
          .slick-slide:hover {
            transform: translateY(-12px) !important;
          }
        }

        .slick-slide:nth-child(1) {
          transform: rotateY(-20deg) rotateZ(-5deg);
          margin-right: -40px;
          opacity: 0.5;
          z-index: 1;
        }

        @media (min-width: 768px) {
          .slick-slide:nth-child(1) {
            transform: rotateY(-28deg) rotateZ(-8deg);
            margin-right: -80px;
          }
        }

        .slick-slide:nth-child(2) {
          transform: rotateY(-8deg) rotateZ(-2deg);
          margin-right: -30px;
          opacity: 0.75;
          z-index: 2;
        }

        @media (min-width: 768px) {
          .slick-slide:nth-child(2) {
            transform: rotateY(-12deg) rotateZ(-3deg);
            margin-right: -60px;
          }
        }

        .slick-slide:nth-child(3) {
          transform: rotateY(0deg) rotateZ(0deg);
          margin: 0 -20px;
          opacity: 1;
          z-index: 5;
        }

        @media (min-width: 768px) {
          .slick-slide:nth-child(3) {
            margin: 0 -40px;
          }
        }

        .slick-slide:nth-child(4) {
          transform: rotateY(8deg) rotateZ(2deg);
          margin-left: -30px;
          opacity: 0.75;
          z-index: 2;
        }

        @media (min-width: 768px) {
          .slick-slide:nth-child(4) {
            transform: rotateY(12deg) rotateZ(3deg);
            margin-left: -60px;
          }
        }

        .slick-slide:nth-child(5) {
          transform: rotateY(20deg) rotateZ(5deg);
          margin-left: -40px;
          opacity: 0.5;
          z-index: 1;
        }

        @media (min-width: 768px) {
          .slick-slide:nth-child(5) {
            transform: rotateY(28deg) rotateZ(8deg);
            margin-left: -80px;
          }
        }

        .slide-content {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: column;
          will-change: transform, box-shadow;
          transform-style: preserve-3d;
          perspective: 1000px;
          transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }

        @media (min-width: 768px) {
          .slide-content {
            border-radius: 16px;
          }
        }

        .slide-content:hover {
          transform: rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-6px) scale(1.05);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15), 0 20px 60px rgba(0, 0, 0, 0.2), 0 40px 100px rgba(0, 0, 0, 0.3);
          z-index: 20;
        }

        @media (min-width: 768px) {
          .slide-content:hover {
            transform: rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-8px) scale(1.05);
          }
        }

        .slide-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          transition: filter 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .slide-content:hover .slide-image {
          filter: brightness(1.1);
        }

        .slide-content-inner {
          padding: 12px;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          position: relative;
          z-index: 5;
          background: linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.5), transparent);
        }

        @media (min-width: 768px) {
          .slide-content-inner {
            padding: 24px;
          }
        }

        .slide-category-top {
          position: absolute;
          top: 12px;
          right: 12px;
          z-index: 6;
        }

        @media (min-width: 768px) {
          .slide-category-top {
            top: 24px;
            right: 24px;
          }
        }

        .slide-category {
          display: inline-block;
          padding: 4px 8px;
          background: #ef4444;
          color: white;
          font-size: 10px;
          font-weight: 600;
          border-radius: 20px;
          width: fit-content;
        }

        @media (min-width: 768px) {
          .slide-category {
            padding: 6px 12px;
            font-size: 12px;
          }
        }

        .slide-title {
          font-size: 14px;
          font-weight: 600;
          color: #fff;
          margin: 0 0 6px 0;
          line-height: 1.3;
        }

        @media (min-width: 768px) {
          .slide-title {
            font-size: 20px;
            margin: 0 0 12px 0;
          }
        }

        .slide-stats {
          font-size: 11px;
          color: #fff;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        @media (min-width: 768px) {
          .slide-stats {
            font-size: 14px;
            gap: 8px;
          }

          .slide-stats svg {
            width: 20px;
            height: 20px;
          }
        }
      `}</style>

      <div className="carousel-wrapper">
        <div className="carousel-header">
          <h2>{language === "en" ? "Our Programs" : "Programet Tona"}</h2>
          <div className="divider"></div>
        </div>

        <div className="slick-slider">
          <div className="slick-list" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
            <div className="slick-track">
              {programs.slice(0, 5).map((program, index) => (
                <div
                  key={program.id}
                  className={`slick-slide ${index === currentSlide ? "active" : ""}`}
                >
                  <div
                    className="slide-content"
                    onMouseMove={(e) => handleMouseMove(e, program.id)}
                    onMouseLeave={() => handleMouseLeave(program.id)}
                    style={{
                      '--tilt-x': `${tiltState[program.id]?.x || 0}deg`,
                      '--tilt-y': `${tiltState[program.id]?.y || 0}deg`,
                    } as React.CSSProperties & { '--tilt-x': string; '--tilt-y': string }}
                  >
                    <img
                      src={program.image}
                      alt={program.title}
                      className="slide-image"
                    />
                    <div className="slide-category-top">
                      <div className="slide-category">{program.category}</div>
                    </div>
                    <div className="slide-content-inner">
                      <h3 className="slide-title">{program.title}</h3>
                      <div className="slide-stats">
                        <Users size={14} className="text-white md:w-5 md:h-5" />
                        <span>
                          {program.currentParticipants}/{program.maxParticipants}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramsCarousel3D;
