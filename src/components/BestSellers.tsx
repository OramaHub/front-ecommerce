import { useEffect, useState } from "react";
import { ProductCard } from "./ProductCard";
import { getProducts } from "../services/product-service";
import type { Product } from "../types/product";
import blackCap from "../assets/black-cap.png";
import truckerBlack from "../assets/trucker-black.png";
import tShortBlack from "../assets/t-short-black.png";

function getFallbackImage(productName: string) {
  const name = productName.toLowerCase();
  if (name.includes("trucker")) return truckerBlack;
  if (name.includes("camiseta") || name.includes("camisa")) return tShortBlack;
  return blackCap;
}

export function BestSellers() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts(0, 3, "price,asc")
      .then((data) => setProducts(data.content))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-16 py-8 md:py-10 lg:py-12">
      <h2 className="text-2xl md:text-3xl font-bold mb-3 font-jakarta">MAIS VENDIDOS</h2>

      {loading ? (
        <p className="font-jakarta text-gray-500">Carregando produtos...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              title={product.name}
              image={product.images[0]?.url || getFallbackImage(product.name)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
