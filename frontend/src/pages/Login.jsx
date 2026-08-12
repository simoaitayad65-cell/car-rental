import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import AuthShell from "../components/auth/AuthShell";

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
    <AuthShell
      heroTitle="Prenez la route dans la voiture qui vous ressemble."
      heroSubtitle="Citadines, berlines, SUV et utilitaires disponibles près de chez vous — réservez en ligne et récupérez votre voiture le jour même."
      formTitle="Content de vous revoir"
      formSubtitle="Connectez-vous pour gérer vos réservations."
    >
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
            className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 text-sm shadow-sm focus:border-blue-900 focus:outline-none focus:ring-1 focus:ring-blue-900"
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
            className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-10 text-sm shadow-sm focus:border-blue-900 focus:outline-none focus:ring-1 focus:ring-blue-900"
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
          <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <Button type="submit" variant="accent" disabled={submitting} className="mt-4 w-full">
          {submitting ? "Connexion..." : "Se connecter"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Pas de compte ?{" "}
        <Link to="/register" className="font-medium text-blue-900 hover:underline">
          Inscription
        </Link>
      </p>
    </AuthShell>
  );
}
