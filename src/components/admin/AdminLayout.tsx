import { Outlet, useNavigate } from "react-router";
import { LogOut } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { AdminSidebar } from "./AdminSidebar";

export function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
        <span className="text-base font-bold font-jakarta tracking-tight">MT Admin</span>
        <div className="flex items-center gap-4">
          <span className="text-sm font-jakarta text-gray-600">{user?.name}</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm font-jakarta text-gray-500 hover:text-black transition-colors"
          >
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </header>

      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
