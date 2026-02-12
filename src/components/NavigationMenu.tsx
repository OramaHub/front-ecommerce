import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { NavLink, useNavigate } from "react-router";
import chevronIcon from "../assets/chevrondown-icon.svg";
import { useState } from "react";
import blackCap from "../assets/black-cap.png";
import truckerBlack from "../assets/trucker-black.png";
import tShortBlack from "../assets/t-short-black.png";

interface SubItem {
  title: string;
  category: string;
  image: string;
  path: string;
}

interface Category {
  title: string;
  path: string;
  subItems: SubItem[];
}

const allProductsSubItems: Category[] = [
  {
    title: "Bonés",
    path: "/produtos?search=boné&title=Nossos Bonés",
    subItems: [
      { title: "Boné Baseball Classic", category: "Boné", image: blackCap, path: "/produtos?search=boné baseball&title=Nossos Bonés Baseball" },
      { title: "Boné Trucker", category: "Boné", image: truckerBlack, path: "/produtos?search=trucker&title=Nossos Bonés Trucker" },
    ],
  },
  {
    title: "Camisas",
    path: "/produtos?search=camiseta&title=Nossas Camisas",
    subItems: [
      { title: "Camiseta Preta", category: "Camisa", image: tShortBlack, path: "/produtos?search=camiseta&title=Nossas Camisas" },
    ],
  },
];

export function AppNavigationMenu() {
  const [value, setValue] = useState('');
  const [activeCategory, setActiveCategory] = useState(allProductsSubItems[0]);
  const navigate = useNavigate();

  return (
    <NavigationMenu.Root
      className="relative z-50"
      value={value}
      onValueChange={setValue}
      delayDuration={100}
    >
      <NavigationMenu.List className="flex items-center gap-8 py-4">
        <NavigationMenu.Item value="all-products">
          <NavigationMenu.Trigger asChild>
            <NavLink to="/produtos" className="flex items-center gap-2 text-black font-medium font-jakarta text-base cursor-pointer group">
              Todos os nossos produtos
              <img
                src={chevronIcon}
                alt=""
                className="h-1.5 transition-transform duration-200 group-data-[state=open]:-rotate-180"
              />
            </NavLink>
          </NavigationMenu.Trigger>
          <NavigationMenu.Content className="absolute top-full mt-4 bg-white border border-gray-200 rounded-lg shadow-xl animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95">
            <div className="flex">
              <div className="py-3 px-3 space-y-1 min-w-[170px] border-r border-gray-200">
                {allProductsSubItems.map((item) => (
                  <button
                    key={item.path}
                    onMouseEnter={() => setActiveCategory(item)}
                    onClick={() => { navigate(item.path); setValue(''); }}
                    className={`w-full flex items-center justify-between px-4 py-3 font-jakarta font-semibold text-sm transition-colors rounded-md text-left ${activeCategory.path === item.path ? 'bg-gray-100 text-black' : 'text-gray-600 hover:text-black'}`}
                  >
                    {item.title}
                    <span className="text-gray-400 text-lg">›</span>
                  </button>
                ))}
              </div>

              <div className="p-5 flex-1">
                <h3 className="font-jakarta font-bold text-base mb-4">{activeCategory.title}</h3>
                <div className="grid grid-cols-3 gap-4">
                  {activeCategory.subItems.map((subItem) => (
                    <NavLink
                      key={subItem.path}
                      to={subItem.path}
                      onClick={() => setValue('')}
                      className="group/card block w-[120px]"
                    >
                      <div className="bg-[#F0EBE5] rounded-lg overflow-hidden w-[120px] h-[100px] flex items-center justify-center p-3 mb-1.5 group-hover/card:shadow-md transition-shadow">
                        <img
                          src={subItem.image}
                          alt={subItem.title}
                          className="max-w-full max-h-full object-contain group-hover/card:scale-105 transition-transform duration-200"
                        />
                      </div>
                      <p className="text-xs font-jakarta font-medium text-black/60 leading-tight group-hover/card:text-black transition-colors">{subItem.title}</p>
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
          </NavigationMenu.Content>
        </NavigationMenu.Item>

        <NavigationMenu.Item>
          <NavigationMenu.Link asChild>
            <NavLink to="/personalize" className="text-black font-medium font-jakarta text-base">
              Personalize
            </NavLink>
          </NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}
