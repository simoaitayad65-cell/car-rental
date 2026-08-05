import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PageContainer from "../components/ui/PageContainer";
import Card from "../components/ui/Card";
import Field, { Input } from "../components/ui/Field";
import Button from "../components/ui/Button";

const initialForm = {
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
  telephone: "",
  adresse: "",
  numero_permis: "",
};

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
    <PageContainer narrow>
      <Card className="p-8">
        <h1 className="mb-6 text-2xl font-bold text-slate-900">Inscription</h1>
        <form onSubmit={handleSubmit}>
          <Field label="Nom">
            <Input value={form.name} onChange={update("name")} required />
          </Field>
          <Field label="Email">
            <Input type="email" value={form.email} onChange={update("email")} required />
          </Field>
          <Field label="Mot de passe">
            <Input type="password" value={form.password} onChange={update("password")} required />
          </Field>
          <Field label="Confirmation">
            <Input
              type="password"
              value={form.password_confirmation}
              onChange={update("password_confirmation")}
              required
            />
          </Field>
          <Field label="Téléphone">
            <Input value={form.telephone} onChange={update("telephone")} />
          </Field>
          <Field label="Adresse">
            <Input value={form.adresse} onChange={update("adresse")} />
          </Field>
          <Field label="Numéro de permis">
            <Input value={form.numero_permis} onChange={update("numero_permis")} />
          </Field>

          {errors && (
            <ul className="mb-4 list-disc space-y-1 pl-5 text-sm text-red-600">
              {Object.entries(errors)
                .filter(([key]) => key !== "message")
                .flatMap(([, messages]) => messages)
                .map((msg) => (
                  <li key={msg}>{msg}</li>
                ))}
              {errors.message && <li>{errors.message}</li>}
            </ul>
          )}

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? "Inscription..." : "S'inscrire"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-600">
          Déjà un compte ?{" "}
          <Link to="/login" className="font-medium text-violet-700 hover:underline">
            Connexion
          </Link>
        </p>
      </Card>
    </PageContainer>
  );
}
