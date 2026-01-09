import { useState } from "react";
import { Footer } from "../components/Footer";
import { Star, Plus, ChevronDown } from "lucide-react";
import * as Accordion from "@radix-ui/react-accordion";
import blackCap from "../assets/black-cap.png";

export function ProductDetailsPage() {
  const [selectedColor, setSelectedColor] = useState("Branco");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [cep, setCep] = useState("");
  const [activeTab, setActiveTab] = useState("avaliacoes");

  // Mock data
  const product = {
    name: "Boné Liso Classic",
    subtitle: "Boné Preto Liso Poliéster",
    price: 24.90,
    rating: 5.0,
    totalRatings: 120,
    totalQuestions: 2,
    images: [blackCap, blackCap, blackCap],
  };

  const colors = [
    { name: "Branco", color: "#FFFFFF" },
    { name: "Preto", color: "#000000" },
    { name: "Azul Marinho", color: "#1E3A8A" },
    { name: "Vermelho", color: "#DC2626" },
    { name: "Laranja", color: "#EA580C" },
    { name: "Amarelo", color: "#EAB308" },
    { name: "Verde", color: "#16A34A" },
    { name: "Azul Royal", color: "#2563EB" },
    { name: "Roxo", color: "#9333EA" },
    { name: "Rosa", color: "#EC4899" },
    { name: "Azul Claro", color: "#0EA5E9" },
    { name: "Pink", color: "#DB2777" },
    { name: "Bege", color: "#D4A574" },
    { name: "Cinza", color: "#6B7280" },
  ];

  const sizes = ["P", "M", "G", "GG"];

  const reviews = Array(5).fill({
    name: "Marina Souza",
    date: "07/01/2026",
    rating: 5,
    comment: "",
  });

  const ratingDistribution = [
    { stars: 5, count: 120 },
    { stars: 4, count: 0 },
    { stars: 3, count: 0 },
    { stars: 2, count: 0 },
    { stars: 1, count: 0 },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 bg-white">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-16 py-4 md:py-6 lg:py-8">
          {/* Breadcrumb */}
          <div className="text-xs md:text-sm font-jakarta text-gray-600 mb-6">
            <span className="hover:underline cursor-pointer">Página Inicial</span>
            <span className="mx-2">/</span>
            <span className="hover:underline cursor-pointer">Catálogo</span>
            <span className="mx-2">/</span>
            <span className="font-bold text-black">Boné Liso Preto</span>
          </div>

          {/* Main Product Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16 lg:items-start">
            {/* Left Column - Image Gallery */}
            <div className="flex gap-4 lg:sticky lg:top-8">
              {/* Thumbnails */}
              <div className="flex flex-col gap-4">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? "border-black" : "border-transparent"
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-contain p-2" />
                  </button>
                ))}
              </div>

              {/* Main Image */}
              <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden aspect-square flex items-center justify-center p-8">
                <img
                  src={product.images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Right Column - Product Info */}
            <div>
              {/* Title and Rating */}
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-jakarta mb-1">
                {product.name}
              </h1>
              <p className="text-sm md:text-base font-jakarta text-gray-600 mb-3">
                {product.subtitle}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm font-jakarta text-gray-600">
                  {product.totalRatings} Avaliações / {product.totalQuestions} Perguntas
                </span>
              </div>

              {/* Price */}
              <p className="text-xl md:text-2xl font-bold font-jakarta mb-6">
                A partir de R$ {product.price.toFixed(2).replace('.', ',')} /un
              </p>

              {/* Color Selector */}
              <div className="mb-6">
                <p className="text-sm font-jakarta font-medium mb-3">Selecione sua cor</p>
                <div className="flex flex-wrap gap-x-1.5 gap-y-1.5 max-w-[200px]">
                  {colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-7 h-7 rounded-full border-2 transition-all flex-shrink-0 ${
                        selectedColor === color.name ? "border-black scale-110" : "border-gray-300"
                      }`}
                      style={{ backgroundColor: color.color }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div className="mb-6">
                <div className="flex gap-3 mb-3">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-2 border rounded-lg font-jakarta font-medium transition-all ${
                        selectedSize === size
                          ? "bg-black text-white border-black"
                          : "bg-white text-black border-gray-300 hover:border-black"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <div className="flex gap-4 text-sm font-jakarta">
                  <button className="text-gray-600 hover:text-black underline">
                    Descubra seu tamanho
                  </button>
                  <button className="text-gray-600 hover:text-black underline">
                    Tabela de Medidas
                  </button>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3 mb-6">
                <button className="w-full bg-black text-white py-3 md:py-4 rounded-lg font-jakarta font-medium text-base hover:bg-gray-900 transition-colors">
                  Personalizar meu Produto
                </button>
                <button className="w-full bg-white text-black py-3 md:py-4 rounded-lg font-jakarta font-medium text-base border border-gray-300 hover:border-black transition-colors">
                  Comprar sem estampa
                </button>
              </div>

              {/* Delivery Section */}
              <div className="mb-6 p-4 border border-gray-200 rounded-lg">
                <h3 className="text-base font-jakarta font-bold mb-2">Entrega</h3>
                <p className="text-sm font-jakarta text-gray-600 mb-3">
                  Frete grátis para todo o Nordeste
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Insira seu CEP"
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-jakarta text-sm focus:outline-none focus:border-black"
                  />
                  <button className="bg-black text-white px-6 py-2 rounded-lg font-jakarta font-medium text-sm hover:bg-gray-900 transition-colors">
                    Simular
                  </button>
                </div>
              </div>

              {/* Accordion Sections */}
              <Accordion.Root type="multiple" className="space-y-0">
                <Accordion.Item value="tecnica" className="border-b border-gray-200">
                  <Accordion.Trigger className="w-full flex items-center justify-between py-4 font-jakarta text-sm font-medium hover:text-gray-600 group">
                    <span>Técnica de personalização</span>
                    <Plus className="w-5 h-5 transition-transform group-data-[state=open]:rotate-45" />
                  </Accordion.Trigger>
                  <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                    <div className="pb-4 text-sm font-jakarta text-gray-600">
                      Bordado de alta definição em fio 40, 100% Polyéster, conforme o modelo escolhido.
                    </div>
                  </Accordion.Content>
                </Accordion.Item>

                <Accordion.Item value="cuidados" className="border-b border-gray-200">
                  <Accordion.Trigger className="w-full flex items-center justify-between py-4 font-jakarta text-sm font-medium hover:text-gray-600 group">
                    <span>Cuidados com a peça</span>
                    <Plus className="w-5 h-5 transition-transform group-data-[state=open]:rotate-45" />
                  </Accordion.Trigger>
                  <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                    <div className="pb-4 text-sm font-jakarta text-gray-600">
                      Lavar à mão com água fria. Não usar alvejante. Não torcer. Secar à sombra.
                    </div>
                  </Accordion.Content>
                </Accordion.Item>

                <Accordion.Item value="tabela" className="border-b border-gray-200">
                  <Accordion.Trigger className="w-full flex items-center justify-between py-4 font-jakarta text-sm font-medium hover:text-gray-600 group">
                    <span>Tabelas de medidas</span>
                    <Plus className="w-5 h-5 transition-transform group-data-[state=open]:rotate-45" />
                  </Accordion.Trigger>
                  <Accordion.Content className="overflow-hidden data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                    <div className="pb-4 text-sm font-jakarta text-gray-600">
                      P: 54-56cm | M: 56-58cm | G: 58-60cm | GG: 60-62cm
                    </div>
                  </Accordion.Content>
                </Accordion.Item>
              </Accordion.Root>
            </div>
          </div>

          {/* About Section */}
          <section className="mb-16 max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold font-jakarta mb-6">Sobre a peça</h2>
            <div className="space-y-4 text-sm md:text-base font-jakarta text-gray-700 leading-relaxed">
              <p>
                O boné da <strong>MT Personalizados</strong> é a escolha ideal para quem busca estilo, conforto e identidade em um único produto. Desenvolvido com materiais de alta qualidade, ele oferece excelente durabilidade, ótimo acabamento e conforto para o uso diário.
              </p>
              <p>
                Confeccionado com tecido resistente e estruturado, o boné é uma excelente opção para quem deseja personalizar com qualidade e estilo. Sua construção garante firmeza, conforto e um visual moderno, perfeito para marcas, eventos, equipes ou uso casual.
              </p>
              <p>
                Com modelagem atual e ajuste confortável, ele se adapta perfeitamente a diferentes formatos de cabeça, valorizando o visual e permitindo uma ampla variedade de personalizações, como logos, estampas e designs exclusivos. Versátil e atemporal, é um acessório indispensável para compor qualquer estilo.
              </p>
              <p>
                Os bonés personalizados da <strong>MT Personalizados</strong> contam com acabamento reforçado, costuras de alta resistência e sistema de ajuste traseiro (snapback, strapback ou velcro, conforme o modelo), garantindo praticidade e conforto no uso.
              </p>
              <p>
                Procurando algo realmente único? Além dos nossos modelos prontos, você também pode personalizar seu boné com sua própria identidade visual, frases ou artes exclusivas. Crie um boné que represente sua marca, seu projeto ou seu estilo pessoal.
              </p>
            </div>
          </section>

          {/* Reviews Section */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold font-jakarta mb-6">Avaliações</h2>

            {/* Tabs */}
            <div className="flex gap-8 border-b border-gray-200 mb-6">
              <button
                onClick={() => setActiveTab("avaliacoes")}
                className={`pb-3 font-jakarta font-medium text-base ${
                  activeTab === "avaliacoes"
                    ? "border-b-2 border-black text-black"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                Avaliações
              </button>
              <button
                onClick={() => setActiveTab("perguntas")}
                className={`pb-3 font-jakarta font-medium text-base ${
                  activeTab === "perguntas"
                    ? "border-b-2 border-black text-black"
                    : "text-gray-600 hover:text-black"
                }`}
              >
                Perguntas
              </button>
            </div>

            {activeTab === "avaliacoes" && (
              <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
                {/* Rating Summary */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <button className="ml-auto text-sm font-jakarta text-gray-600 border border-gray-300 px-4 py-2 rounded-lg hover:border-black transition-colors">
                      Fazer uma pergunta
                    </button>
                  </div>

                  <div className="text-center mb-6">
                    <div className="text-6xl font-bold font-jakarta mb-2">{product.rating.toFixed(1)}</div>
                    <div className="flex justify-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm font-jakarta text-gray-600">
                      {product.totalRatings} avaliações / {product.totalQuestions} Perguntas
                    </p>
                  </div>

                  {/* Rating Distribution */}
                  <div className="space-y-2">
                    {ratingDistribution.map((item) => (
                      <div key={item.stars} className="flex items-center gap-2">
                        <span className="text-sm font-jakarta w-3">{item.stars}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-400 h-2 rounded-full"
                            style={{ width: `${(item.count / product.totalRatings) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-jakarta w-8 text-right">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reviews List */}
                <div>
                  {/* Filter Buttons */}
                  <div className="flex gap-3 mb-6">
                    <button className="px-4 py-2 border border-gray-300 rounded-lg font-jakarta text-sm hover:border-black transition-colors flex items-center gap-2">
                      Mais recente
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg font-jakarta text-sm hover:border-black transition-colors">
                      Com vídeo
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg font-jakarta text-sm hover:border-black transition-colors">
                      Com imagem
                    </button>
                  </div>

                  {/* Review Items */}
                  <div className="space-y-4">
                    {reviews.map((review, index) => (
                      <div key={index} className="pb-4 border-b border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-jakarta font-medium text-sm">{review.name}</p>
                            <p className="font-jakarta text-xs text-gray-500">{review.date}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                            <span className="text-xs font-jakarta text-gray-600">5 estrelas</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
}
