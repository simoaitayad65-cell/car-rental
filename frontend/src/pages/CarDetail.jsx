import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/client";
import ReservationForm from "../components/ReservationForm";
import PageContainer from "../components/ui/PageContainer";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import { CAR_STATUT_LABELS, CAR_STATUT_COLORS } from "../lib/statuts";

export default function CarDetail() {
  const { id } = useParams();
  const [car, setCar] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api
      .get(`/cars/${id}`)
      .then(({ data }) => setCar(data))
      .catch(() => setError("Voiture introuvable"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="py-16 text-center text-slate-500">Chargement...</p>;
  if (error) return <p className="py-16 text-center text-red-600">{error}</p>;
  if (!car) return null;

  return (
    <PageContainer narrow>
      <Link to="/cars" className="mb-4 inline-block text-sm text-violet-700 hover:underline">
        &larr; Retour aux voitures
      </Link>

      <Card className="overflow-hidden">
        {car.image && (
          <img src={car.image} alt={`${car.marque} ${car.modele}`} className="h-56 w-full object-cover" />
        )}
        {car.images?.length > 0 && (
          <div className="flex gap-2 p-3">
            {car.images.map((img) => (
              <img
                key={img.id}
                src={img.image_path}
                alt=""
                className="h-16 w-20 rounded object-cover"
              />
            ))}
          </div>
        )}

        <div className="p-6">
          <div className="mb-4 flex items-start justify-between">
            <h1 className="text-2xl font-bold text-slate-900">
              {car.marque} {car.modele}
            </h1>
            <Badge color={CAR_STATUT_COLORS[car.statut]}>
              {CAR_STATUT_LABELS[car.statut] ?? car.statut}
            </Badge>
          </div>

          <dl className="space-y-2 text-sm">
            <div className="flex justify-between border-b border-slate-100 py-2">
              <dt className="text-slate-500">Catégorie</dt>
              <dd className="font-medium text-slate-800">{car.category?.nom ?? "Sans catégorie"}</dd>
            </div>
            <div className="flex justify-between border-b border-slate-100 py-2">
              <dt className="text-slate-500">Prix</dt>
              <dd className="font-semibold text-amber-700">{car.prix_jour} €/jour</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-slate-500">Immatriculation</dt>
              <dd className="font-medium text-slate-800">{car.immatriculation}</dd>
            </div>
          </dl>
        </div>
      </Card>

      <ReservationForm car={car} />
    </PageContainer>
  );
}
