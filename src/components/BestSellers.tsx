import { useEffect, useState } from "react";
import { ProductCard } from "./ProductCard";
import { getProducts } from "../services/product-service";
import type { Product } from "../types/product";
import blackCap from "../assets/black-cap.png";
import truckerBlack from "../assets/trucker-black.png";
import tShortBlack from "../assets/t-short-black.png";
import americano from "../assets/Americano.png";

function getFallbackImage(productName: string) {
  const name = productName.toLowerCase();
  if (name.includes("americano")) return americano;
  if (name.includes("trucker")) return truckerBlack;
  if (name.includes("camiseta") || name.includes("camisa")) return tShortBlack;
  return blackCap;
}

export function BestSellers() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts(0, 4, "price,asc")
      .then((data) => setProducts(data.content))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-16 py-8 md:py-10 lg:py-12 mb-[clamp(2.5rem,5vw,6.25rem)]">
      <div className="flex justify-center gap-6">
        {["Mais vendidos", "Menor valor", "Lançamentos"].map((filtro) => (
          <span
            key={filtro}
            className="font-jakarta text-xs font-semibold uppercase cursor-pointer transition-transform duration-200 hover:scale-110 inline-block"
          >
            {filtro}
          </span>
        ))}
      </div>

      {loading ? (
        <p className="font-jakarta text-gray-500">Carregando produtos...</p>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-[1.875rem] mt-[1.625rem]">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.name}
              image={product.images[0]?.url || getFallbackImage(product.name)}
              price={product.price}
            />
          ))}
        </div>
      )}
    </section>
  );
}
