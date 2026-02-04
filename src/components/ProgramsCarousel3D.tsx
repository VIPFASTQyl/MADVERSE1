import { useEffect, useState, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { getActivitiesByLanguage } from "@/lib/activityService";
import { ChevronLeft, ChevronRight, Users } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";

interface Program {
  id: string;
  title: string;
  category: string;
  image: string;
  currentParticipants: number;
  maxParticipants: number;
}

const ProgramsCarousel3D = () => {
  const { language } = useLanguage();
  const isMobile = useIsMobile();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [tiltState, setTiltState] = useState<{ [key: string]: { x: number; y: number } }>({});
  const touchStartX = useRef<number | null>(null);
  const [api, setApi] = useState<any>(null);

  useEffect(() => {
    loadPrograms();
  }, [language]);

  useEffect(() => {
    if (!api) {
      return;
    }

    const onSelect = () => {
      setCurrentSlide(api.selectedScrollSnap());
    };

    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const loadPrograms = async () => {
    try {
      const activities = await getActivitiesByLanguage(language);
      
      const mappedPrograms: Program[] = activities.map((activity: any) => ({
        id: activity.id,
        title: activity.title,
        category: activity.category,
        image: activity.image_url || "/Hero.png",
        currentParticipants: activity.current_participants || 0,
        maxParticipants: activity.max_participants || 50,
      }));
      
      setPrograms(mappedPrograms);
    } catch (error) {
      console.error("Error loading programs:", error);
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

  // Mobile carousel view
  if (isMobile) {
    return (
      <div className="w-full bg-black py-20">
        <style>{`
          .mobile-carousel-wrapper {
            max-width: 100%;
            padding: 0 16px;
          }

          .carousel-header {
            margin-bottom: 32px;
          }

          .carousel-header h2 {
            font-size: 24px;
            font-weight: bold;
            color: white;
            margin: 0 0 12px 0;
          }

          .carousel-header .divider {
            width: 60px;
            height: 3px;
            background: #ef4444;
            border-radius: 2px;
          }

          .mobile-carousel-card {
            position: relative;
            width: 100%;
            height: 350px;
            border-radius: 12px;
            overflow: hidden;
            flex-shrink: 0;
          }

          .mobile-carousel-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .mobile-carousel-content {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 20px;
            background: linear-gradient(to top, rgba(0,0,0,0.95), rgba(0,0,0,0.6), transparent);
            z-index: 5;
          }

          .mobile-carousel-category {
            position: absolute;
            top: 12px;
            right: 12px;
            display: inline-block;
            padding: 6px 12px;
            background: #ef4444;
            color: white;
            font-size: 11px;
            font-weight: 600;
            border-radius: 16px;
            z-index: 10;
          }

          .mobile-carousel-title {
            font-size: 16px;
            font-weight: 600;
            color: white;
            margin: 0 0 8px 0;
            line-height: 1.3;
          }

          .mobile-carousel-stats {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.9);
            display: flex;
            align-items: center;
            gap: 6px;
          }

          .carousel-dots {
            display: flex;
            justify-content: center;
            gap: 8px;
            margin-top: 24px;
          }

          .carousel-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
          }

          .carousel-dot:hover {
            background: rgba(255, 255, 255, 0.6);
            transform: scale(1.2);
          }

          .carousel-dot.active {
            background: white;
            width: 24px;
            border-radius: 4px;
            box-shadow: 0 0 8px rgba(239, 68, 68, 0.4);
          }

          /* Smooth carousel transition */
          .carousel-content-wrapper {
            overflow: hidden;
          }

          .carousel-content-item {
            transition: opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1);
          }
        `}</style>

        <div className="mobile-carousel-wrapper">
          <div className="carousel-header">
            <h2>{language === "en" ? "Our Programs" : "Programet Tona"}</h2>
            <div className="divider"></div>
          </div>

          <Carousel
            opts={{
              align: "center",
              loop: true,
            }}
            className="w-full"
            setApi={setApi}
          >
            <CarouselContent className="scroll-smooth">
              {programs.map((program) => (
                <CarouselItem key={program.id} className="basis-full">
                  <div className="mobile-carousel-card">
                    <img src={program.image} alt={program.title} className="mobile-carousel-image" />
                    <div className="mobile-carousel-category">{program.category}</div>
                    <div className="mobile-carousel-content">
                      <h3 className="mobile-carousel-title">{program.title}</h3>
                      <div className="mobile-carousel-stats">
                        <Users size={14} />
                        <span>{program.currentParticipants}/{program.maxParticipants}</span>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          <div className="carousel-dots">
            {programs.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentSlide(index);
                  api?.scrollTo(index);
                }}
                className={`carousel-dot ${currentSlide === index ? "active" : ""}`}
                aria-label={`Go to program ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Desktop carousel view
  return (
    <div className="w-full bg-black py-20">
      <style>{`
        .carousel-wrapper {
          position: relative;
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          perspective: 1200px;
        }

        .carousel-header {
          margin-bottom: 60px;
        }

        .carousel-header h2 {
          font-size: 32px;
          font-weight: bold;
          color: white;
          margin: 0 0 16px 0;
        }

        .carousel-header .divider {
          width: 80px;
          height: 4px;
          background: #ef4444;
          border-radius: 2px;
        }

        .slick-slider {
          position: relative;
          display: block;
          background: black;
          padding: 60px 0 120px 0;
          perspective: 1200px;
          height: 500px;
          touch-action: pan-y;
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
          width: 340px;
          height: 420px;
          margin: 0;
          padding: 0;
          transform-style: preserve-3d;
          transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);
          flex-shrink: 0;
        }

        @media (max-width: 768px) {
          .slick-slide {
            width: 100%;
            height: 300px;
            position: absolute;
            left: 0;
            top: 0;
            opacity: 0;
            transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1);
          }

          .slick-slide.active {
            opacity: 1;
            position: relative;
            left: auto;
            top: auto;
          }
        }

        /* Hover state - bring card to front and stack upward */
        .slick-slide:hover {
          z-index: 100 !important;
          transform: translateY(-20px) !important;
        }

        /* Fan layout - cards spread horizontally with rotation */
        .slick-slide:nth-child(1) {
          transform: rotateY(-28deg) rotateZ(-8deg);
          margin-right: -80px;
          opacity: 0.5;
          z-index: 1;
        }

        .slick-slide:nth-child(2) {
          transform: rotateY(-12deg) rotateZ(-3deg);
          margin-right: -60px;
          opacity: 0.75;
          z-index: 2;
        }

        .slick-slide:nth-child(3) {
          transform: rotateY(0deg) rotateZ(0deg);
          margin: 0 -40px;
          opacity: 1;
          z-index: 5;
        }

        .slick-slide:nth-child(4) {
          transform: rotateY(12deg) rotateZ(3deg);
          margin-left: -60px;
          opacity: 0.75;
          z-index: 2;
        }

        .slick-slide:nth-child(5) {
          transform: rotateY(28deg) rotateZ(8deg);
          margin-left: -80px;
          opacity: 0.5;
          z-index: 1;
        }

        @media (max-width: 768px) {
          .slick-slide:nth-child(1),
          .slick-slide:nth-child(2),
          .slick-slide:nth-child(4),
          .slick-slide:nth-child(5) {
            transform: none;
            margin: 0;
            opacity: 0;
          }

          .slick-slide:nth-child(3) {
            transform: none;
            margin: 0;
            opacity: 1;
          }
        }

        .slick-slide:nth-child(n+6) {
          display: none;
        }

        .slide-content {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          display: flex;
          flex-direction: column;
          
          /* Performance optimization */
          will-change: transform, box-shadow;
          transform-style: preserve-3d;
          perspective: 1000px;
          
          /* Base state with subtle tilt */
          transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }

        /* Hover state - lift and scale */
        .slide-content:hover {
          transform: rotateX(var(--tilt-x, 0deg)) rotateY(var(--tilt-y, 0deg)) translateY(-12px) scale(1.05);
          box-shadow: 
            0 8px 16px rgba(0, 0, 0, 0.15),
            0 20px 60px rgba(239, 68, 68, 0.2),
            0 40px 100px rgba(0, 0, 0, 0.3);
          z-index: 20;
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
          padding: 24px;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          position: relative;
          z-index: 5;
          background: linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.5), transparent);
        }

        .slide-category-top {
          position: absolute;
          top: 24px;
          right: 24px;
          z-index: 6;
        }

        .slide-category {
          display: inline-block;
          padding: 6px 12px;
          background: #ef4444;
          color: white;
          font-size: 12px;
          font-weight: 600;
          border-radius: 20px;
          width: fit-content;
        }

        .slide-title {
          font-size: 20px;
          font-weight: 600;
          color: #fff;
          margin: 0 0 12px 0;
          line-height: 1.3;
        }

        .slide-stats {
          font-size: 14px;
          color: #fff;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .slick-arrow {
          display: none;
        }

        .slick-dots {
          display: none;
        }

        /* Mobile swipe indicator - progress slider */
        .swipe-indicator {
          display: none;
        }
      `}</style>

      <div className="carousel-wrapper">
        <div className="carousel-header">
          <h2>{language === "en" ? "Our Programs" : "Programet Tona"}</h2>
          <div className="divider"></div>
        </div>

        <div className="slick-slider">
          <div className="slick-list" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
            <div 
              className="slick-track"
            >
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
                        <Users size={18} className="text-white" />
                        <span>
                          {program.currentParticipants}/{program.maxParticipants}{" "}
                          {language === "en" ? "Registered" : "Të Regjistruar"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button className="slick-arrow slick-prev" onClick={goToPrevious} aria-label="Previous slide">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button className="slick-arrow slick-next" onClick={goToNext} aria-label="Next slide">
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dot Navigation */}
          <ul className="slick-dots">
            {programs.slice(0, 5).map((_, index) => (
              <li key={index} className={index === currentSlide ? "active" : ""}>
                <button onClick={() => goToSlide(index)} aria-label={`Go to slide ${index + 1}`} />
              </li>
            ))}
          </ul>

          {/* Mobile Progress Slider */}
          <div 
            className="swipe-indicator"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const percentage = clickX / rect.width;
              const newSlide = Math.round(percentage * 4);
              goToSlide(Math.max(0, Math.min(newSlide, 4)));
            }}
          >
            <div 
              className="swipe-indicator-fill" 
              style={{
                width: `${(currentSlide / 4) * 100}%`
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramsCarousel3D;
