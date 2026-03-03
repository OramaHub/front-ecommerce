import { Outlet, useNavigate } from "react-router";
import { LogOut } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { AdminSidebar } from "./AdminSidebar";

function getInitials(name: string | undefined): string {
  if (!name) return "A";
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 sticky top-0 z-10">
          <div />

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-zinc-950 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-semibold text-white font-jakarta">
                  {getInitials(user?.name)}
                </span>
              </div>
              <span className="text-sm font-medium font-jakarta text-gray-700 leading-none">
                {user?.name}
              </span>
            </div>

            <div className="w-px h-4 bg-gray-200" />

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm font-jakarta text-gray-500 hover:text-black transition-colors"
            >
              <LogOut size={15} />
              Sair
            </button>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
