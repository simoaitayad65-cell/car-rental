import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Car, Key, ShieldCheck, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";

const HERO_IMAGE =
  "https://commons.wikimedia.org/wiki/Special:FilePath/2024%20Renault%20Clio%20Esprit%20Alpine%20E-Tech%20-%201598cc%201.6%20%28145PS%29%20Petrol%20Hybrid%20-%20Flame%20Red%20-%2005-2024%2C%20Front.jpg?width=1400";

const FEATURES = [
  { icon: Car, text: "Un large choix de véhicules récents" },
  { icon: Key, text: "Réservation en ligne en quelques clics" },
  { icon: ShieldCheck, text: "Annulation flexible, sans mauvaise surprise" },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message ?? "Erreur de connexion");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-amber-50 lg:grid lg:grid-cols-2">
      {/* Visual side */}
      <div className="relative hidden overflow-hidden lg:block">
        <img src={HERO_IMAGE} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-violet-950/95 via-violet-900/70 to-violet-800/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-violet-950/50 to-transparent" />

        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <Link to="/cars" className="flex items-center gap-2 text-xl font-bold">
            🚗 Mounfact Car
          </Link>

          <div>
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-300 ring-1 ring-amber-400/40">
              <Sparkles size={13} />
              Location simple & rapide
            </span>
            <h1 className="mb-4 text-4xl font-bold leading-tight">
              Prenez la route dans la voiture qui vous ressemble.
            </h1>
            <p className="mb-8 max-w-md text-violet-100">
              Citadines, berlines, SUV et utilitaires disponibles près de chez vous — réservez en
              ligne et récupérez votre voiture le jour même.
            </p>
            <ul className="space-y-3">
              {FEATURES.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-sm text-violet-50">
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
        <div className="w-full max-w-sm">
          <Link to="/cars" className="mb-8 flex items-center justify-center gap-2 text-xl font-bold text-violet-900 lg:hidden">
            🚗 Mounfact Car
          </Link>

          <div className="rounded-2xl border border-stone-200 bg-white/80 p-8 shadow-xl shadow-violet-900/5 backdrop-blur-sm">
            <h2 className="mb-1 text-2xl font-bold text-slate-900">Content de vous revoir</h2>
            <p className="mb-6 text-sm text-slate-500">Connectez-vous pour gérer vos réservations.</p>

            <form onSubmit={handleSubmit}>
              <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
              <div className="relative mb-4">
                <Mail size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="vous@exemple.com"
                  className="w-full rounded-lg border border-stone-300 py-2.5 pl-10 pr-3 text-sm shadow-sm focus:border-violet-700 focus:outline-none focus:ring-1 focus:ring-violet-700"
                />
              </div>

              <label className="mb-1 block text-sm font-medium text-slate-700">Mot de passe</label>
              <div className="relative mb-2">
                <Lock size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-stone-300 py-2.5 pl-10 pr-10 text-sm shadow-sm focus:border-violet-700 focus:outline-none focus:ring-1 focus:ring-violet-700"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {error && (
                <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
              )}

              <Button type="submit" variant="accent" disabled={submitting} className="mt-4 w-full">
                {submitting ? "Connexion..." : "Se connecter"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
              Pas de compte ?{" "}
              <Link to="/register" className="font-medium text-violet-700 hover:underline">
                Inscription
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
