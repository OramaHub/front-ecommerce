import { ProductCard } from "./ProductCard";
import blackCap from "../assets/black-cap.png";

export function BestSellers() {
  const products = [
    { id: 1, title: "BONÉ LISO PRETO", image: blackCap },
    { id: 2, title: "BONÉ LISO PRETO", image: blackCap },
    { id: 3, title: "BONÉ LISO PRETO", image: blackCap },
  ];

  return (
    <section className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-16 py-8 md:py-10 lg:py-12">
      <h2 className="text-2xl md:text-3xl font-bold mb-3 font-jakarta">MAIS VENDIDOS</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 lg:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} title={product.title} image={product.image} />
        ))}
      </div>

      <a href="/produtos" className="text-sm md:text-base font-jakarta hover:underline mt-2 inline-block">
        Ver todos os pedidos
      </a>
    </section>
  );
}
