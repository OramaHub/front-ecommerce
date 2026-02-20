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
    <div className="font-jakarta w-full max-w-[370px]">
      <div
        className="flex flex-col justify-center rounded-tl-lg rounded-tr-lg bg-[#F5F5F5]"
        style={{ aspectRatio: "370 / 436" }}
      >
        <div className="flex items-center justify-between px-5 pt-5">
          <div className="flex items-center gap-[5px]">
            <span className="text-xs font-medium text-[#222222]">
              Cores mais usadas
            </span>
            <div className="flex items-center">
              <div
                className="relative z-[1] h-[18px] w-[18px] rounded-full bg-white"
                style={{ border: "0.2px solid #999999" }}
              />
              <div className="relative z-[2] -ml-2 h-[18px] w-[18px] rounded-full bg-black" />
            </div>
          </div>
          <span className="text-[1rem] font-bold">PREMIUM</span>
        </div>

        <div className="flex items-center justify-center pt-[3.125rem] pb-[1rem]">
          <img
            src={image}
            alt={title}
            className="w-[60%] aspect-square object-contain"
          />
        </div>

        <div className="pb-[1.25rem] text-center">
          <p className="text-xs font-semibold tracking-[0.05em] text-black/60">
            MODELO
          </p>
          <p className="text-[2.25rem] font-bold uppercase leading-[1.1] text-[#005CE6]">
            {title}
          </p>
          {price !== undefined && (
            <p className="text-[1.25rem] font-light -mt-[0.375rem]">
              {formatPrice(price)}
            </p>
          )}
        </div>
      </div>

      <div className="flex h-[5rem] items-center justify-between bg-white px-[1.25rem]">
        <button
          onClick={() => navigate(`/produto/${id}`)}
          className="font-jakarta h-[2.4375rem] w-[11.5625rem] cursor-pointer rounded-full border-0 bg-black text-[0.75rem] font-normal tracking-[0.05em] text-white transition-all duration-200 hover:bg-neutral-800 hover:scale-110"
        >
          CONHECER MODELO
        </button>

        <button
          onClick={(e) => e.stopPropagation()}
          className="group flex h-[2.375rem] w-[2.375rem] cursor-pointer items-center justify-center rounded-full border-0 bg-black"
        >
          <Heart size={18} color="#FFFFFF" className="transition-transform duration-200 group-hover:scale-110" />
        </button>
      </div>
    </div>
  );
}
