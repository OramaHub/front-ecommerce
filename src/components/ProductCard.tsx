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
    <div className="font-jakarta w-full">
      <div
        className="flex flex-col justify-center rounded-tl-lg rounded-tr-lg bg-[#F5F5F5]"
        style={{ aspectRatio: "370 / 436" }}
      >
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
          <span className="text-[0.65rem] md:text-[1rem] font-bold">PREMIUM</span>
        </div>

        <div className="flex items-center justify-center pt-[1.5rem] pb-[0.5rem] md:pt-[3.125rem] md:pb-[1rem]">
          <img
            src={image}
            alt={title}
            className="w-[60%] aspect-square object-contain"
          />
        </div>

        <div className="pb-[0.75rem] md:pb-[1.25rem] text-center px-1">
          <p className="hidden md:block text-xs font-semibold tracking-[0.05em] text-black/60">
            MODELO
          </p>
          <p className="text-[clamp(0.9rem,3.5vw,2.25rem)] font-bold uppercase leading-[1.1] text-[#005CE6]">
            {title}
          </p>
          {price !== undefined && (
            <p className="text-[clamp(0.75rem,2.5vw,1.25rem)] font-light -mt-[0.2rem] md:-mt-[0.375rem]">
              {formatPrice(price)}
            </p>
          )}
        </div>
      </div>

      <div className="flex h-[3.5rem] md:h-[5rem] items-center justify-between bg-white px-2 md:px-[1.25rem] gap-2">
        <button
          onClick={() => navigate(`/produto/${id}`)}
          className="font-jakarta h-[1.875rem] md:h-[2.4375rem] flex-1 md:flex-none md:w-[11.5625rem] cursor-pointer rounded-full border-0 bg-black text-[0.6rem] md:text-[0.75rem] font-normal tracking-[0.05em] text-white transition-all duration-200 hover:bg-neutral-800 hover:scale-110"
        >
          CONHECER MODELO
        </button>

        <button
          onClick={(e) => e.stopPropagation()}
          className="group flex h-[1.875rem] w-[1.875rem] md:h-[2.375rem] md:w-[2.375rem] flex-shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-black"
        >
          <Heart size={14} color="#FFFFFF" className="md:hidden transition-transform duration-200 group-hover:scale-110" />
          <Heart size={18} color="#FFFFFF" className="hidden md:block transition-transform duration-200 group-hover:scale-110" />
        </button>
      </div>
    </div>
  );
}
