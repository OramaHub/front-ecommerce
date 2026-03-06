import { useCallback, useEffect, useRef, useState } from "react";
import { ProductCard } from "./ProductCard";
import { getProducts } from "../services/product-service";
import type { Product } from "../types/product";
import { getProductFallbackImage } from "../utils/product-image";

const FILTERS = [
  { label: "Mais vendidos", sort: "price,desc" },
  { label: "Menor valor", sort: "price,asc" },
  { label: "Lançamentos", sort: "createdAt,desc" },
] as const;

/* ── Skeleton placeholder card ── */
function SkeletonCard() {
  return (
    <div className="w-full min-w-[260px] md:min-w-0 snap-center">
      <div className="liquid-glass-card animate-pulse" style={{ aspectRatio: "370 / 436" }}>
        <div className="flex flex-col h-full px-3 pt-3 md:px-5 md:pt-5">
          <div className="flex justify-between">
            <div className="h-3 w-24 bg-black/[0.06] rounded" />
            <div className="h-3 w-16 bg-black/[0.06] rounded" />
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="w-[55%] aspect-square bg-black/[0.06] rounded-lg" />
          </div>
          <div className="pb-4 flex flex-col items-center gap-2">
            <div className="h-3 w-12 bg-black/[0.06] rounded" />
            <div className="h-6 w-32 bg-black/[0.06] rounded" />
            <div className="h-4 w-20 bg-black/[0.06] rounded" />
          </div>
        </div>
      </div>
      <div className="glass-bottom-bar h-[3.5rem] md:h-[5rem] flex items-center justify-between px-2 md:px-[1.25rem] gap-2">
        <div className="h-[1.875rem] md:h-[2.4375rem] flex-1 md:flex-none md:w-[11.5625rem] bg-black/[0.06] rounded-full" />
        <div className="h-[1.875rem] w-[1.875rem] md:h-[2.375rem] md:w-[2.375rem] bg-black/[0.06] rounded-full" />
      </div>
    </div>
  );
}


function MobileAutoScroll({ products, revealed }: { products: Product[]; revealed: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || products.length === 0) return;

    // Only run on viewports < 768px
    const isMobile = () => window.innerWidth < 768;
    if (!isMobile()) return;

    let resumeTimer: ReturnType<typeof setTimeout>;
    const SPEED = 0.15; // px per frame — very slow, premium feel
    let accumulated = 0;

    // Delay start to let cards render and get proper widths
    const startTimer = setTimeout(() => {
      const step = () => {
        if (!pausedRef.current && el.scrollWidth > el.clientWidth) {
          accumulated += SPEED;
          if (accumulated >= 1) {
            const px = Math.floor(accumulated);
            el.scrollLeft += px;
            accumulated -= px;
          }
          if (el.scrollLeft >= el.scrollWidth - el.clientWidth - 1) {
            el.scrollLeft = 0;
          }
        }
        animRef.current = requestAnimationFrame(step);
      };
      animRef.current = requestAnimationFrame(step);
    }, 500);

    // Pause on touch — user can drag freely
    const pause = () => {
      clearTimeout(resumeTimer);
      pausedRef.current = true;
    };
    const scheduleResume = () => {
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => { pausedRef.current = false; }, 3000);
    };

    el.addEventListener("touchstart", pause, { passive: true });
    el.addEventListener("touchend", scheduleResume, { passive: true });

    return () => {
      clearTimeout(startTimer);
      cancelAnimationFrame(animRef.current);
      clearTimeout(resumeTimer);
      el.removeEventListener("touchstart", pause);
      el.removeEventListener("touchend", scheduleResume);
    };
  }, [products]);

  return (
    <div
      ref={scrollRef}
      className="flex gap-3 md:gap-[1.875rem] overflow-x-auto scrollbar-hide pb-2 md:grid md:grid-cols-[repeat(3,minmax(0,370px))] md:justify-center md:overflow-visible md:pb-0"
    >
      {products.map((product, index) => {
        const isHiddenOnDesktop = index === 3;
        return (
          <div
            key={product.id}
            className={`w-[65vw] md:w-auto md:min-w-0 flex-shrink-0 ${isHiddenOnDesktop ? "md:hidden" : ""
              } transition-all duration-500 ease-out ${revealed
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
              }`}
            style={{ transitionDelay: `${index * 100}ms` }}
          >
            <ProductCard
              id={product.id}
              title={product.name}
              image={product.images[0]?.url || getProductFallbackImage(product.name)}
              price={product.price}
            />
          </div>
        );
      })}
    </div>
  );
}

export function BestSellers() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState(0);
  const [fading, setFading] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);

  /* ── Fetch products based on active filter ── */
  const fetchProducts = useCallback((filterIdx: number) => {
    setFading(true);
    const timer = setTimeout(() => {
      setLoading(true);
      getProducts(0, 4, FILTERS[filterIdx].sort)
        .then((data) => setProducts(data.content))
        .catch(() => setProducts([]))
        .finally(() => {
          setLoading(false);
          setFading(false);
        });
    }, 250);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const cleanup = fetchProducts(activeFilter);
    return cleanup;
  }, [activeFilter, fetchProducts]);

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
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleFilterChange = (idx: number) => {
    if (idx === activeFilter) return;
    setActiveFilter(idx);
  };

  return (
    <section className="bg-white py-12 md:py-16 lg:py-24">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-16">
        <div className="text-center mb-10 md:mb-14">
          <h2 className="font-jakarta text-2xl md:text-4xl font-bold text-[#0F172A] mb-6 md:mb-8">
            Nossos Destaques
          </h2>

          {/* Glass Pill Filter Tabs */}
          <div className="glass-pill-container">
            {FILTERS.map((f, idx) => (
              <button
                key={f.label}
                onClick={() => handleFilterChange(idx)}
                className={`font-jakarta text-xs font-semibold uppercase cursor-pointer px-5 md:px-6 py-2 md:py-2.5 rounded-full transition-all duration-300 border-0 ${activeFilter === idx
                  ? "glass-pill-active text-[#0F172A]"
                  : "text-[#94A3B8] hover:text-[#475569] bg-transparent"
                  }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div
          ref={gridRef}
          className={`transition-opacity duration-300 ${fading ? "opacity-0" : "opacity-100"}`}
        >
          {loading ? (
            <div className="flex gap-3 md:gap-[1.875rem] overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-2 md:grid md:grid-cols-[repeat(3,minmax(0,370px))] md:justify-center md:overflow-visible md:pb-0">
              {[0, 1, 2].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : (
            <MobileAutoScroll products={products} revealed={revealed} />
          )}
        </div>

        <div className="text-center mt-8">
          <a
            href="/produtos"
            className="font-jakarta text-sm font-medium text-[#0F172A] border-b border-[#0F172A] pb-0.5 transition-colors duration-200 hover:text-[#0066CC] hover:border-[#0066CC]"
          >
            Ver todos os modelos
          </a>
        </div>
      </div>
    </section>
  );
}
