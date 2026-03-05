import { useEffect, useRef, useState } from "react";

const IMAGES = [
    {
        src: "https://pub-12950bec3a884d16a0d3965e30dc4e9f.r2.dev/mulherdefrentebone.png",
        alt: "Modelo usando boné preto - vista frontal",
        label: "Dad Hat Classic",
    },
    {
        src: "https://pub-12950bec3a884d16a0d3965e30dc4e9f.r2.dev/mulhercostastelinha.png",
        alt: "Modelo usando boné preto - vista traseira",
        label: "Trucker Mesh",
    },
    {
        src: "https://pub-12950bec3a884d16a0d3965e30dc4e9f.r2.dev/homem%20bon%C3%A9.png",
        alt: "Modelo usando boné branco",
        label: "Dad Hat White",
    },
];

/* Vertical offsets for stagger effect (middle card higher) */
const STAGGER = ["md:mt-16", "md:mt-0", "md:mt-10"];

export function LifestyleSection() {
    const gridRef = useRef<HTMLDivElement>(null);
    const [revealed, setRevealed] = useState(false);

    /* ── Scroll reveal ── */
    useEffect(() => {
        const el = gridRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setRevealed(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.15 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <section className="bg-[#f5f5f0] py-16 md:py-24 lg:py-32 px-4 md:px-8 lg:px-16">
            <div className="max-w-[1400px] mx-auto">
                {/* ── Header ── */}
                <div className="text-center mb-12 md:mb-20">
                    <p className="font-jakarta text-[0.7rem] md:text-xs font-semibold tracking-[0.25em] uppercase text-[#86868b] mb-3">
                        Worn by everyone
                    </p>
                    <h2 className="font-jakarta text-3xl md:text-5xl lg:text-[3.5rem] font-bold text-[#1d1d1f] leading-[1.05] tracking-tight">
                        Feito para usar.
                        <br />
                        <span className="text-[#86868b]">Feito para viver.</span>
                    </h2>
                </div>

                {/* ── Photo Grid — staggered ── */}
                <div ref={gridRef} className="grid grid-cols-3 gap-3 md:gap-5 items-start">
                    {IMAGES.map((img, idx) => (
                        <div
                            key={idx}
                            className={`${STAGGER[idx]} transition-all duration-700 ease-out ${revealed
                                    ? "opacity-100 translate-y-0"
                                    : "opacity-0 translate-y-12"
                                }`}
                            style={{ transitionDelay: `${idx * 150}ms` }}
                        >
                            <div
                                className="group relative overflow-hidden bg-[#d5d0c8] cursor-pointer"
                                style={{ aspectRatio: "3 / 4.8" }}
                            >
                                {/* Image pinned to bottom, zoom on hover */}
                                <div className="absolute inset-0 flex items-end">
                                    <img
                                        src={img.src}
                                        alt={img.alt}
                                        loading="lazy"
                                        className="w-full h-[85%] object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                                    />
                                </div>

                                {/* Model label on hover */}
                                <div className="absolute bottom-0 left-0 right-0 p-3 md:p-5 z-10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                                    <div className="bg-white/90 backdrop-blur-sm px-4 py-2.5 inline-block">
                                        <p className="font-jakarta text-[0.65rem] md:text-xs font-semibold tracking-[0.1em] uppercase text-[#1d1d1f]">
                                            {img.label}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── CTA — Apple pill button ── */}
                <div className="text-center mt-10 md:mt-16">
                    <p className="font-jakarta text-sm md:text-base text-[#86868b] max-w-md mx-auto mb-6">
                        Do casual ao premium. Um acessório, infinitas possibilidades.
                    </p>
                    <a
                        href="/produtos"
                        className="inline-flex items-center px-8 py-3 rounded-full bg-[#1d1d1f] text-white font-jakarta text-sm font-medium tracking-wide transition-all duration-300 hover:bg-[#000000] cursor-pointer"
                    >
                        Explorar coleção
                    </a>
                </div>
            </div>
        </section>
    );
}
