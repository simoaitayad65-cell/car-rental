import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/client";
import CarCard from "../CarCard";
import { SkeletonGrid } from "../ui/Skeleton";

export default function PopularCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/cars", { params: { statut: "disponible" } })
      .then(({ data }) => setCars(data.slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="voitures-populaires" className="animate-fade-in-up">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Nos voitures populaires</h2>
            <p className="mt-1 text-slate-500 dark:text-slate-400">Une sélection de véhicules disponibles dès maintenant.</p>
          </div>
          <Link to="/cars" className="hidden text-sm font-medium text-blue-900 hover:underline dark:text-blue-400 sm:block">
            Tout le catalogue →
          </Link>
        </div>

        {loading ? (
          <SkeletonGrid count={3} />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}

        <Link to="/cars" className="mt-6 block text-center text-sm font-medium text-blue-900 hover:underline dark:text-blue-400 sm:hidden">
          Tout le catalogue →
        </Link>
      </div>
    </section>
  );
}
