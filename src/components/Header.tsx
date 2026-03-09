import { useState, useEffect, useRef, useCallback } from "react";
import { NavLink, useNavigate } from "react-router";
import searchIcon from "../assets/search-icon.svg";
import cartIcon from "../assets/cart-icon.svg";
import personIcon from "../assets/person-icon.svg";
import headsetIcon from "../assets/headset-icon.svg";
import { R2_BASE } from "../constants/r2";
import { AppNavigationMenu } from "./NavigationMenu";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { searchProducts } from "../services/product-service";
import type { Product } from "../types/product";

function getFallbackImage(productName: string) {
  const name = productName.toLowerCase();
  if (name.includes("trucker")) return `${R2_BASE}/trucker-black.png`;
  if (name.includes("camiseta") || name.includes("camisa")) return `${R2_BASE}/t-short-black.png`;
  return `${R2_BASE}/black-cap.png`;
}

const topBarMessages = [
  "Frete grátis para todo o Nordeste",
  "Parcele em até 4x sem juros",
  "Compra 100% segura",
  "Personalização sob medida para sua marca",
];

function TopBarCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % topBarMessages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-white border-t border-gray-200 overflow-hidden">
      <div className="max-w-[1600px] mx-auto flex items-center justify-center py-2">
        <span
          key={current}
          className="text-black text-sm font-jakarta animate-fade-in"
        >
          {topBarMessages[current]}
        </span>
      </div>
    </div>
  );
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileSearchTerm, setMobileSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
  const userMenuTimeout = useRef<ReturnType<typeof setTimeout>>(null);
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleUserMenuEnter = () => {
    if (userMenuTimeout.current) clearTimeout(userMenuTimeout.current);
    setShowUserMenu(true);
  };

  const handleUserMenuLeave = () => {
    userMenuTimeout.current = setTimeout(() => setShowUserMenu(false), 150);
  };

  const handleSearch = (term: string) => {
    const trimmed = term.trim();
    if (trimmed) {
      navigate(`/produtos?search=${encodeURIComponent(trimmed)}`);
      setSearchTerm("");
      setMobileSearchTerm("");
      setIsMenuOpen(false);
      setShowResults(false);
    }
  };

  const doLiveSearch = useCallback((term: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (term.trim().length < 2) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const data = await searchProducts(term.trim(), 0, 6);
        setSearchResults(data.content);
        setShowResults(true);
      } catch {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300);
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    doLiveSearch(value);
  };

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navigateToProduct = (id: number) => {
    setSearchTerm("");
    setShowResults(false);
    navigate(`/produto/${id}`);
  };

  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center py-4">
          <button
            className="lg:hidden pl-4 mr-4"
            onClick={() => setIsMenuOpen(true)}
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              <span className="w-full h-0.5 bg-black"></span>
              <span className="w-full h-0.5 bg-black"></span>
              <span className="w-full h-0.5 bg-black"></span>
            </div>
          </button>

          <div className="pl-0 lg:pl-16">
            <NavLink to="/" className="text-base md:text-lg lg:text-2xl font-bold text-black font-jakarta inline-block transition-transform duration-200 hover:scale-[1.03]">
              MT PERSONALIZADOS
            </NavLink>
          </div>

          <div className="hidden lg:flex flex-1 lg:ml-[4.625rem]">
            <div className="relative w-full max-w-[850px]" ref={searchRef}>
              <input
                type="text"
                placeholder="Pesquisar produto..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch(searchTerm)}
                onFocus={() => searchTerm.trim().length >= 2 && searchResults.length > 0 && setShowResults(true)}
                className="w-full px-4 py-2 pr-15 border border-black/35 rounded-[0.5rem] focus:outline-none focus:border-black/50 font-jakarta"
              />
              <button
                className="absolute right-6 top-1/2 -translate-y-1/2"
                onClick={() => handleSearch(searchTerm)}
              >
                <img src={searchIcon} alt="Pesquisar" className="h-4" />
              </button>

              {showResults && (
                <div className="absolute top-full mt-2 left-0 w-full bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
                  {searchLoading ? (
                    <div className="p-4">
                      <p className="font-jakarta text-sm text-gray-500">Buscando...</p>
                    </div>
                  ) : searchResults.length === 0 ? (
                    <div className="p-4">
                      <p className="font-jakarta text-sm text-gray-500">Nenhum produto encontrado</p>
                    </div>
                  ) : (
                    <div className="py-2">
                      {searchResults.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => navigateToProduct(product.id)}
                          className="group w-full flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors"
                        >
                          <div className="bg-[#F0EBE5] rounded-lg w-16 h-16 flex-shrink-0 flex items-center justify-center p-2">
                            <img
                              src={product.images[0]?.url || getFallbackImage(product.name)}
                              alt={product.name}
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="text-sm font-jakarta font-medium text-black/70 group-hover:text-black transition-colors">{product.name}</p>
                            <p className="text-sm font-jakarta font-bold text-black mt-0.5">
                              R$ {product.price.toFixed(2).replace('.', ',')}
                            </p>
                          </div>
                        </button>
                      ))}
                      <button
                        onClick={() => handleSearch(searchTerm)}
                        className="w-full mt-1 pt-2.5 pb-2 border-t border-gray-200 text-center text-sm font-jakarta font-medium text-black/60 hover:text-black transition-colors"
                      >
                        Ver todos os resultados
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center pr-4 md:pr-8 lg:pr-24 ml-auto lg:ml-0">
            <div className="hidden lg:flex items-center lg:ml-[5.625rem]">
              <button className="flex items-center">
                <img src={headsetIcon} alt="Atendimento" className="h-5.5 transition-transform duration-200 hover:scale-110" />
                <span className="ml-[1.6rem] text-[1rem] font-jakarta font-normal">Central de atendimento</span>
              </button>
            </div>

            <NavLink to="/carrinho" className="ml-4 lg:ml-[2.3125rem] relative">
              <img src={cartIcon} alt="Carrinho" className="h-5 lg:h-5.5 transition-transform duration-200 hover:scale-110" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center font-jakarta">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </NavLink>

            {isAuthenticated ? (
              <div
                className="hidden lg:flex items-center relative ml-[1.875rem]"
                onMouseEnter={handleUserMenuEnter}
                onMouseLeave={handleUserMenuLeave}
              >
                <button className="flex items-center justify-center cursor-pointer">
                  <img src={personIcon} alt="Minha conta" className="h-5.5 transition-transform duration-200 hover:scale-110" />
                </button>

                {showUserMenu && (
                  <div
                    className="absolute right-0 top-full pt-4 z-[200]"
                    onMouseEnter={handleUserMenuEnter}
                    onMouseLeave={handleUserMenuLeave}
                  >
                    <div className="bg-white border border-gray-200 rounded-xl shadow-lg py-2 w-48">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs text-black/50 font-jakarta">Olá,</p>
                        <p className="text-sm font-semibold font-jakarta text-black truncate capitalize">{user?.name?.split(" ")[0]?.toLowerCase()}</p>
                      </div>
                      <NavLink
                        to="/minha-conta"
                        className="flex items-center px-4 py-2.5 text-sm font-jakarta text-black hover:bg-gray-50 transition-colors"
                      >
                        Minha conta
                      </NavLink>
                      <NavLink
                        to="/minha-conta?tab=dados"
                        className="flex items-center px-4 py-2.5 text-sm font-jakarta text-black hover:bg-gray-50 transition-colors"
                      >
                        Meus dados
                      </NavLink>
                      <NavLink
                        to="/minha-conta?tab=enderecos"
                        className="flex items-center px-4 py-2.5 text-sm font-jakarta text-black hover:bg-gray-50 transition-colors"
                      >
                        Endereços
                      </NavLink>
                      <NavLink
                        to="/minha-conta?tab=pedidos"
                        className="flex items-center px-4 py-2.5 text-sm font-jakarta text-black hover:bg-gray-50 transition-colors"
                      >
                        Meus pedidos
                      </NavLink>
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={logout}
                          className="w-full text-left px-4 py-2.5 text-sm font-jakarta text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          Sair
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <NavLink to="/login" className="hidden lg:block ml-[1.875rem]">
                <img src={personIcon} alt="Login" className="h-5.5 transition-transform duration-200 hover:scale-110" />
              </NavLink>
            )}
          </div>
        </div>
      </div>

      <nav className="hidden lg:block border-t border-gray-200">
        <div className="max-w-[1600px] mx-auto pl-16">
          <AppNavigationMenu />
        </div>
      </nav>

      <TopBarCarousel />

      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          ></div>
          <div className="fixed top-0 left-0 w-[80%] max-w-[320px] h-full bg-white z-50 lg:hidden overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold font-jakarta">Menu</h2>
                <button onClick={() => setIsMenuOpen(false)} className="text-2xl">
                  ×
                </button>
              </div>

              <div className="relative mb-6">
                <input
                  type="text"
                  placeholder="Pesquisar produto..."
                  value={mobileSearchTerm}
                  onChange={(e) => setMobileSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch(mobileSearchTerm)}
                  className="w-full px-4 py-2 pr-10 border border-black/35 rounded-lg focus:outline-none focus:border-black/50 font-jakarta"
                />
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => handleSearch(mobileSearchTerm)}
                >
                  <img src={searchIcon} alt="Pesquisar" className="h-4" />
                </button>
              </div>

              <nav className="mb-6">
                <ul className="space-y-4">
                  <li>
                    <NavLink
                      to="/produtos"
                      className="flex items-center gap-2 text-black font-medium font-jakarta text-base py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Todos os nossos produtos
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/personalize"
                      className="flex items-center gap-2 text-black font-medium font-jakarta text-base py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Personalize
                    </NavLink>
                  </li>
                </ul>
              </nav>

              <div className="border-t border-gray-200 pt-6 space-y-4">
                {isAuthenticated ? (
                  <div className="flex flex-col gap-2">
                    <NavLink
                      to="/minha-conta"
                      className="flex items-center gap-3 text-black font-jakarta text-base py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <img src={personIcon} alt="Conta" className="h-5" />
                      {user?.name?.split(" ")[0]}
                    </NavLink>
                    <button
                      onClick={() => { logout(); setIsMenuOpen(false); }}
                      className="flex items-center gap-3 text-black/60 font-jakarta text-base py-2"
                    >
                      Sair
                    </button>
                  </div>
                ) : (
                  <NavLink
                    to="/login"
                    className="flex items-center gap-3 text-black font-jakarta text-base py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <img src={personIcon} alt="Login" className="h-5" />
                    Login
                  </NavLink>
                )}

                <button className="flex items-center gap-3 text-black font-jakarta text-base py-2">
                  <img src={headsetIcon} alt="Atendimento" className="h-5" />
                  Central de atendimento
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
