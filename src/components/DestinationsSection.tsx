import { useEffect, useRef, useState } from "react";
import { DestinationsCarousel } from "./DestinationsCarousel";
import { caps } from "../data/caps";

const ENTRY_DURATION_MS = 2400;
const EXIT_DURATION_MS = 600;

type Phase = "idle" | "entry" | "exit" | "carousel";

export function DestinationsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPhase("entry");
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (phase === "entry") {
      const t = setTimeout(() => setPhase("exit"), ENTRY_DURATION_MS);
      return () => clearTimeout(t);
    }
    if (phase === "exit") {
      const t = setTimeout(() => setPhase("carousel"), EXIT_DURATION_MS);
      return () => clearTimeout(t);
    }
  }, [phase]);

  const isCarousel = phase === "carousel";

  return (
    <section ref={sectionRef} className="w-full overflow-hidden" style={{ paddingTop: "clamp(2rem, 4vw, 4rem)", paddingBottom: "clamp(4rem, 8vw, 8rem)" }}>
      <div
        style={{
          maxHeight: isCarousel ? "0" : "10rem",
          overflow: "hidden",
          opacity: phase === "entry" || phase === "exit" ? 1 : 0,
          marginBottom: isCarousel ? "0" : "3rem",
          transition: "opacity 0.15s ease",
        }}
      >
        <h2
          className="font-jakarta italic font-extralight text-center"
          style={{
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            opacity: phase !== "idle" ? 1 : 0,
            transform: phase !== "idle" ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
          }}
        >
          Feito para todos os seus destinos.
        </h2>
      </div>

      <div
        className="flex items-center justify-center gap-4 px-4"
        style={{
          opacity: phase === "entry" ? 1 : 0,
          transform: phase === "exit" ? "translateY(-20px)" : "translateY(0)",
          transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
          pointerEvents: phase === "entry" ? "auto" : "none",
          position: isCarousel ? "absolute" : "relative",
          visibility: isCarousel ? "hidden" : "visible",
        }}
      >
        {caps.map((cap, index) => (
          <img
            key={cap.id}
            src={cap.src}
            alt={cap.label}
            className="w-[10%] object-contain"
            style={{
              opacity: phase === "entry" ? 1 : 0,
              transform: phase === "entry" ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.7s ease-out, transform 0.7s ease-out",
              transitionDelay: phase === "entry" ? `${0.4 + index * 0.1}s` : "0s",
            }}
          />
        ))}
      </div>

      <div
        style={{
          opacity: isCarousel ? 1 : 0,
          transform: isCarousel ? "translateY(0)" : "translateY(20px)",
          transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
          pointerEvents: isCarousel ? "auto" : "none",
        }}
      >
        <DestinationsCarousel caps={caps} />
      </div>
    </section>
  );
}
