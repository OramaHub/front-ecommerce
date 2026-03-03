import { useState, useEffect } from "react";
import { CatalogProductCard } from "./CatalogProductCard";
import { getProducts } from "../services/product-service";
import type { Product } from "../types/product";
import { getProductFallbackImage } from "../utils/product-image";

export function CatalogPreview() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts(0, 6, "price,asc")
      .then((data) => setProducts(data.content))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="bg-black py-12 md:py-16 lg:py-24">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-16">
        <h2 className="text-white text-2xl md:text-4xl font-extrabold tracking-tight mb-6 md:mb-9 lg:mb-12" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>UM POUCO DO NOSSO CATÁLOGO</h2>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-white/60 font-jakarta">Carregando produtos...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mb-8 md:mb-10 lg:mb-12">
            {products.map((product) => (
              <CatalogProductCard
                key={product.id}
                id={product.id}
                label={product.name.toUpperCase()}
                image={product.images[0]?.url ?? getProductFallbackImage(product.name)}
                title={product.name}
                colors={14}
                price={`R$ ${product.price.toFixed(2).replace('.', ',')}`}
              />
            ))}
          </div>
        )}

        <div className="flex justify-center">
          <a
            href="/produtos"
            className="inline-block bg-white text-black px-20 py-2.5 text-sm rounded-full font-jakarta font-semibold uppercase tracking-wide"
          >
            Ver Todos
          </a>
        </div>
      </div>
    </section>
  );
}
