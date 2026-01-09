import { useState } from "react";
import { useNavigate } from "react-router";
import { Footer } from "../components/Footer";
import { ChevronDown, Plus, Minus, SlidersHorizontal, X } from "lucide-react";
import * as Slider from "@radix-ui/react-slider";
import blackCap from "../assets/black-cap.png";

export function AllProductsPage() {
  const navigate = useNavigate();
  const [openFilters, setOpenFilters] = useState<Record<string, boolean>>({});
  const [sortOrder, setSortOrder] = useState("Menor preço");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedMalhas, setSelectedMalhas] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState(0);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const maxPrice = 299;

  const toggleFilter = (filterName: string) => {
    setOpenFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size)
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color)
        ? prev.filter(c => c !== color)
        : [...prev, color]
    );
  };

  const toggleMalha = (malha: string) => {
    setSelectedMalhas(prev =>
      prev.includes(malha)
        ? prev.filter(m => m !== malha)
        : [...prev, malha]
    );
  };

  const categories = ["Bonés", "Viseiras", "Camisas", "Bolsas", "Chapéus"];
  const sizes = ["P", "M", "G", "GG"];
  const malhas = ["Premium", "Poliéster"];
  const colors = [
    { name: "Azul Marinho", color: "#1E3A8A" },
    { name: "Amarelo Canário", color: "#FDE047" },
    { name: "Azul Bebê", color: "#7DD3FC" },
    { name: "Branco", color: "#FFFFFF" },
    { name: "Preto", color: "#000000" },
    { name: "Azul Royal", color: "#2563EB" },
    { name: "Vermelho", color: "#DC2626" },
    { name: "Cinza Mescla", color: "#9CA3AF" },
    { name: "Amarelo Ouro", color: "#F59E0B" },
    { name: "Rosa Pink", color: "#EC4899" },
    { name: "Verde Bandeira", color: "#16A34A" },
    { name: "Cinza Chumbo", color: "#6B7280" },
  ];

  // Mock products - substituir depois pela API
  const products = Array(12).fill(null).map((_, index) => ({
    id: index + 1,
    name: index === 1 ? "Boné Liso" : "Boné Trucker Tela",
    badge: "CLÁSSICA E ECONÔMICA",
    colors: 16,
    price: 24.90,
    image: blackCap
  }));

  const FiltersSidebar = () => (
    <div className="space-y-0">
      {/* Categoria */}
      <div className="border-b border-gray-300">
        <button
          onClick={() => toggleFilter('categoria')}
          className="w-full flex items-center justify-between py-4 font-jakarta text-base"
        >
          <span>Categoria</span>
          {openFilters.categoria ? (
            <Minus className="w-5 h-5" />
          ) : (
            <Plus className="w-5 h-5" />
          )}
        </button>
        {openFilters.categoria && (
          <div className="pb-4 space-y-2">
            {categories.map((category) => (
              <label
                key={category}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => toggleCategory(category)}
                  className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                />
                <span className="text-sm font-jakarta text-gray-700">
                  {category}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Tamanhos */}
      <div className="border-b border-gray-300">
        <button
          onClick={() => toggleFilter('tamanhos')}
          className="w-full flex items-center justify-between py-4 font-jakarta text-base"
        >
          <span>Tamanhos</span>
          {openFilters.tamanhos ? (
            <Minus className="w-5 h-5" />
          ) : (
            <Plus className="w-5 h-5" />
          )}
        </button>
        {openFilters.tamanhos && (
          <div className="pb-4 space-y-2">
            {sizes.map((size) => (
              <label
                key={size}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
              >
                <input
                  type="checkbox"
                  checked={selectedSizes.includes(size)}
                  onChange={() => toggleSize(size)}
                  className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                />
                <span className="text-sm font-jakarta text-gray-700">
                  {size}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Cores */}
      <div className="border-b border-gray-300">
        <button
          onClick={() => toggleFilter('cores')}
          className="w-full flex items-center justify-between py-4 font-jakarta text-base"
        >
          <span>Cores</span>
          {openFilters.cores ? (
            <Minus className="w-5 h-5" />
          ) : (
            <Plus className="w-5 h-5" />
          )}
        </button>
        {openFilters.cores && (
          <div className="pb-4 space-y-2">
            {colors.map((colorItem) => (
              <label
                key={colorItem.name}
                className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
              >
                <input
                  type="checkbox"
                  checked={selectedColors.includes(colorItem.name)}
                  onChange={() => toggleColor(colorItem.name)}
                  className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                />
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full border border-gray-300"
                    style={{ backgroundColor: colorItem.color }}
                  ></div>
                  <span className="text-sm font-jakarta text-gray-700">
                    {colorItem.name}
                  </span>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Malhas */}
      <div className="border-b border-gray-300">
        <button
          onClick={() => toggleFilter('malhas')}
          className="w-full flex items-center justify-between py-4 font-jakarta text-base"
        >
          <span>Malhas</span>
          {openFilters.malhas ? (
            <Minus className="w-5 h-5" />
          ) : (
            <Plus className="w-5 h-5" />
          )}
        </button>
        {openFilters.malhas && (
          <div className="pb-4 space-y-2">
            {malhas.map((malha) => (
              <label
                key={malha}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-2 py-1 rounded"
              >
                <input
                  type="checkbox"
                  checked={selectedMalhas.includes(malha)}
                  onChange={() => toggleMalha(malha)}
                  className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                />
                <span className="text-sm font-jakarta text-gray-700">
                  {malha}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Preço */}
      <div className="border-b border-gray-300">
        <button
          onClick={() => toggleFilter('preco')}
          className="w-full flex items-center justify-between py-4 font-jakarta text-base"
        >
          <span>Preço</span>
          {openFilters.preco ? (
            <Minus className="w-5 h-5" />
          ) : (
            <Plus className="w-5 h-5" />
          )}
        </button>
        {openFilters.preco && (
          <div className="pb-4 px-2">
            <div className="mb-4 py-3">
              <Slider.Root
                className="relative flex items-center select-none touch-none w-full h-5"
                value={[priceRange]}
                onValueChange={(value) => setPriceRange(value[0])}
                max={maxPrice}
                min={0}
                step={1}
              >
                <Slider.Track className="bg-gray-200 relative grow rounded-full h-[6px]">
                  <Slider.Range className="absolute bg-black rounded-full h-full" />
                </Slider.Track>
                <Slider.Thumb
                  className="block w-5 h-5 bg-black border-[3px] border-white rounded-full shadow-lg hover:scale-110 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 cursor-grab active:cursor-grabbing transition-transform"
                  aria-label="Preço máximo"
                />
              </Slider.Root>
            </div>
            <div className="flex items-center justify-between text-sm font-jakarta">
              <span className="text-gray-600">R$ 0,00</span>
              <span className="font-semibold text-black">
                {priceRange === 0 ? "R$ 299,00" : `até R$ ${priceRange.toFixed(2).replace('.', ',')}`}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 bg-white">
        <div className="max-w-[1600px] mx-auto px-4 md:px-8 lg:px-16 py-4 md:py-6 lg:py-8">
          {/* Breadcrumb */}
          <div className="text-xs md:text-sm font-jakarta text-gray-600 mb-4 md:mb-6">
            <span className="hover:underline cursor-pointer">Página Inicial</span>
            <span className="mx-2">/</span>
            <span className="font-bold text-black">Todos os nossos produtos</span>
          </div>

          {/* Title Section */}
          <div className="mb-4 md:mb-6 lg:mb-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold font-jakarta mb-1 md:mb-2">
              Todos os Nossos Produtos
            </h1>
            <p className="text-xs sm:text-sm md:text-base font-jakarta text-gray-600">
              Confira a nossa confecção de produtos de alta qualidade
            </p>
          </div>

          {/* Mobile Filters Button */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowMobileFilters(true)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg font-jakarta text-sm font-medium"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtros
            </button>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 lg:gap-8 mb-12 md:mb-16 lg:items-start">
            {/* Desktop Filters Sidebar */}
            <aside className="hidden lg:block lg:pt-14">
              <FiltersSidebar />
            </aside>

            {/* Products Grid */}
            <div>
              {/* Sort Dropdown */}
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <span className="text-sm font-jakarta text-gray-600 lg:hidden">
                  {products.length} produtos
                </span>
                <div className="flex items-center gap-2 ml-auto">
                  <label className="text-xs md:text-sm font-jakarta text-gray-600">Ordenar por</label>
                  <div className="relative">
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      className="appearance-none bg-white border border-gray-300 rounded-lg px-3 md:px-4 py-1.5 md:py-2 pr-8 md:pr-10 font-jakarta text-xs md:text-sm focus:outline-none focus:border-black cursor-pointer"
                    >
                      <option>Menor preço</option>
                      <option>Maior preço</option>
                      <option>Mais vendidos</option>
                      <option>Lançamentos</option>
                    </select>
                    <ChevronDown className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 w-3 md:w-4 h-3 md:h-4 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => navigate(`/produto/${product.id}`)}
                    className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    {/* Product Image with Badge */}
                    <div className="bg-[#E8DDD4] aspect-[3/4] flex items-center justify-center p-3 sm:p-4 md:p-6 relative">
                      <div className="absolute top-2 sm:top-3 md:top-4 left-2 sm:left-3 md:left-4 bg-white px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded flex items-center justify-center">
                        <span className="text-[7px] sm:text-[9px] md:text-[11px] font-jakarta font-bold tracking-wide leading-none">
                          {product.badge}
                        </span>
                      </div>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="p-2 sm:p-3 md:p-4 bg-white">
                      <h3 className="font-jakarta text-xs sm:text-sm md:text-base font-semibold mb-1.5 sm:mb-2 md:mb-3 line-clamp-1">
                        {product.name}
                      </h3>

                      <div className="flex items-end justify-between gap-1">
                        <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2 min-w-0">
                          <div className="flex -space-x-0.5 sm:-space-x-1 md:-space-x-1.5 flex-shrink-0">
                            <div className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-full bg-gray-800 border-[1.5px] sm:border-2 border-white"></div>
                            <div className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-full bg-blue-900 border-[1.5px] sm:border-2 border-white"></div>
                          </div>
                          <span className="text-[10px] sm:text-xs md:text-sm font-jakarta text-gray-700 whitespace-nowrap">
                            {product.colors} cores
                          </span>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <p className="text-[7px] sm:text-[8px] md:text-[10px] font-jakarta text-gray-600 leading-tight">A partir de</p>
                          <p className="font-jakarta text-sm sm:text-base md:text-lg font-bold leading-tight">
                            R$ {product.price.toFixed(2).replace('.', ',')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Personalization Section */}
          <section className="mb-12 md:mb-16 max-w-4xl">
            <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold font-jakarta mb-4 md:mb-6">
              Personalize seu Produto com a gente
            </h2>

            <div className="space-y-3 md:space-y-4 font-jakarta text-xs md:text-sm lg:text-base text-gray-700 leading-relaxed">
              <p>
                Na MT Personalizados, você encontra uma ampla variedade de produtos para personalização, ideais para valorizar sua marca ou expressar seu estilo pessoal. Nosso grande destaque são os bonés personalizados, carro-chefe da empresa e o produto mais vendido, desenvolvidos com materiais de alta qualidade, conforto e excelente acabamento, perfeitos para ações de marketing, eventos ou uso no dia a dia.
              </p>

              <p>
                Além dos bonés, confeccionamos camisetas, regatas, croppeds e diversos outros produtos que unem durabilidade e estilo. Para complementar, oferecemos acessórios como ecobags e itens personalizados que se adaptam totalmente à sua identidade visual. Também realizamos personalização em canecas, ideais para brindes, presentes ou para agregar valor à sua marca.
              </p>
            </div>
          </section>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setShowMobileFilters(false)}
          ></div>
          <div className="fixed top-0 left-0 w-[85%] max-w-[380px] h-full bg-white z-50 lg:hidden overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold font-jakarta">Filtros</h2>
                <button onClick={() => setShowMobileFilters(false)} className="text-2xl">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <FiltersSidebar />

              <div className="mt-6 space-y-3">
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full bg-black text-white py-3 rounded-lg font-jakarta font-medium"
                >
                  Aplicar Filtros
                </button>
                <button
                  onClick={() => {
                    setSelectedCategories([]);
                    setSelectedSizes([]);
                    setSelectedColors([]);
                    setSelectedMalhas([]);
                    setPriceRange(0);
                  }}
                  className="w-full border border-gray-300 text-black py-3 rounded-lg font-jakarta font-medium"
                >
                  Limpar Filtros
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <Footer />
    </div>
  );
}
