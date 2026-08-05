import { useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";
import Card from "./ui/Card";
import Field, { Input } from "./ui/Field";
import Button from "./ui/Button";

function daysBetween(debut, fin) {
  if (!debut || !fin) return 0;
  const ms = new Date(fin) - new Date(debut);
  if (ms < 0) return 0;
  return Math.floor(ms / 86400000) + 1;
}

export default function ReservationForm({ car, onReserved }) {
  const { user } = useAuth();
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [telephone, setTelephone] = useState(user?.telephone ?? "");
  const [dateDebut, setDateDebut] = useState("");
  const [dateFin, setDateFin] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const today = new Date().toISOString().slice(0, 10);
  const jours = daysBetween(dateDebut, dateFin);
  const estimation = jours > 0 ? (jours * Number(car.prix_jour)).toFixed(2) : null;

  if (!user) {
    return (
      <Card className="mt-6 p-6 text-sm text-slate-600">
        <Link to="/login" className="font-medium text-violet-700 hover:underline">
          Connecte-toi
        </Link>{" "}
        pour réserver cette voiture.
      </Card>
    );
  }

  if (car.statut === "maintenance") {
    return (
      <Card className="mt-6 border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">
        Cette voiture est en maintenance et ne peut pas être réservée.
      </Card>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);
    try {
      const { data } = await api.post("/reservations", {
        car_id: car.id,
        nom,
        prenom,
        telephone,
        date_debut: dateDebut,
        date_fin: dateFin,
      });
      setSuccess(`Réservation créée (${data.prix_total} €). Statut : en attente de confirmation.`);
      setDateDebut("");
      setDateFin("");
      onReserved?.(data);
    } catch (err) {
      setError(err.response?.data?.message ?? "Impossible de créer la réservation");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="mt-6 p-6">
      <h3 className="mb-4 text-lg font-semibold text-slate-900">Réserver cette voiture</h3>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Prénom">
            <Input value={prenom} onChange={(e) => setPrenom(e.target.value)} required />
          </Field>
          <Field label="Nom">
            <Input value={nom} onChange={(e) => setNom(e.target.value)} required />
          </Field>
        </div>
        <Field label="Téléphone">
          <Input
            type="tel"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            placeholder="+212 6XX XXX XXX"
            required
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Du">
            <Input
              type="date"
              min={today}
              value={dateDebut}
              onChange={(e) => setDateDebut(e.target.value)}
              required
            />
          </Field>
          <Field label="Au">
            <Input
              type="date"
              min={dateDebut || today}
              value={dateFin}
              onChange={(e) => setDateFin(e.target.value)}
              required
            />
          </Field>
        </div>
        {estimation && (
          <p className="mb-4 text-sm text-slate-600">
            {jours} jour(s) &times; {car.prix_jour} € ≈{" "}
            <strong className="text-amber-700">{estimation} €</strong>
          </p>
        )}
        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
        {success && <p className="mb-4 text-sm text-green-700">{success}</p>}
        <Button type="submit" variant="accent" disabled={submitting}>
          {submitting ? "Réservation..." : "Réserver"}
        </Button>
        <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
          <ShieldCheck size={14} className="shrink-0 text-violet-700" />
          Sans engagement — annulation possible à tout moment depuis votre espace client.
        </p>
      </form>
    </Card>
  );
}
