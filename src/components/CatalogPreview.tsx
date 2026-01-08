import { CatalogProductCard } from "./CatalogProductCard";
import blackCap from "../assets/black-cap.png";

export function CatalogPreview() {
  const products = [
    { id: 1, label: "BONÉ LISO PRETO", image: blackCap, title: "Boné Liso Classic", colors: 15, price: "R$ 33,90", badge: "MAIS VENDIDO" },
    { id: 2, label: "BONÉ LISO PRETO", image: blackCap, title: "Boné Liso Classic", colors: 15, price: "R$ 33,90" },
    { id: 3, label: "BONÉ LISO PRETO", image: blackCap, title: "Boné Liso Classic", colors: 15, price: "R$ 33,90", badge: "PERSONALIZÁVEL" },
    { id: 4, label: "BONÉ LISO PRETO", image: blackCap, title: "Boné Liso Classic", colors: 15, price: "R$ 33,90" },
    { id: 5, label: "BONÉ LISO PRETO", image: blackCap, title: "Boné Liso Classic", colors: 15, price: "R$ 33,90" },
    { id: 6, label: "BONÉ LISO PRETO", image: blackCap, title: "Boné Liso Classic", colors: 15, price: "R$ 33,90", badge: "NOVIDADE" },
  ];

  return (
    <section className="bg-black py-16">
      <div className="max-w-[1600px] mx-auto px-16">
        <h2 className="text-white text-4xl font-bold mb-12 font-jakarta">UM POUCO DO NOSSO CATÁLOGO</h2>

        <div className="grid grid-cols-3 gap-8 mb-12">
          {products.map((product) => (
            <CatalogProductCard
              key={product.id}
              label={product.label}
              image={product.image}
              title={product.title}
              colors={product.colors}
              price={product.price}
              badge={product.badge}
            />
          ))}
        </div>

        <div className="flex justify-center">
          <a
            href="/catalogo"
            className="bg-white text-black px-12 py-3 rounded-full font-jakarta font-medium hover:bg-black hover:text-white hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl border-2 border-white"
          >
            Conheça todo o nosso catálogo
          </a>
        </div>
      </div>
    </section>
  );
}
