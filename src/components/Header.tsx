import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import searchIcon from "../assets/search-icon.svg";
import cartIcon from "../assets/cart-icon.svg";
import personIcon from "../assets/person-icon.svg";
import headsetIcon from "../assets/headset-icon.svg";
import { AppNavigationMenu } from "./NavigationMenu";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileSearchTerm, setMobileSearchTerm] = useState("");
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleSearch = (term: string) => {
    const trimmed = term.trim();
    if (trimmed) {
      navigate(`/produtos?search=${encodeURIComponent(trimmed)}`);
      setSearchTerm("");
      setMobileSearchTerm("");
      setIsMenuOpen(false);
    }
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
            <NavLink to="/" className="text-base md:text-lg lg:text-2xl font-bold text-black font-jakarta">
              MT PERSONALIZADOS
            </NavLink>
          </div>

          <div className="hidden lg:flex flex-1 lg:ml-[4.625rem]">
            <div className="relative w-full max-w-[850px]">
              <input
                type="text"
                placeholder="Pesquisar produto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch(searchTerm)}
                className="w-full px-4 py-2 pr-15 border border-black/35 rounded-[0.5rem] focus:outline-none focus:border-black/50 font-jakarta"
              />
              <button
                className="absolute right-6 top-1/2 -translate-y-1/2"
                onClick={() => handleSearch(searchTerm)}
              >
                <img src={searchIcon} alt="Pesquisar" className="h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center pr-4 md:pr-8 lg:pr-24 ml-auto lg:ml-0">
            <div className="hidden lg:flex items-center lg:ml-[5.625rem]">
              <button className="flex items-center">
                <img src={headsetIcon} alt="Atendimento" className="h-5.5" />
                <span className="ml-[1.6rem] text-[1rem] font-jakarta font-normal">Central de atendimento</span>
              </button>
            </div>

            <NavLink to="/carrinho" className="ml-4 lg:ml-[2.3125rem] relative">
              <img src={cartIcon} alt="Carrinho" className="h-5 lg:h-5.5" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center font-jakarta">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </NavLink>

            {isAuthenticated ? (
              <div className="hidden lg:flex items-center ml-[1.875rem] gap-2">
                <NavLink to="/minha-conta" className="text-sm font-jakarta font-medium text-black truncate max-w-[120px]">
                  {user?.name?.split(" ")[0]}
                </NavLink>
                <button onClick={logout} className="text-sm font-jakarta text-black/60 hover:text-black transition-colors">
                  Sair
                </button>
              </div>
            ) : (
              <NavLink to="/login" className="hidden lg:block ml-[1.875rem]">
                <img src={personIcon} alt="Login" className="h-5.5" />
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
