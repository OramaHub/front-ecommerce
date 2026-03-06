import { useEffect, useRef, useState } from "react";
import { R2_BASE } from "../constants/r2";

const tecido = `${R2_BASE}/tecido.png`;
const man = `${R2_BASE}/man.png`;

const FEATURES = [
  {
    number: "01",
    title: "Tecido Premium",
    description:
      "Algodão brim peletizado com alta gramatura. Superfície encorpada, toque macio e resistência superior.",
  },
  {
    number: "02",
    title: "Costuras Reforçadas",
    description:
      "Resistem ao desgaste diário, suor e lavagens. Controle de qualidade rigoroso em cada unidade.",
  },
  {
    number: "03",
    title: "Acabamento Premium",
    description:
      "Maior densidade de fios — rigidez estrutural e toque que você sente antes mesmo de usar.",
  },
];

export function PremiumProcess() {
  const sectionRef = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-white py-16 md:py-24 lg:py-32 px-4 md:px-8 lg:px-16 overflow-hidden"
    >
      <div className="max-w-[1400px] mx-auto">
        {/* ── Header ── */}
        <div className="text-center mb-16 md:mb-24">
          <p className="font-jakarta text-[0.7rem] md:text-xs font-semibold tracking-[0.25em] uppercase text-[#86868b] mb-3">
            Our process
          </p>
          <h2 className="font-jakarta text-3xl md:text-5xl lg:text-[3.5rem] font-bold text-[#1d1d1f] leading-[1.05] tracking-tight">
            Como produzimos
            <br />
            <span className="text-[#86868b]">o modelo premium.</span>
          </h2>
        </div>

        {/* ── Split Layout: fabric image left + features right ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-16 md:mb-24 items-center">
          {/* Fabric image — natural portrait shape */}
          <div
            className={`relative overflow-hidden bg-[#f5f5f0] transition-all duration-700 ease-out ${revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
              }`}
          >
            <img
              src={tecido}
              alt="Tecido premium brim peletizado"
              className="w-full h-auto block"
            />
          </div>

          {/* Features list */}
          <div className="flex flex-col gap-10">
            <div>
              <p className="font-jakarta text-[0.7rem] font-semibold tracking-[0.2em] uppercase text-[#86868b] mb-2">
                Materiais
              </p>
              <h3 className="font-jakarta text-2xl md:text-3xl font-bold text-[#1d1d1f] leading-tight">
                Qualidade que você sente
                <br />
                <span className="text-[#86868b]">antes mesmo de usar.</span>
              </h3>
            </div>

            {FEATURES.map((feat, idx) => (
              <div
                key={feat.number}
                className={`flex gap-5 transition-all duration-700 ease-out ${revealed
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
                  }`}
                style={{ transitionDelay: `${200 + idx * 150}ms` }}
              >
                <span className="font-jakarta text-3xl md:text-4xl font-bold text-[#e5e5e5] leading-none flex-shrink-0">
                  {feat.number}
                </span>
                <div>
                  <h4 className="font-jakarta text-base md:text-lg font-bold text-[#1d1d1f] mb-1">
                    {feat.title}
                  </h4>
                  <p className="font-jakarta text-sm text-[#86868b] leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Model Image — full width with contained height ── */}
        <div
          className={`relative w-full overflow-hidden bg-[#CFDDF9] flex items-end justify-center transition-all duration-700 ease-out ${revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
            }`}
          style={{ height: "clamp(300px, 50vw, 500px)", transitionDelay: "600ms" }}
        >
          <img
            src={man}
            alt="Modelo usando boné premium"
            className="h-[95%] object-contain"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />
          <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 text-right">
            <p className="font-jakarta text-sm md:text-base font-medium text-[#1d1d1f]/60">
              Feito para durar.
            </p>
            <a
              href="/produtos"
              className="inline-block mt-3 font-jakarta text-sm font-medium text-[#1d1d1f] border-b border-[#1d1d1f] pb-0.5 transition-colors duration-200 hover:text-[#0066CC] hover:border-[#0066CC]"
            >
              Conheça nossos modelos
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
