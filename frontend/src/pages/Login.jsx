import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Zap, Car, Sparkles, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";

const HERO_IMAGE =
  "https://commons.wikimedia.org/wiki/Special:FilePath/2022%20Volkswagen%20T-Roc%20Life.jpg?width=1920";

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
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* Full-bleed cinematic background */}
      <img
        src={HERO_IMAGE}
        alt=""
        className="animate-ken-burns absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-blue-950/90 via-blue-950/70 to-blue-950/95" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(2,6,23,0.75)_75%)]" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col px-4 sm:px-6">
        <header className="flex items-center justify-between py-6">
          <Link to="/cars" className="flex items-center gap-2 text-lg font-bold text-white">
            🚗 Mounfact Car
          </Link>
          <Link
            to="/cars"
            className="hidden text-sm font-medium text-white/70 transition-colors hover:text-white sm:block"
          >
            Voir le catalogue →
          </Link>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center py-10">
          <div className="mb-8 max-w-lg animate-fade-in-up text-center">
            <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border border-amber-400/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300">
              <Sparkles size={13} />
              Location premium
            </span>
            <h1 className="mb-3 text-4xl font-bold leading-[1.15] text-white sm:text-5xl">
              Votre prochaine voiture vous attend.
            </h1>
            <p className="mx-auto max-w-md text-blue-100/80">
              Connectez-vous et profitez d'une expérience de location simple, rapide et premium.
            </p>
          </div>

          <div
            className="w-full max-w-sm animate-fade-in-up rounded-3xl border border-white/15 bg-white/10 p-8 shadow-2xl shadow-black/40 backdrop-blur-2xl [animation-delay:120ms]"
            style={{ animationFillMode: "both" }}
          >
            <form onSubmit={handleSubmit}>
              <label className="mb-1.5 block text-sm font-medium text-white/80">Email</label>
              <div className="group relative mb-4">
                <Mail
                  size={18}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40 transition-colors group-focus-within:text-amber-400"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="vous@exemple.com"
                  className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 pl-10 pr-3 text-sm text-white placeholder-white/40 shadow-sm transition-colors focus:border-amber-400/60 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                />
              </div>

              <label className="mb-1.5 block text-sm font-medium text-white/80">Mot de passe</label>
              <div className="group relative mb-6">
                <Lock
                  size={18}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40 transition-colors group-focus-within:text-amber-400"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/15 bg-white/5 py-2.5 pl-10 pr-10 text-sm text-white placeholder-white/40 shadow-sm transition-colors focus:border-amber-400/60 focus:outline-none focus:ring-2 focus:ring-amber-400/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 transition-colors hover:text-white/80"
                  tabIndex={-1}
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {error && (
                <p
                  className="mb-4 animate-shake-in rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200"
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

            <p className="mt-6 text-center text-sm text-white/60">
              Pas de compte ?{" "}
              <Link to="/register" className="font-medium text-amber-400 hover:underline">
                Inscription
              </Link>
            </p>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {TRUST_POINTS.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-2 backdrop-blur-sm"
              >
                <Icon size={14} className="text-amber-400" />
                <span className="text-xs font-medium text-white/80">{label}</span>
              </div>
            ))}
          </div>
        </main>

        <footer className="py-6 text-center text-xs text-white/40">
          © {new Date().getFullYear()} Mounfact Car — Location de voitures au Maroc
        </footer>
      </div>
    </div>
  );
}
