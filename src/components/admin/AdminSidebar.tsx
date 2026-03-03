import { NavLink, Link } from "react-router";
import { LayoutDashboard, Package, Users, Images, ArrowUpLeft } from "lucide-react";

const navGroups = [
  {
    label: "Visão geral",
    items: [
      { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
    ],
  },
  {
    label: "Gestão",
    items: [
      { to: "/admin/produtos", label: "Produtos", icon: Package, end: false },
      { to: "/admin/clientes", label: "Clientes", icon: Users, end: false },
    ],
  },
  {
    label: "Conteúdo",
    items: [
      { to: "/admin/imagens", label: "Imagens", icon: Images, end: false },
    ],
  },
];

export function AdminSidebar() {
  return (
    <aside className="w-64 min-h-screen bg-zinc-950 flex flex-col shrink-0 sticky top-0 self-start h-screen">
      <div className="px-5 pt-7 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-zinc-950 tracking-tighter font-jakarta">MT</span>
          </div>
          <div>
            <p className="text-white text-sm font-semibold font-jakarta leading-none">Personalizados</p>
            <p className="text-zinc-500 text-[10px] font-jakarta mt-0.5 uppercase tracking-widest">Admin</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-5 space-y-5 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 mb-2 text-[10px] font-semibold font-jakarta uppercase tracking-widest text-zinc-600">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors font-jakarta ${
                      isActive
                        ? "bg-white text-zinc-950"
                        : "text-zinc-400 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  <Icon size={16} />
                  {label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        <Link
          to="/"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium font-jakarta text-zinc-500 hover:text-white hover:bg-white/10 transition-colors"
        >
          <ArrowUpLeft size={16} />
          Voltar à loja
        </Link>
      </div>
    </aside>
  );
}
