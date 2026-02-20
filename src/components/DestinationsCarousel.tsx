import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import type { Cap } from "../types/cap";

interface DestinationsCarouselProps {
  caps: Cap[];
}

const getDistance = (index: number, activeIndex: number, total: number): number => {
  const raw = ((index - activeIndex) % total + total) % total;
  return raw > Math.floor(total / 2) ? raw - total : raw;
};

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return isMobile;
}

export function DestinationsCarousel({ caps }: DestinationsCarouselProps) {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeIndex, setActiveIndex] = useState(0);
  const [textVisible, setTextVisible] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const handleSelect = (index: number) => {
    clearTimeout(timeoutRef.current);
    setTextVisible(false);
    timeoutRef.current = setTimeout(() => {
      setActiveIndex(index);
      setTextVisible(true);
    }, 300);
  };

  const activeCap = caps[activeIndex];

  const activeWidth = isMobile ? "45%" : "22%";
  const adjacentWidth = isMobile ? "15%" : "12%";
  const capMargin = isMobile ? "0.75rem" : "2.5rem";

  return (
    <div>
      <div
        className="flex items-center justify-center px-4"
        style={{ height: "clamp(200px, 40vw, 400px)" }}
      >
        {caps.map((cap, index) => {
          const distance = getDistance(index, activeIndex, caps.length);
          const isActive = distance === 0;
          const isAdjacent = Math.abs(distance) === 1;
          const isVisible = isActive || isAdjacent;

          return (
            <div
              key={cap.id}
              onClick={() => isAdjacent && handleSelect(index)}
              style={{
                height: "100%",
                width: isActive ? activeWidth : isAdjacent ? adjacentWidth : "0%",
                opacity: isActive ? 1 : isAdjacent ? 0.35 : 0,
                marginLeft: isVisible ? capMargin : "0",
                marginRight: isVisible ? capMargin : "0",
                overflow: "hidden",
                flexShrink: 0,
                transition: "width 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s ease, margin 0.6s ease",
                cursor: isAdjacent ? "pointer" : "default",
              }}
            >
              <img
                src={cap.src}
                alt={cap.label}
                style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
              />
            </div>
          );
        })}
      </div>

      <div
        className="px-4 md:px-16 mt-6 md:mt-10 flex flex-col items-center text-center"
        style={{
          opacity: textVisible ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        <p className="font-jakarta font-bold text-[0.875rem] md:text-[1rem] mb-1">
          {activeCap.tagline}
        </p>
        <p className="font-jakarta font-light text-[0.875rem] md:text-[1rem] max-w-xl leading-tight tracking-[-0.02em] mb-6">
          {activeCap.description}
        </p>
        <button
          onClick={() => navigate(`/produto/${activeCap.productId}`)}
          className="font-jakarta h-[2.4375rem] w-[11.5625rem] cursor-pointer rounded-full border-0 bg-black text-[0.75rem] font-normal tracking-[0.05em] text-white transition-all duration-200 hover:bg-neutral-800 hover:scale-110"
        >
          CONHECER MODELO
        </button>
      </div>
    </div>
  );
}
