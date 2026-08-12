import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, CarFront } from "lucide-react";
import api from "../api/client";
import PageContainer from "../components/ui/PageContainer";
import CarCard from "../components/CarCard";
import EmptyState from "../components/ui/EmptyState";
import { SkeletonGrid } from "../components/ui/Skeleton";
import { Select } from "../components/ui/Field";

export default function Cars() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cars, setCars] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(searchParams.get("category_id") ?? "");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
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

    setSearchParams(categoryId ? { category_id: categoryId } : {}, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  const visibleCars = useMemo(() => {
    let result = cars;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((c) => `${c.marque} ${c.modele}`.toLowerCase().includes(q));
    }
    if (sortBy === "price_asc") {
      result = [...result].sort((a, b) => Number(a.prix_jour) - Number(b.prix_jour));
    } else if (sortBy === "price_desc") {
      result = [...result].sort((a, b) => Number(b.prix_jour) - Number(a.prix_jour));
    }
    return result;
  }, [cars, search, sortBy]);

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Nos voitures</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          {loading ? "Chargement du catalogue..." : `${visibleCars.length} véhicule(s) disponible(s)`}
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une marque ou un modèle..."
            className="w-full rounded-md border border-slate-300 py-2 pl-9 pr-3 text-sm shadow-sm focus:border-blue-900 focus:outline-none focus:ring-1 focus:ring-blue-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          />
        </div>
        <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="sm:w-48">
          <option value="">Toutes les catégories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nom}
            </option>
          ))}
        </Select>
        <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sm:w-48">
          <option value="">Trier par</option>
          <option value="price_asc">Prix croissant</option>
          <option value="price_desc">Prix décroissant</option>
        </Select>
      </div>

      {error && <p className="text-red-600 dark:text-red-400">{error}</p>}

      {loading && <SkeletonGrid count={6} />}

      {!loading && !error && visibleCars.length > 0 && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibleCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}

      {!loading && !error && visibleCars.length === 0 && (
        <EmptyState
          icon={CarFront}
          title="Aucune voiture trouvée"
          description="Essayez d'élargir votre recherche ou de changer de catégorie."
        />
      )}
    </PageContainer>
  );
}
