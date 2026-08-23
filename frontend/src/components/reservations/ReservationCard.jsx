import { Link } from "react-router-dom";
import { CalendarRange } from "lucide-react";
import Card from "../ui/Card";
import Badge from "../ui/Badge";
import ReservationTimeline from "./ReservationTimeline";
import { RESERVATION_STATUT_LABELS, RESERVATION_STATUT_COLORS } from "../../lib/statuts";

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

export default function ReservationCard({ reservation }) {
  const car = reservation.car;

  return (
    <Card className="overflow-hidden">
      <div className="flex gap-4 p-4">
        <div className="h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-slate-800">
          {car?.image && <img src={car.image} alt={`${car.marque} ${car.modele}`} className="h-full w-full object-cover" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900 dark:text-white">
                {car?.marque} {car?.modele}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{car?.category?.nom ?? "Sans catégorie"}</p>
            </div>
            <Badge color={RESERVATION_STATUT_COLORS[reservation.statut]}>
              {RESERVATION_STATUT_LABELS[reservation.statut] ?? reservation.statut}
            </Badge>
          </div>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
            <CalendarRange size={14} className="shrink-0" />
            {formatDate(reservation.date_debut)} → {formatDate(reservation.date_fin)}
          </p>
          <p className="mt-1 font-semibold text-amber-700 dark:text-amber-500">{reservation.prix_total} €</p>
        </div>
      </div>

      <div className="border-t border-slate-100 px-4 py-3 dark:border-slate-800">
        <ReservationTimeline statut={reservation.statut} compact />
      </div>

      <Link
        to={`/reservations/${reservation.id}`}
        className="block border-t border-slate-100 px-4 py-2.5 text-center text-sm font-medium text-blue-900 hover:bg-slate-100 dark:border-slate-800 dark:text-blue-400 dark:hover:bg-slate-800"
      >
        Voir les détails
      </Link>
    </Card>
  );
}
