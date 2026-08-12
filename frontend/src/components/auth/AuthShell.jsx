import { Link } from "react-router-dom";
import { Car, Key, ShieldCheck, Sparkles } from "lucide-react";

const HERO_IMAGE =
  "https://commons.wikimedia.org/wiki/Special:FilePath/2024%20Renault%20Clio%20Esprit%20Alpine%20E-Tech%20-%201598cc%201.6%20%28145PS%29%20Petrol%20Hybrid%20-%20Flame%20Red%20-%2005-2024%2C%20Front.jpg?width=1400";

const DEFAULT_FEATURES = [
  { icon: Car, text: "Un large choix de véhicules récents" },
  { icon: Key, text: "Réservation en ligne en quelques clics" },
  { icon: ShieldCheck, text: "Annulation flexible, sans mauvaise surprise" },
];

export default function AuthShell({
  badge = "Location simple & rapide",
  heroTitle,
  heroSubtitle,
  features = DEFAULT_FEATURES,
  formTitle,
  formSubtitle,
  wide = false,
  children,
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-amber-50 lg:grid lg:grid-cols-2">
      {/* Visual side */}
      <div className="relative hidden overflow-hidden lg:block">
        <img src={HERO_IMAGE} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950/95 via-blue-900/70 to-blue-800/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/50 to-transparent" />

        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Link to="/cars" className="flex items-center gap-2 text-xl font-bold">
            🚗 Mounfact Car
          </Link>

          <div>
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-300 ring-1 ring-amber-400/40">
              <Sparkles size={13} />
              {badge}
            </span>
            <h1 className="mb-4 text-4xl font-bold leading-tight">{heroTitle}</h1>
            <p className="mb-8 max-w-md text-blue-100">{heroSubtitle}</p>
            <ul className="space-y-3">
              {features.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-sm text-blue-50">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20">
                    <Icon size={16} />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Form side */}
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6">
        <div className={`w-full ${wide ? "max-w-md" : "max-w-sm"}`}>
          <Link
            to="/cars"
            className="mb-8 flex items-center justify-center gap-2 text-xl font-bold text-blue-900 lg:hidden"
          >
            🚗 Mounfact Car
          </Link>

          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-8 shadow-xl shadow-blue-900/5 backdrop-blur-sm">
            <h2 className="mb-1 text-2xl font-bold text-slate-900">{formTitle}</h2>
            <p className="mb-6 text-sm text-slate-500">{formSubtitle}</p>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
