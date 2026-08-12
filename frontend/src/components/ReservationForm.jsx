import { useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
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
  const toast = useToast();
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
      <Card className="p-6 text-sm text-slate-600 dark:text-slate-300">
        <p className="mb-3 font-semibold text-slate-900 dark:text-white">{car.prix_jour} € / jour</p>
        <Link to="/login" className="font-medium text-blue-900 hover:underline dark:text-blue-400">
          Connecte-toi
        </Link>{" "}
        pour réserver cette voiture.
      </Card>
    );
  }

  if (car.statut === "maintenance") {
    return (
      <Card className="border-amber-200 bg-amber-50 p-6 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
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
      toast.success("Réservation envoyée avec succès !");
      setDateDebut("");
      setDateFin("");
      onReserved?.(data);
    } catch (err) {
      const message = err.response?.data?.message ?? "Impossible de créer la réservation";
      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card className="overflow-hidden p-6">
      <div className="mb-4 flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {car.marque} {car.modele}
          </p>
          <p className="text-xl font-bold text-amber-700 dark:text-amber-500">
            {car.prix_jour} € <span className="text-xs font-normal text-slate-500 dark:text-slate-400">/ jour</span>
          </p>
        </div>
      </div>

      {success ? (
        <div className="flex flex-col items-center gap-2 py-4 text-center">
          <CheckCircle2 size={36} className="text-green-600 dark:text-green-400" />
          <p className="text-sm font-medium text-green-700 dark:text-green-400">{success}</p>
          <Button type="button" variant="secondary" className="mt-2 w-full" onClick={() => setSuccess(null)}>
            Faire une nouvelle réservation
          </Button>
        </div>
      ) : (
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
            <div className="mb-4 rounded-lg bg-slate-100 px-4 py-3 text-sm dark:bg-slate-800">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>
                  {jours} jour(s) &times; {car.prix_jour} €
                </span>
              </div>
              <div className="mt-1 flex justify-between border-t border-slate-200 pt-1 font-semibold text-slate-900 dark:border-slate-700 dark:text-white">
                <span>Total estimé</span>
                <span className="text-amber-700 dark:text-amber-500">{estimation} €</span>
              </div>
            </div>
          )}

          {error && (
            <p className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 dark:bg-red-500/10 dark:text-red-400" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" variant="accent" disabled={submitting} className="w-full">
            {submitting ? "Réservation..." : "Réserver maintenant"}
          </Button>
          <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <ShieldCheck size={14} className="shrink-0 text-blue-900 dark:text-blue-400" />
            Sans engagement — annulation possible à tout moment depuis votre espace client.
          </p>
        </form>
      )}
    </Card>
  );
}
