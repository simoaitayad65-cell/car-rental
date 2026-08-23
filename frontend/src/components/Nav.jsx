import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Sun, Moon } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Button, { LinkButton } from "./ui/Button";

const linkClasses = ({ isActive }) =>
  `text-sm font-medium transition-colors ${
    isActive ? "text-blue-900 dark:text-blue-400" : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
  }`;

const mobileLinkClasses = ({ isActive }) =>
  `block rounded-lg px-3 py-2.5 text-sm font-medium ${
    isActive
      ? "bg-blue-50 text-blue-900 dark:bg-blue-500/10 dark:text-blue-400"
      : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
  }`;

export default function Nav() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await logout();
    setOpen(false);
    navigate("/login");
  }

  return (
    <nav className="border-b border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/cars" className="text-lg font-bold text-blue-900 dark:text-blue-300">
          🚗 Mounfact Car
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-5 md:flex">
          <NavLink to="/cars" className={linkClasses}>
            Voitures
          </NavLink>
          {user ? (
            <>
              <NavLink to={user.role === "admin" ? "/admin/reservations" : "/reservations"} className={linkClasses}>
                {user.role === "admin" ? "Réservations" : "Mes locations"}
              </NavLink>
              {user.role !== "admin" && (
                <NavLink to="/chat" className={linkClasses}>
                  Messages
                </NavLink>
              )}
              {user.role === "admin" && (
                <NavLink to="/admin/dashboard" className={linkClasses}>
                  Administration
                </NavLink>
              )}
              <NavLink to="/dashboard" className={linkClasses}>
                Mon compte
              </NavLink>
              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Changer de thème"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <Button variant="secondary" onClick={handleLogout}>
                Déconnexion
              </Button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Changer de thème"
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <NavLink to="/login" className={linkClasses}>
                Connexion
              </NavLink>
              <LinkButton to="/register" variant="primary">
                Inscription
              </LinkButton>
            </>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex items-center gap-1 md:hidden">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Changer de thème"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="space-y-1 border-t border-slate-200 px-4 py-3 dark:border-slate-800 md:hidden">
          <NavLink to="/cars" className={mobileLinkClasses} onClick={() => setOpen(false)}>
            Voitures
          </NavLink>
          {user ? (
            <>
              <NavLink
                to={user.role === "admin" ? "/admin/reservations" : "/reservations"}
                className={mobileLinkClasses}
                onClick={() => setOpen(false)}
              >
                {user.role === "admin" ? "Réservations" : "Mes locations"}
              </NavLink>
              {user.role !== "admin" && (
                <NavLink to="/chat" className={mobileLinkClasses} onClick={() => setOpen(false)}>
                  Messages
                </NavLink>
              )}
              {user.role === "admin" && (
                <NavLink to="/admin/dashboard" className={mobileLinkClasses} onClick={() => setOpen(false)}>
                  Administration
                </NavLink>
              )}
              <NavLink to="/dashboard" className={mobileLinkClasses} onClick={() => setOpen(false)}>
                Mon compte
              </NavLink>
              <button
                type="button"
                onClick={handleLogout}
                className="block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={mobileLinkClasses} onClick={() => setOpen(false)}>
                Connexion
              </NavLink>
              <NavLink to="/register" className={mobileLinkClasses} onClick={() => setOpen(false)}>
                Inscription
              </NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
