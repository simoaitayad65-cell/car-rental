import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Car,
  Tags,
  CalendarCheck,
  MessageCircle,
  Route as RouteIcon,
  Moon,
  Sun,
  LogOut,
  ArrowLeft,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

const links = [
  { to: "/admin/dashboard", label: "Tableau de bord", icon: LayoutDashboard, end: true },
  { to: "/admin/cars", label: "Voitures", icon: Car },
  { to: "/admin/fleet", label: "Suivi des véhicules", icon: RouteIcon },
  { to: "/admin/categories", label: "Catégories", icon: Tags },
  { to: "/reservations", label: "Réservations", icon: CalendarCheck },
  { to: "/admin/chat", label: "Messages", icon: MessageCircle },
];

export default function AdminSidebar({ onNavigate }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="flex h-full flex-col bg-slate-50 dark:bg-slate-900">
      <div className="flex items-center justify-between px-5 py-5">
        <span className="text-lg font-bold text-slate-900 dark:text-white">🚗 Mounfact Car</span>
        <button
          type="button"
          onClick={onNavigate}
          className="rounded-md p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg border-l-2 px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "border-amber-500 bg-blue-50 text-blue-900 dark:bg-blue-500/10 dark:text-blue-400"
                  : "border-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              }`
            }
          >
            <Icon size={18} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="space-y-1 border-t border-slate-200 px-3 py-4 dark:border-slate-800">
        <button
          type="button"
          onClick={toggleTheme}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          {theme === "dark" ? "Mode clair" : "Mode sombre"}
        </button>
        <NavLink
          to="/cars"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <ArrowLeft size={18} />
          Retour au site
        </NavLink>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
        >
          <LogOut size={18} />
          Déconnexion
        </button>

        <div className="mt-3 flex items-center gap-2 border-t border-slate-200 px-3 pt-3 dark:border-slate-800">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-900 text-sm font-semibold text-white">
            {user?.name?.[0]?.toUpperCase() ?? "A"}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">{user?.name}</p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
