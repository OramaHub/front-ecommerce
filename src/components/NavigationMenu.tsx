import * as NavigationMenu from "@radix-ui/react-navigation-menu";
import { NavLink } from "react-router";
import chevronIcon from "../assets/chevrondown-icon.svg";
import React, { useState } from "react";

const allProductsSubItems = [
  {
    title: "Bonés",
    path: "/bones",
    subItems: [
      { title: "Boné liso", path: "/bones/liso" },
      { title: "Boné bordado", path: "/bones/bordado" },
      { title: "Boné sublimado", path: "/bones/sublimado" },
      { title: "Boné trucker", path: "/bones/trucker" },
    ],
  },
  {
    title: "Viseiras",
    path: "/viseiras",
    subItems: [
      { title: "Viseira lisa", path: "/viseiras/lisa" },
      { title: "Viseira bordada", path: "/viseiras/bordada" },
      { title: "Viseira sublimada", path: "/viseiras/sublimada" },
    ],
  },
    {
        title: "Chapéus",
        path: "/chapeus",
        subItems: [
            { title: "Chapéu liso", path: "/chapeus/liso" },
            { title: "Chapéu bordado", path: "/chapeus/bordado" },
            { title: "Chapéu de palha", path: "/chapeus/palha" },
        ],
    },
    {
        title: "Copos",
        path: "/copos",
        subItems: [
            { title: "Copo de plástico", path: "/copos/plastico" },
            { title: "Copo de acrílico", path: "/copos/acrilico" },
            { title: "Caneca", path: "/copos/caneca" },
        ],
    },
    {
        title: "Camisas",
        path: "/camisas",
        subItems: [
            { title: "Camiseta lisa", path: "/camisas/lisa" },
            { title: "Camiseta bordada", path: "/camisas/bordada" },
            { title: "Camiseta sublimada", path: "/camisas/sublimada" },
            { title: "Polo", path: "/camisas/polo" },
        ],
    }
];

const menuItems = [
    {
        title: "Bonés",
        path: "/bones",
        subItems: [
            { title: "Boné liso", path: "/bones/liso" },
            { title: "Boné bordado", path: "/bones/bordado" },
            { title: "Boné sublimado", path: "/bones/sublimado" },
            { title: "Boné trucker", path: "/bones/trucker" },
        ],
    },
    {
        title: "Viseiras",
        path: "/viseiras",
        subItems: [
            { title: "Viseira lisa", path: "/viseiras/lisa" },
            { title: "Viseira bordada", path: "/viseiras/bordada" },
            { title: "Viseira sublimada", path: "/viseiras/sublimada" },
        ],
    },
    {
        title: "Camisas",
        path: "/camisas",
        subItems: [
            { title: "Camiseta lisa", path: "/camisas/lisa" },
            { title: "Camiseta bordada", path: "/camisas/bordada" },
            { title: "Camiseta sublimada", path: "/camisas/sublimada" },
            { title: "Polo", path: "/camisas/polo" },
        ],
    }
]

const ListItem = React.forwardRef<React.ElementRef<typeof NavLink>, React.ComponentPropsWithoutRef<typeof NavLink>>(
    ({ className, title, ...props }, ref) => {
      return (
        <li>
            <NavLink
              ref={ref}
              className='block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100 text-black'
              {...props}
            >
              <div className="text-sm font-medium leading-none">{title}</div>
            </NavLink>
        </li>
      )
    }
  )
ListItem.displayName = 'ListItem'


export function AppNavigationMenu() {
    const [value, setValue] = useState('');
    const [activeCategory, setActiveCategory] = useState(allProductsSubItems[0]);

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
                <div className="flex w-[450px]">
                    <div className="py-3 px-3 space-y-2 min-w-[220px] border-r border-gray-200">
                        {allProductsSubItems.map((item) => (
                           <button 
                            key={item.path}
                            onMouseEnter={() => setActiveCategory(item)}
                            className={`w-full flex items-center justify-between px-4 py-3 font-jakarta font-semibold text-sm transition-colors rounded-md text-left ${activeCategory.path === item.path ? 'bg-gray-100 text-black' : 'text-gray-600'}`}
                           >
                               {item.title}
                               <span className="text-gray-400 text-lg">›</span>
                           </button>
                        ))}
                    </div>
                    <div className="py-3 px-3 w-full">
                        <ul className="space-y-2">
                            {activeCategory.subItems?.map(subItem => (
                                <ListItem key={subItem.path} title={subItem.title} to={subItem.path} />
                            ))}
                        </ul>
                    </div>
                </div>
            </NavigationMenu.Content>
        </NavigationMenu.Item>

        {menuItems.map((item) => (
            <NavigationMenu.Item key={item.path} value={item.title}>
                <NavigationMenu.Trigger className="flex items-center gap-2 text-black font-medium font-jakarta text-base cursor-pointer group">
                    {item.title}
                    <img
                        src={chevronIcon}
                        alt=""
                        className="h-1.5 transition-transform duration-200 group-data-[state=open]:-rotate-180"
                    />
                </NavigationMenu.Trigger>
                <NavigationMenu.Content className="absolute top-full mt-4 bg-white border border-gray-200 rounded-lg shadow-xl animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95">
                    <ul className="py-3 px-3 space-y-2 min-w-[220px]">
                        {item.subItems.map((subItem) => (
                            <ListItem key={subItem.path} title={subItem.title} to={subItem.path} />
                        ))}
                    </ul>
                </NavigationMenu.Content>
            </NavigationMenu.Item>
        ))}

         <NavigationMenu.Item>
            <NavigationMenu.Link asChild>
                <NavLink to="/personalizacoes" className="flex items-center gap-2 text-black font-medium font-jakarta text-base">
                    Personalizações
                </NavLink>
            </NavigationMenu.Link>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}
