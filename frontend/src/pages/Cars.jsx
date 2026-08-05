import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import PageContainer from "../components/ui/PageContainer";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import { Select } from "../components/ui/Field";
import { CAR_STATUT_LABELS, CAR_STATUT_COLORS } from "../lib/statuts";

export default function Cars() {
  const [cars, setCars] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/categories")
      .then(({ data }) => setCategories(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api
      .get("/cars", { params: categoryId ? { category_id: categoryId } : {} })
      .then(({ data }) => setCars(data))
      .catch(() => setError("Impossible de charger les voitures"))
      .finally(() => setLoading(false));
  }, [categoryId]);

  return (
    <PageContainer>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Voitures disponibles</h1>
        <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-48">
          <option value="">Toutes les catégories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nom}
            </option>
          ))}
        </Select>
      </div>

      {loading && <p className="text-slate-500 dark:text-slate-400">Chargement...</p>}
      {error && <p className="text-red-600 dark:text-red-400">{error}</p>}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cars.map((car) => (
          <Link key={car.id} to={`/cars/${car.id}`}>
            <Card className="group h-full overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
              {car.image && (
                <div className="overflow-hidden">
                  <img
                    src={car.image}
                    alt={`${car.marque} ${car.modele}`}
                    className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="p-4">
                <div className="mb-1 flex items-start justify-between gap-2">
                  <strong className="text-slate-900 dark:text-white">
                    {car.marque} {car.modele}
                  </strong>
                  <Badge color={CAR_STATUT_COLORS[car.statut]}>
                    {CAR_STATUT_LABELS[car.statut] ?? car.statut}
                  </Badge>
                </div>
                <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">{car.category?.nom ?? "Sans catégorie"}</p>
                <p className="font-semibold text-amber-700 dark:text-amber-500">{car.prix_jour} €/jour</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {!loading && cars.length === 0 && !error && (
        <p className="py-12 text-center text-slate-500 dark:text-slate-400">Aucune voiture trouvée.</p>
      )}
    </PageContainer>
  );
}
