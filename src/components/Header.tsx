import { NavLink } from "react-router";
import searchIcon from "../assets/search-icon.svg";
import cartIcon from "../assets/cart-icon.svg";
import personIcon from "../assets/person-icon.svg";
import headsetIcon from "../assets/headset-icon.svg";
import chevronIcon from "../assets/chevrondown-icon.svg";

export function Header() {
  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center py-4">
          <div className="pl-16">
            <NavLink to="/" className="text-2xl font-bold text-black font-jakarta">
              MT PERSONALIZADOS
            </NavLink>
          </div>

          <div className="flex-1 ml-[4.625rem]">
            <div className="relative max-w-[850px]">
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

          <div className="flex items-center pr-24">
            <div className="ml-[5.625rem]">
              <button className="flex items-center">
                <img src={headsetIcon} alt="Atendimento" className="h-5.5" />
                <span className="ml-[1.6rem] text-[1rem] font-jakarta font-normal">Central de atendimento</span>
              </button>
            </div>

            <NavLink to="/carrinho" className="ml-[2.3125rem]">
              <img src={cartIcon} alt="Carrinho" className="h-5.5" />
            </NavLink>

            <NavLink to="/login" className="ml-[1.875rem]">
              <img src={personIcon} alt="Login" className="h-5.5" />
            </NavLink>
          </div>
        </div>
      </div>

      <nav className="border-t border-gray-200">
        <div className="max-w-[1600px] mx-auto pl-16">
          <ul className="flex items-center gap-8 py-4">
            <li>
              <NavLink to="/produtos" className="flex items-center gap-2 text-black font-medium font-jakarta text-base">
                Todos os nossos produtos
                <img src={chevronIcon} alt="" className="h-1.5" />
              </NavLink>
            </li>
            <li>
              <NavLink to="/bones" className="flex items-center gap-2 text-black font-medium font-jakarta text-base">
                Bonés
                <img src={chevronIcon} alt="" className="h-1.5" />
              </NavLink>
            </li>
            <li>
              <NavLink to="/viseiras" className="flex items-center gap-2 text-black font-medium font-jakarta text-base">
                Viseiras
                <img src={chevronIcon} alt="" className="h-1.5" />
              </NavLink>
            </li>
            <li>
              <NavLink to="/camisas" className="flex items-center gap-2 text-black font-medium font-jakarta text-base">
                Camisas
                <img src={chevronIcon} alt="" className="h-1.5" />
              </NavLink>
            </li>
            <li>
              <NavLink to="/personalizacoes" className="flex items-center gap-2 text-black font-medium font-jakarta text-base">
                Personalizações
                <img src={chevronIcon} alt="" className="h-1.5" />
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
