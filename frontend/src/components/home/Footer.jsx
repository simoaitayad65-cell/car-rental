import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div>
            <Link to="/cars" className="text-lg font-bold text-blue-900 dark:text-blue-300">
              🚗 Mounfact Car
            </Link>
            <p className="mt-3 max-w-xs text-sm text-slate-500 dark:text-slate-400">
              Location de voitures simple et transparente. Réservez en ligne, roulez l'esprit tranquille.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-300">
              Liens rapides
            </h3>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li>
                <Link to="/cars" className="hover:text-blue-900 dark:hover:text-blue-400">
                  Voitures
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-blue-900 dark:hover:text-blue-400">
                  Connexion
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-blue-900 dark:hover:text-blue-400">
                  Inscription
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-300">
              Contact
            </h3>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li className="flex items-center gap-2">
                <Phone size={14} /> +212 6XX XXX XXX
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} /> contact@mounfactcar.com
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={14} /> Casablanca, Maroc
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6 text-center text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
          © {new Date().getFullYear()} Mounfact Car. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
