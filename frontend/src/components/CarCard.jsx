import { Link } from "react-router-dom";
import { Users, Cog, Fuel } from "lucide-react";
import Card from "./ui/Card";
import Badge from "./ui/Badge";
import { CAR_STATUT_LABELS, CAR_STATUT_COLORS } from "../lib/statuts";
import { handleImageError } from "../lib/imageFallback";

const TRANSMISSION_LABELS = { manuelle: "Manuelle", automatique: "Automatique" };
const CARBURANT_LABELS = { essence: "Essence", diesel: "Diesel", hybride: "Hybride", electrique: "Électrique" };

export default function CarCard({ car }) {
  return (
    <Link to={`/cars/${car.id}`} className="block h-full">
      <Card className="group h-full overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="relative overflow-hidden">
          {car.image ? (
            <img
              src={car.image}
              alt={`${car.marque} ${car.modele}`}
              className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              onError={handleImageError}
            />
          ) : (
            <div className="flex h-48 w-full items-center justify-center bg-slate-100 text-sm text-slate-400 dark:bg-slate-800">
              Pas de photo
            </div>
          )}
          <div className="absolute right-3 top-3">
            <Badge color={CAR_STATUT_COLORS[car.statut]}>{CAR_STATUT_LABELS[car.statut] ?? car.statut}</Badge>
          </div>
        </div>

        <div className="p-4">
          <div className="mb-1 flex items-start justify-between gap-2">
            <strong className="text-base text-slate-900 dark:text-white">
              {car.marque} {car.modele}
            </strong>
          </div>
          <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">{car.category?.nom ?? "Sans catégorie"}</p>

          {(car.nb_places || car.transmission || car.carburant) && (
            <div className="mb-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
              {car.nb_places && (
                <span className="flex items-center gap-1">
                  <Users size={13} /> {car.nb_places} places
                </span>
              )}
              {car.transmission && (
                <span className="flex items-center gap-1">
                  <Cog size={13} /> {TRANSMISSION_LABELS[car.transmission] ?? car.transmission}
                </span>
              )}
              {car.carburant && (
                <span className="flex items-center gap-1">
                  <Fuel size={13} /> {CARBURANT_LABELS[car.carburant] ?? car.carburant}
                </span>
              )}
            </div>
          )}

          <div className="flex items-baseline justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
            <p className="font-semibold text-amber-700 dark:text-amber-500">
              {car.prix_jour} € <span className="text-xs font-normal text-slate-500 dark:text-slate-400">/ jour</span>
            </p>
            <span className="text-sm font-medium text-blue-900 group-hover:underline dark:text-blue-400">
              Voir les détails →
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
