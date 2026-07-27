import { useNavigate } from "react-router-dom";
import SidebarNavItem from "@/components/layout/SidebarNavItem";
import { sidebarNav } from "@/data/employeeDashboardData";
import { useAuth } from "@/context/AuthContext";

export default function EmployeeSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col bg-[#171E2E] px-4 py-6">
      <div className="px-2 pb-8">
        <p className="text-xl font-bold text-white">Teamora</p>
        <p className="text-xs text-slate-400">Employee Portal</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {sidebarNav.map((item) => (
          <SidebarNavItem key={item.id} {...item} />
        ))}
      </nav>

      <div className="space-y-3 pt-6">
        <div className="pt-2">
          <SidebarNavItem label="Logout" icon="LogOut" onClick={handleLogout} />
        </div>
      </div>
    </aside>
  );
}
