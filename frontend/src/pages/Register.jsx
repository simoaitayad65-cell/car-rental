import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Phone, MapPin, CreditCard } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";
import AuthShell from "../components/auth/AuthShell";

const initialForm = {
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
  telephone: "",
  adresse: "",
  numero_permis: "",
};

function IconInput({ icon: Icon, ...props }) {
  return (
    <div className="relative">
      <Icon size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        {...props}
        className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 text-sm shadow-sm focus:border-blue-900 focus:outline-none focus:ring-1 focus:ring-blue-900"
      />
    </div>
  );
}

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors(null);
    setSubmitting(true);
    try {
      await register(form);
      navigate("/dashboard");
    } catch (err) {
      setErrors(err.response?.data ?? { message: "Erreur d'inscription" });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      wide
      badge="Rejoignez-nous"
      heroTitle="Créez votre compte et réservez en quelques minutes."
      heroSubtitle="Inscrivez-vous une fois, réservez autant de fois que vous voulez, suivez vos locations depuis votre espace client."
      formTitle="Créer un compte"
      formSubtitle="Quelques informations et c'est parti."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Nom complet</label>
          <IconInput icon={User} value={form.name} onChange={update("name")} placeholder="Votre nom" required />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
          <IconInput
            icon={Mail}
            type="email"
            value={form.email}
            onChange={update("email")}
            placeholder="vous@exemple.com"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Téléphone</label>
            <IconInput
              icon={Phone}
              type="tel"
              value={form.telephone}
              onChange={update("telephone")}
              placeholder="+212 6XX XXX XXX"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">N° de permis</label>
            <IconInput icon={CreditCard} value={form.numero_permis} onChange={update("numero_permis")} />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Adresse</label>
          <IconInput icon={MapPin} value={form.adresse} onChange={update("adresse")} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Mot de passe</label>
            <IconInput
              icon={Lock}
              type="password"
              value={form.password}
              onChange={update("password")}
              placeholder="••••••••"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Confirmation</label>
            <IconInput
              icon={Lock}
              type="password"
              value={form.password_confirmation}
              onChange={update("password_confirmation")}
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        {errors && (
          <ul className="list-disc space-y-1 rounded-lg bg-red-50 px-5 py-3 text-sm text-red-600" role="alert">
            {Object.entries(errors)
              .filter(([key]) => key !== "message")
              .flatMap(([, messages]) => messages)
              .map((msg) => (
                <li key={msg}>{msg}</li>
              ))}
            {errors.message && <li>{errors.message}</li>}
          </ul>
        )}

        <Button type="submit" variant="accent" disabled={submitting} className="w-full">
          {submitting ? "Inscription..." : "S'inscrire"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Déjà un compte ?{" "}
        <Link to="/login" className="font-medium text-blue-900 hover:underline">
          Connexion
        </Link>
      </p>
    </AuthShell>
  );
}
