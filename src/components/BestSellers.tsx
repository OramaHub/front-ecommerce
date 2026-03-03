import { useEffect, useState } from "react";
import { ProductCard } from "./ProductCard";
import { getProducts } from "../services/product-service";
import type { Product } from "../types/product";
import { getProductFallbackImage } from "../utils/product-image";

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
    <section className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-16 py-12 md:py-16 lg:py-24">
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
        <div className="grid grid-cols-2 lg:grid-cols-[repeat(3,minmax(0,370px))] lg:justify-center gap-3 md:gap-[1.875rem] mt-[1.625rem]">
          {products.map((product, index) => {
            const isLastOdd = products.length % 2 !== 0 && index === products.length - 1;
            const isHiddenOnDesktop = index === 3;
            return (
              <div
                key={product.id}
                className={[
                  isLastOdd ? "col-span-2 justify-self-center w-[calc(50%-0.375rem)] lg:col-span-1 lg:w-full" : "",
                  isHiddenOnDesktop ? "lg:hidden" : "",
                ].filter(Boolean).join(" ")}
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
      )}
    </section>
  );
}
