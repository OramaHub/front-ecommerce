import { useEffect, useRef, useState, useCallback } from "react";

const VIDEOS = [
    "https://pub-12950bec3a884d16a0d3965e30dc4e9f.r2.dev/videobannersite.mp4",
    "https://pub-12950bec3a884d16a0d3965e30dc4e9f.r2.dev/Luxury_Dad_Hat_Reveal_Video.mp4",
];

export function VideoBanner() {
    const sectionRef = useRef<HTMLElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    /* ── Lazy load: only start when section approaches viewport ── */
    useEffect(() => {
        const el = sectionRef.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: "200px" }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    /* ── When video ends, switch to the next one ── */
    const handleVideoEnded = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % VIDEOS.length);
    }, []);

    /* ── Play video whenever source changes or becomes visible ── */
    useEffect(() => {
        const video = videoRef.current;
        if (!video || !isVisible) return;

        video.load();
        video.play().catch(() => { });
    }, [isVisible, currentIndex]);

    return (
        <section
            ref={sectionRef}
            className="relative w-full overflow-hidden bg-black"
            style={{ height: "clamp(500px, 80vh, 900px)" }}
        >
            {/* ── Video Background ── */}
            {isVisible && (
                <video
                    ref={videoRef}
                    className="absolute inset-0 w-full h-full object-cover"
                    src={VIDEOS[currentIndex]}
                    muted
                    playsInline
                    preload="auto"
                    onEnded={handleVideoEnded}
                />
            )}

            {/* ── Subtle gradient overlays (Apple-style) ── */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />

            {/* ── Content ── */}
            <div className="relative z-10 h-full flex flex-col justify-end items-center pb-16 md:pb-24 px-6 text-center">
                <p className="font-jakarta text-[0.7rem] md:text-xs font-semibold tracking-[0.25em] uppercase text-white/60 mb-3">
                    Crafted with precision
                </p>
                <h2 className="font-jakarta text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.05] mb-4 max-w-3xl">
                    Feito para quem
                    <br />
                    <span className="text-white/80">exige o melhor.</span>
                </h2>
                <p className="font-jakarta text-sm md:text-base text-white/50 max-w-md mb-8">
                    Cada detalhe pensado. Cada material selecionado.
                    <br className="hidden md:block" />
                    Premium do início ao fim.
                </p>

                {/* CTA Button */}
                <a
                    href="/produtos"
                    className="inline-flex items-center px-8 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium tracking-wide transition-all duration-300 hover:bg-white/20 hover:border-white/30 cursor-pointer"
                >
                    Explorar coleção
                </a>

                {/* ── Video indicator dots ── */}
                <div className="flex gap-2 mt-6">
                    {VIDEOS.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`w-1.5 h-1.5 rounded-full border-0 cursor-pointer transition-all duration-300 ${idx === currentIndex
                                    ? "bg-white w-6"
                                    : "bg-white/30 hover:bg-white/50"
                                }`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
