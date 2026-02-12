import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Footer } from "../components/Footer";
import { Star, Plus, ChevronDown } from "lucide-react";
import * as Accordion from "@radix-ui/react-accordion";
import { getProductById } from "../services/product-service";
import type { Product } from "../types/product";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import blackCap from "../assets/black-cap.png";

export function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);

  const [selectedColor, setSelectedColor] = useState("Branco");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [cep, setCep] = useState("");
  const [activeTab, setActiveTab] = useState("avaliacoes");

  useEffect(() => {
    const numericId = Number(id);
    if (!id || isNaN(numericId)) {
      setError("Produto não encontrado.");
      setLoading(false);
      return;
    }

    setLoading(true);
    getProductById(numericId)
      .then((data) => setProduct(data))
      .catch(() => setError("Erro ao carregar produto."))
      .finally(() => setLoading(false));
  }, [id]);

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

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 flex items-center justify-center">
          <p className="font-jakarta text-gray-500">Carregando produto...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="font-jakarta text-red-500">{error || "Produto não encontrado."}</p>
          <button
            onClick={() => navigate("/produtos")}
            className="px-6 py-2 bg-black text-white rounded-lg font-jakarta"
          >
            Ver todos os produtos
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const productImages = product.images.length > 0
    ? product.images.map((img) => img.url)
    : [blackCap];

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 bg-white">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-16 py-4 md:py-6 lg:py-8">
          <div className="text-xs md:text-sm font-jakarta text-gray-600 mb-6">
            <span className="hover:underline cursor-pointer" onClick={() => navigate("/")}>Página Inicial</span>
            <span className="mx-2">/</span>
            <span className="hover:underline cursor-pointer" onClick={() => navigate("/produtos")}>Catálogo</span>
            <span className="mx-2">/</span>
            <span className="font-bold text-black">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16 lg:items-start">
            <div className="flex gap-4 lg:sticky lg:top-8">
              <div className="flex flex-col gap-4">
                {productImages.map((img, index) => (
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

              <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden aspect-square flex items-center justify-center p-8">
                <img
                  src={productImages[selectedImage] || blackCap}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-jakarta mb-1">
                {product.name}
              </h1>
              <p className="text-sm md:text-base font-jakarta text-gray-600 mb-3">
                {product.description}
              </p>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm font-jakarta text-gray-600">
                  120 Avaliações / 2 Perguntas
                </span>
              </div>

              <p className="text-xl md:text-2xl font-bold font-jakarta mb-6">
                A partir de R$ {product.price.toFixed(2).replace('.', ',')} /un
              </p>

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

              <div className="space-y-3 mb-6">
                <button className="w-full bg-black text-white py-3 md:py-4 rounded-lg font-jakarta font-medium text-base hover:bg-gray-900 transition-colors">
                  Personalizar meu Produto
                </button>
                <button
                  onClick={async () => {
                    if (!product) return;
                    setAddingToCart(true);
                    try {
                      await addToCart(product.id, 1, product.name, product.price);
                      navigate("/carrinho");
                    } catch {
                      setError("Erro ao adicionar ao carrinho.");
                    } finally {
                      setAddingToCart(false);
                    }
                  }}
                  disabled={addingToCart}
                  className="w-full bg-white text-black py-3 md:py-4 rounded-lg font-jakarta font-medium text-base border border-gray-300 hover:border-black transition-colors disabled:opacity-50"
                >
                  {addingToCart ? "Adicionando..." : "Comprar sem estampa"}
                </button>
              </div>

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

          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold font-jakarta mb-6">Avaliações</h2>

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
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <button className="ml-auto text-sm font-jakarta text-gray-600 border border-gray-300 px-4 py-2 rounded-lg hover:border-black transition-colors">
                      Fazer uma pergunta
                    </button>
                  </div>

                  <div className="text-center mb-6">
                    <div className="text-6xl font-bold font-jakarta mb-2">5.0</div>
                    <div className="flex justify-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-sm font-jakarta text-gray-600">
                      120 avaliações / 2 Perguntas
                    </p>
                  </div>

                  <div className="space-y-2">
                    {ratingDistribution.map((item) => (
                      <div key={item.stars} className="flex items-center gap-2">
                        <span className="text-sm font-jakarta w-3">{item.stars}</span>
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-400 h-2 rounded-full"
                            style={{ width: `${(item.count / 120) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm font-jakarta w-8 text-right">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
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
