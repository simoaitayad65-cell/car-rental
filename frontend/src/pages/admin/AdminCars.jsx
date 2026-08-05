import { useEffect, useState } from "react";
import api from "../../api/client";
import PageContainer from "../../components/ui/PageContainer";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { LinkButton } from "../../components/ui/Button";
import { CAR_STATUT_LABELS, CAR_STATUT_COLORS } from "../../lib/statuts";

export default function AdminCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function load() {
    setLoading(true);
    api
      .get("/cars")
      .then(({ data }) => setCars(data))
      .catch(() => setError("Impossible de charger les voitures"))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleDelete(car) {
    const ok = window.confirm(
      `Supprimer ${car.marque} ${car.modele} ? Les réservations liées à cette voiture seront aussi supprimées.`
    );
    if (!ok) return;

    try {
      await api.delete(`/cars/${car.id}`);
      load();
    } catch {
      setError("Suppression impossible");
    }
  }

  return (
    <PageContainer>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Voitures</h1>
        <LinkButton to="/admin/cars/new">+ Ajouter une voiture</LinkButton>
      </div>

      {loading && <p className="text-slate-500 dark:text-slate-400">Chargement...</p>}
      {error && <p className="text-red-600 dark:text-red-400">{error}</p>}

      {!loading && cars.length > 0 && (
        <Card className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3 font-medium">Voiture</th>
                <th className="px-4 py-3 font-medium">Catégorie</th>
                <th className="px-4 py-3 font-medium">Prix/jour</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 font-medium">Immatriculation</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr key={car.id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                  <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">
                    {car.marque} {car.modele}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{car.category?.nom ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{car.prix_jour} €</td>
                  <td className="px-4 py-3">
                    <Badge color={CAR_STATUT_COLORS[car.statut]}>
                      {CAR_STATUT_LABELS[car.statut] ?? car.statut}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{car.immatriculation}</td>
                  <td className="space-x-2 px-4 py-3 text-right">
                    <LinkButton to={`/admin/cars/${car.id}/edit`} variant="secondary">
                      Modifier
                    </LinkButton>
                    <button
                      type="button"
                      onClick={() => handleDelete(car)}
                      className="text-sm font-medium text-red-600 hover:underline dark:text-red-400"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </PageContainer>
  );
}
