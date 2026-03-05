import { useNavigate } from "react-router";
import { Heart } from "lucide-react";
import { formatPrice } from "../utils/format";

interface ProductCardProps {
  id: number;
  title: string;
  image: string;
  price?: number;
}

export function ProductCard({ id, title, image, price }: ProductCardProps) {
  const navigate = useNavigate();

  return (
    <div className="font-jakarta w-full cursor-pointer">
      {/* ── Image area (glass top, rounded only on top) ── */}
      <div
        className="liquid-glass-card flex flex-col justify-center"
        style={{ aspectRatio: "370 / 436" }}
      >
        {/* Top bar: color swatches + premium badge */}
        <div className="flex items-center justify-between px-3 pt-3 md:px-5 md:pt-5">
          <div className="flex items-center gap-[4px]">
            <span className="hidden sm:inline text-xs font-medium text-[#222222]">
              Cores mais usadas
            </span>
            <div className="flex items-center">
              <div
                className="relative z-[1] h-[14px] w-[14px] md:h-[18px] md:w-[18px] rounded-full bg-white"
                style={{ border: "0.2px solid #999999" }}
              />
              <div className="relative z-[2] -ml-2 h-[14px] w-[14px] md:h-[18px] md:w-[18px] rounded-full bg-black" />
            </div>
          </div>
          {/* Premium badge */}
          <span className="text-[0.55rem] md:text-[0.7rem] font-semibold tracking-[0.12em] text-[#94A3B8]">
            PREMIUM
          </span>
        </div>

        {/* Product image */}
        <div className="flex items-center justify-center pt-[1.5rem] pb-[0.5rem] md:pt-[3.125rem] md:pb-[1rem]">
          <img
            src={image}
            alt={title}
            className="w-[60%] aspect-square object-contain"
          />
        </div>

        {/* Product info */}
        <div className="pb-[0.75rem] md:pb-[1.25rem] text-center px-1">
          <p className="hidden md:block text-[0.65rem] font-medium tracking-[0.15em] text-[#94A3B8] mb-[2px]">
            MODELO
          </p>
          <p className="text-[clamp(0.9rem,3.5vw,2.25rem)] font-bold uppercase leading-[1.1] text-[#0F172A]">
            {title}
          </p>
          {price !== undefined && (
            <p className="text-[clamp(0.75rem,2.5vw,1.25rem)] font-normal -mt-[0.1rem] md:-mt-[0.25rem] text-[#64748B]">
              {formatPrice(price)}
            </p>
          )}
        </div>
      </div>

      {/* ── Bottom action bar (no rounded corners) ── */}
      <div className="glass-bottom-bar flex h-[3.5rem] md:h-[5rem] items-center justify-between px-2 md:px-[1.25rem] gap-2">
        <button
          onClick={() => navigate(`/produto/${id}`)}
          className="font-jakarta h-[1.875rem] md:h-[2.4375rem] flex-1 md:flex-none md:w-[11.5625rem] cursor-pointer rounded-full border-0 bg-[#0F172A] text-[0.55rem] md:text-[0.75rem] font-medium tracking-[0.05em] text-white transition-colors duration-200 hover:bg-[#1E293B]"
        >
          CONHECER MODELO
        </button>

        <button
          onClick={(e) => e.stopPropagation()}
          className="flex h-[1.875rem] w-[1.875rem] md:h-[2.375rem] md:w-[2.375rem] flex-shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#222222] bg-transparent transition-colors duration-200 hover:bg-black hover:border-black group/heart"
        >
          <Heart size={14} color="currentColor" className="md:hidden text-[#222222] group-hover/heart:text-white transition-colors duration-200" />
          <Heart size={18} color="currentColor" className="hidden md:block text-[#222222] group-hover/heart:text-white transition-colors duration-200" />
        </button>
      </div>
    </div>
  );
}
