import { useState } from "react";
import { NavLink } from "react-router";
import searchIcon from "../assets/search-icon.svg";
import cartIcon from "../assets/cart-icon.svg";
import personIcon from "../assets/person-icon.svg";
import headsetIcon from "../assets/headset-icon.svg";
import chevronIcon from "../assets/chevrondown-icon.svg";
import { AppNavigationMenu } from "./NavigationMenu";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
                className="w-full px-4 py-2 pr-15 border border-black/35 rounded-[0.5rem] focus:outline-none focus:border-black/50 font-jakarta"
              />
              <button className="absolute right-6 top-1/2 -translate-y-1/2">
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

            <NavLink to="/carrinho" className="ml-4 lg:ml-[2.3125rem]">
              <img src={cartIcon} alt="Carrinho" className="h-5 lg:h-5.5" />
            </NavLink>

            <NavLink to="/login" className="hidden lg:block ml-[1.875rem]">
              <img src={personIcon} alt="Login" className="h-5.5" />
            </NavLink>
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
                  className="w-full px-4 py-2 pr-10 border border-black/35 rounded-lg focus:outline-none focus:border-black/50 font-jakarta"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2">
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
                      <img src={chevronIcon} alt="" className="h-1.5" />
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/bones"
                      className="flex items-center gap-2 text-black font-medium font-jakarta text-base py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Bonés
                      <img src={chevronIcon} alt="" className="h-1.5" />
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/viseiras"
                      className="flex items-center gap-2 text-black font-medium font-jakarta text-base py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Viseiras
                      <img src={chevronIcon} alt="" className="h-1.5" />
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/camisas"
                      className="flex items-center gap-2 text-black font-medium font-jakarta text-base py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Camisas
                      <img src={chevronIcon} alt="" className="h-1.5" />
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/personalizacoes"
                      className="flex items-center gap-2 text-black font-medium font-jakarta text-base py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Personalizações
                      <img src={chevronIcon} alt="" className="h-1.5" />
                    </NavLink>
                  </li>
                </ul>
              </nav>

              <div className="border-t border-gray-200 pt-6 space-y-4">
                <NavLink
                  to="/login"
                  className="flex items-center gap-3 text-black font-jakarta text-base py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <img src={personIcon} alt="Login" className="h-5" />
                  Login
                </NavLink>

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
