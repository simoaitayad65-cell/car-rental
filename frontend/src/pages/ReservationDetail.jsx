import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { User, Phone, Users, Cog, Fuel, DoorOpen, ShieldCheck } from "lucide-react";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import PageContainer from "../components/ui/PageContainer";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Skeleton from "../components/ui/Skeleton";
import ReservationTimeline from "../components/reservations/ReservationTimeline";
import {
  RESERVATION_STATUT_LABELS,
  RESERVATION_STATUT_COLORS,
  CAR_STATUT_LABELS,
  CAR_STATUT_COLORS,
} from "../lib/statuts";
import { handleImageError } from "../lib/imageFallback";

const TRANSMISSION_LABELS = { manuelle: "Boîte manuelle", automatique: "Boîte automatique" };
const CARBURANT_LABELS = { essence: "Essence", diesel: "Diesel", hybride: "Hybride", electrique: "Électrique" };

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}

function daysBetween(debut, fin) {
  const ms = new Date(fin) - new Date(debut);
  return Math.max(Math.round(ms / 86400000) + 1, 1);
}

export default function ReservationDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/reservations/${id}`)
      .then(({ data }) => setReservation(data))
      .catch(() => setError("Réservation introuvable"))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleCancel() {
    setCancelling(true);
    try {
      const { data } = await api.put(`/reservations/${id}`, { statut: "annulee" });
      setReservation(data);
      toast.success("Réservation annulée.");
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Action impossible");
    } finally {
      setCancelling(false);
    }
  }

  const backTo = user?.role === "admin" ? "/admin/reservations" : "/reservations";

  if (loading) {
    return (
      <PageContainer>
        <Skeleton className="h-64 w-full" />
      </PageContainer>
    );
  }
  if (error) return <p className="py-16 text-center text-red-600">{error}</p>;
  if (!reservation) return null;

  const car = reservation.car;
  const jours = daysBetween(reservation.date_debut, reservation.date_fin);
  const canCancel =
    user?.id === reservation.user_id && !["terminee", "annulee"].includes(reservation.statut);

  return (
    <PageContainer>
      <Link to={backTo} className="mb-4 inline-block text-sm text-blue-900 hover:underline dark:text-blue-400">
        &larr; Retour
      </Link>

      <Card className="mb-6 overflow-hidden">
        {car?.image && (
          <img
            src={car.image}
            alt={`${car.marque} ${car.modele}`}
            className="h-56 w-full object-cover sm:h-72"
            onError={handleImageError}
          />
        )}
        <div className="flex flex-wrap items-start justify-between gap-2 p-5">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
              {car?.marque} {car?.modele}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">{car?.category?.nom ?? "Sans catégorie"}</p>
          </div>
          <Badge color={RESERVATION_STATUT_COLORS[reservation.statut]}>
            {RESERVATION_STATUT_LABELS[reservation.statut] ?? reservation.statut}
          </Badge>
        </div>
      </Card>

      <Card className="mb-6 overflow-x-auto p-5">
        <ReservationTimeline statut={reservation.statut} />
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Informations client
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <User size={16} className="text-blue-900 dark:text-blue-400" />
                {reservation.prenom} {reservation.nom}
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <Phone size={16} className="text-blue-900 dark:text-blue-400" />
                {reservation.telephone}
              </div>
            </div>
          </Card>

          {car && (
            <Card className="p-5">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Véhicule
              </h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {car.nb_places && (
                  <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <Users size={16} className="text-blue-900 dark:text-blue-400" /> {car.nb_places} places
                  </div>
                )}
                {car.transmission && (
                  <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <Cog size={16} className="text-blue-900 dark:text-blue-400" />
                    {TRANSMISSION_LABELS[car.transmission] ?? car.transmission}
                  </div>
                )}
                {car.carburant && (
                  <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <Fuel size={16} className="text-blue-900 dark:text-blue-400" />
                    {CARBURANT_LABELS[car.carburant] ?? car.carburant}
                  </div>
                )}
                {car.nb_portes && (
                  <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <DoorOpen size={16} className="text-blue-900 dark:text-blue-400" /> {car.nb_portes} portes
                  </div>
                )}
              </div>
              <p className="mt-4 border-t border-slate-100 pt-3 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
                Immatriculation : <span className="font-medium text-slate-700 dark:text-slate-300">{car.immatriculation}</span>
              </p>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="p-5">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Résumé
            </h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-slate-100 py-2 dark:border-slate-800">
                <dt className="text-slate-500 dark:text-slate-400">Du</dt>
                <dd className="font-medium text-slate-800 dark:text-slate-200">{formatDate(reservation.date_debut)}</dd>
              </div>
              <div className="flex justify-between border-b border-slate-100 py-2 dark:border-slate-800">
                <dt className="text-slate-500 dark:text-slate-400">Au</dt>
                <dd className="font-medium text-slate-800 dark:text-slate-200">{formatDate(reservation.date_fin)}</dd>
              </div>
              <div className="flex justify-between border-b border-slate-100 py-2 dark:border-slate-800">
                <dt className="text-slate-500 dark:text-slate-400">Durée</dt>
                <dd className="font-medium text-slate-800 dark:text-slate-200">{jours} jour(s)</dd>
              </div>
            </dl>
            <div className="mt-3 flex items-center justify-between">
              <span className="font-semibold text-slate-900 dark:text-white">Prix total</span>
              <span className="text-xl font-bold text-amber-700 dark:text-amber-500">{reservation.prix_total} €</span>
            </div>

            {canCancel && (
              <Button
                variant="danger"
                className="mt-5 w-full"
                onClick={handleCancel}
                disabled={cancelling}
              >
                {cancelling ? "Annulation..." : "Annuler la réservation"}
              </Button>
            )}
          </Card>

          {car && (
            <Card className="p-5">
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Disponibilité actuelle du véhicule
              </h2>
              <Badge color={CAR_STATUT_COLORS[car.statut]}>{CAR_STATUT_LABELS[car.statut] ?? car.statut}</Badge>
              <p className="mt-3 flex items-start gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                <ShieldCheck size={14} className="mt-0.5 shrink-0 text-blue-900 dark:text-blue-400" />
                Ceci reflète l'état du véhicule en ce moment, indépendamment du statut de cette réservation.
              </p>
            </Card>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
