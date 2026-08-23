import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Zap, Car, Sparkles, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";

const HERO_IMAGE =
  "https://commons.wikimedia.org/wiki/Special:FilePath/Mercedes-Benz%20W177%20%282022%29%201X7A6988.jpg?width=1600";

const TRUST_POINTS = [
  { icon: Car, label: "Véhicules premium" },
  { icon: Zap, label: "Réservation rapide" },
  { icon: ShieldCheck, label: "Confiance & sécurité" },
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
    <div className="min-h-screen lg:grid lg:grid-cols-2">
      {/* Visual side */}
      <div className="relative hidden overflow-hidden lg:block">
        <img src={HERO_IMAGE} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950 via-blue-950/85 to-blue-900/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-blue-950/50" />

        <div className="relative flex h-full flex-col justify-between p-12">
          <Link to="/cars" className="flex items-center gap-2 text-xl font-bold text-white">
            🚗 Mounfact Car
          </Link>

          <div className="animate-fade-in-up">
            <span className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-300 ring-1 ring-amber-400/30">
              <Sparkles size={13} />
              Location premium
            </span>
            <h1 className="mb-4 max-w-lg text-4xl font-bold leading-[1.15] text-white xl:text-5xl">
              Votre prochaine voiture vous attend.
            </h1>
            <p className="mb-9 max-w-md text-blue-100/90">
              Connectez-vous et profitez d'une expérience de location simple, rapide et premium.
            </p>
            <div className="flex flex-wrap gap-3">
              {TRUST_POINTS.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 backdrop-blur-sm"
                >
                  <Icon size={16} className="text-amber-400" />
                  <span className="text-xs font-medium text-white/90">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Form side */}
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-100 px-4 py-12 dark:bg-slate-950 sm:px-6">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 animate-blob-float rounded-full bg-blue-900/10 blur-3xl dark:bg-blue-500/10" />
        <div className="pointer-events-none absolute -bottom-24 -right-16 h-72 w-72 animate-blob-float rounded-full bg-amber-500/10 blur-3xl [animation-delay:2s] dark:bg-amber-500/10" />

        <div className="relative w-full max-w-sm animate-fade-in-up">
          <Link
            to="/cars"
            className="mb-8 flex items-center justify-center gap-2 text-xl font-bold text-blue-900 dark:text-blue-300 lg:hidden"
          >
            🚗 Mounfact Car
          </Link>

          <div className="rounded-2xl border border-slate-200 bg-white/90 p-8 shadow-2xl shadow-blue-900/10 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/90">
            <h2 className="mb-1 text-2xl font-bold text-slate-900 dark:text-white">Content de vous revoir</h2>
            <p className="mb-7 text-sm text-slate-500 dark:text-slate-400">
              Connectez-vous pour gérer vos réservations.
            </p>

            <form onSubmit={handleSubmit}>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
              <div className="group relative mb-4">
                <Mail
                  size={18}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-900 dark:group-focus-within:text-blue-400"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="vous@exemple.com"
                  className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm shadow-sm transition-shadow focus:border-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>

              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Mot de passe
              </label>
              <div className="group relative mb-6">
                <Lock
                  size={18}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-900 dark:group-focus-within:text-blue-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-10 text-sm shadow-sm transition-shadow focus:border-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-900/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
                  tabIndex={-1}
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {error && (
                <p
                  className="mb-4 animate-shake-in rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400"
                  role="alert"
                >
                  {error}
                </p>
              )}

              <Button
                type="submit"
                variant="accent"
                disabled={submitting}
                className="group w-full transition-transform hover:-translate-y-0.5 active:translate-y-0"
              >
                {submitting ? (
                  "Connexion..."
                ) : (
                  <>
                    Se connecter
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
              Pas de compte ?{" "}
              <Link to="/register" className="font-medium text-blue-900 hover:underline dark:text-blue-400">
                Inscription
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
