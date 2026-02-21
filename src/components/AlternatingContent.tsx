import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface AlternatingContentProps {
  sections: Array<{
    title: string;
    description: string;
    image: string;
    imageAlt: string;
    reversed?: boolean;
  }>;
}

export const AlternatingContent = ({ sections }: AlternatingContentProps) => {
  const [visibleSections, setVisibleSections] = useState<boolean[]>(
    new Array(sections.length).fill(false)
  );
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = sectionRefs.current.indexOf(entry.target as HTMLDivElement);
          if (index !== -1) {
            setVisibleSections((prev) => {
              const newState = [...prev];
              newState[index] = entry.isIntersecting;
              return newState;
            });
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full">
      {sections.map((section, index) => (
        <div
          key={index}
          ref={(el) => {
            sectionRefs.current[index] = el;
          }}
          className={cn(
            "min-h-screen flex items-center justify-center px-4 md:px-8 py-16 transition-all duration-1000",
            visibleSections[index] ? "opacity-100" : "opacity-0",
            visibleSections[index] ? "translate-y-0" : "translate-y-8"
          )}
        >
          <div
            className={cn(
              "grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-6xl w-full items-center",
              section.reversed ? "md:grid-cols-2" : "md:grid-cols-2"
            )}
          >
            {/* Image section */}
            <div
              className={cn(
                "flex justify-center",
                section.reversed && "md:order-2"
              )}
            >
              <div className="relative w-full h-80 md:h-96 rounded-xl overflow-hidden shadow-2xl transform transition-transform duration-500 hover:scale-105">
                <img
                  src={section.image}
                  alt={section.imageAlt}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Text section */}
            <div
              className={cn(
                "flex flex-col justify-center",
                section.reversed && "md:order-1"
              )}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
                {section.title}
              </h2>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                {section.description}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
