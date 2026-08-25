import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Users, Cog, Fuel, DoorOpen, Snowflake } from "lucide-react";
import api from "../api/client";
import ReservationForm from "../components/ReservationForm";
import PageContainer from "../components/ui/PageContainer";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Skeleton from "../components/ui/Skeleton";
import { CAR_STATUT_LABELS, CAR_STATUT_COLORS } from "../lib/statuts";
import { handleImageError } from "../lib/imageFallback";

const TRANSMISSION_LABELS = { manuelle: "Boîte manuelle", automatique: "Boîte automatique" };
const CARBURANT_LABELS = { essence: "Essence", diesel: "Diesel", hybride: "Hybride", electrique: "Électrique" };

export default function CarDetail() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api
      .get(`/cars/${id}`)
      .then(({ data }) => {
        setCar(data);
        setActiveImage(data.image ?? data.images?.[0]?.image_path ?? null);
      })
      .catch(() => setError("Voiture introuvable"))
      .finally(() => setLoading(false));
  }, [id]);

  const thumbnails = useMemo(() => {
    if (!car) return [];
    const list = [car.image, ...(car.images ?? []).map((img) => img.image_path)].filter(Boolean);
    return [...new Set(list)];
  }, [car]);

  const specs = useMemo(() => {
    if (!car) return [];
    const items = [];
    if (car.nb_places) items.push({ icon: Users, label: `${car.nb_places} places` });
    if (car.transmission) items.push({ icon: Cog, label: TRANSMISSION_LABELS[car.transmission] ?? car.transmission });
    if (car.carburant) items.push({ icon: Fuel, label: CARBURANT_LABELS[car.carburant] ?? car.carburant });
    if (car.nb_portes) items.push({ icon: DoorOpen, label: `${car.nb_portes} portes` });
    if (car.climatisation) items.push({ icon: Snowflake, label: "Climatisation" });
    return items;
  }, [car]);

  if (loading) {
    return (
      <PageContainer>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <Skeleton className="h-96 w-full" />
          </div>
          <Skeleton className="h-72 w-full" />
        </div>
      </PageContainer>
    );
  }
  if (error) return <p className="py-16 text-center text-red-600">{error}</p>;
  if (!car) return null;

  return (
    <PageContainer>
      <Link to="/cars" className="mb-4 inline-block text-sm text-blue-900 hover:underline dark:text-blue-400">
        &larr; Retour aux voitures
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left: gallery + info */}
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            {activeImage && (
              <img
                src={activeImage}
                alt={`${car.marque} ${car.modele}`}
                className="h-72 w-full object-cover sm:h-96"
                onError={handleImageError}
              />
            )}
            {thumbnails.length > 1 && (
              <div className="flex gap-2 overflow-x-auto p-3">
                {thumbnails.map((src) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => setActiveImage(src)}
                    className={`h-16 w-20 shrink-0 overflow-hidden rounded-lg ring-2 transition-all ${
                      activeImage === src ? "ring-blue-900" : "ring-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" onError={handleImageError} />
                  </button>
                ))}
              </div>
            )}
          </Card>

          <div className="mt-6">
            <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                  {car.marque} {car.modele}
                </h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{car.category?.nom ?? "Sans catégorie"}</p>
              </div>
              <Badge color={CAR_STATUT_COLORS[car.statut]}>{CAR_STATUT_LABELS[car.statut] ?? car.statut}</Badge>
            </div>

            {specs.length > 0 && (
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {specs.map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
                  >
                    <Icon size={16} className="shrink-0 text-blue-900 dark:text-blue-400" />
                    {label}
                  </div>
                ))}
              </div>
            )}

            {car.description && (
              <div className="mt-6">
                <h2 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">Description</h2>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">{car.description}</p>
              </div>
            )}

            <div className="mt-6 border-t border-slate-200 pt-4 text-sm text-slate-500 dark:border-slate-800 dark:text-slate-400">
              Immatriculation : <span className="font-medium text-slate-700 dark:text-slate-300">{car.immatriculation}</span>
            </div>
          </div>
        </div>

        {/* Right: sticky reservation */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24">
            <ReservationForm car={car} />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
