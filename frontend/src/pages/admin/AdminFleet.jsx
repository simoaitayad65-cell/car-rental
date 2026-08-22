import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Route as RouteIcon, AlertTriangle } from "lucide-react";
import api from "../../api/client";
import { useToast } from "../../context/ToastContext";
import PageContainer from "../../components/ui/PageContainer";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import { SkeletonRows } from "../../components/ui/Skeleton";
import { CAR_STATUT_LABELS, CAR_STATUT_COLORS } from "../../lib/statuts";

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function isLate(movement) {
  if (!movement || movement.date_retour_reelle) return false;
  return new Date(movement.date_retour_prevue) < new Date(new Date().toDateString());
}

export default function AdminFleet() {
  const toast = useToast();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actingId, setActingId] = useState(null);

  function load() {
    setLoading(true);
    api
      .get("/admin/fleet")
      .then(({ data }) => setCars(data))
      .catch(() => setError("Impossible de charger le suivi des véhicules"))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function markAvailable(car) {
    setActingId(car.id);
    try {
      await api.post(`/admin/cars/${car.id}/mark-available`);
      toast.success(`${car.marque} ${car.modele} est de nouveau disponible.`);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Action impossible");
    } finally {
      setActingId(null);
    }
  }

  return (
    <PageContainer>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Suivi des véhicules</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          Statut en temps réel et suivi des sorties/retours de chaque voiture.
        </p>
      </div>

      {loading && (
        <Card className="overflow-hidden">
          <SkeletonRows count={6} />
        </Card>
      )}
      {!loading && error && <p className="text-red-600 dark:text-red-400">{error}</p>}
      {!loading && !error && cars.length === 0 && (
        <EmptyState
          icon={RouteIcon}
          title="Aucune voiture"
          description="Ajoutez des voitures au catalogue pour suivre leur activité."
        />
      )}

      {!loading && !error && cars.length > 0 && (
        <>
          {/* Desktop / tablet */}
          <Card className="hidden overflow-x-auto sm:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Voiture</th>
                  <th className="px-4 py-3 font-medium">Statut</th>
                  <th className="px-4 py-3 font-medium">Client actuel</th>
                  <th className="px-4 py-3 font-medium">Sortie</th>
                  <th className="px-4 py-3 font-medium">Retour prévu</th>
                  <th className="px-4 py-3 font-medium">Retour réel</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {cars.map((car) => {
                  const m = car.latest_movement;
                  const late = isLate(m);
                  return (
                    <tr key={car.id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                      <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">
                        {car.marque} {car.modele}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Badge color={CAR_STATUT_COLORS[car.statut]}>
                            {CAR_STATUT_LABELS[car.statut] ?? car.statut}
                          </Badge>
                          {late && (
                            <span className="flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400">
                              <AlertTriangle size={13} /> En retard
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                        {m?.reservation?.user?.name ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                        {m ? formatDate(m.date_sortie) : "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                        {m ? formatDate(m.date_retour_prevue) : "—"}
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                        {m?.date_retour_reelle ? formatDate(m.date_retour_reelle) : "—"}
                      </td>
                      <td className="space-x-3 px-4 py-3 text-right">
                        {["retournee", "maintenance"].includes(car.statut) && (
                          <Button
                            variant="secondary"
                            onClick={() => markAvailable(car)}
                            disabled={actingId === car.id}
                          >
                            {actingId === car.id ? "..." : "Marquer disponible"}
                          </Button>
                        )}
                        <Link
                          to={`/admin/fleet/${car.id}`}
                          className="text-sm font-medium text-blue-900 hover:underline dark:text-blue-400"
                        >
                          Historique
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Card>

          {/* Mobile */}
          <div className="space-y-3 sm:hidden">
            {cars.map((car) => {
              const m = car.latest_movement;
              const late = isLate(m);
              return (
                <Card key={car.id} className="p-4">
                  <div className="mb-2 flex items-start justify-between gap-2">
                    <p className="font-medium text-slate-800 dark:text-slate-200">
                      {car.marque} {car.modele}
                    </p>
                    <Badge color={CAR_STATUT_COLORS[car.statut]}>
                      {CAR_STATUT_LABELS[car.statut] ?? car.statut}
                    </Badge>
                  </div>
                  {late && (
                    <p className="mb-2 flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400">
                      <AlertTriangle size={13} /> Retour en retard
                    </p>
                  )}
                  <dl className="mb-3 space-y-1 text-sm text-slate-500 dark:text-slate-400">
                    <div className="flex justify-between">
                      <dt>Client</dt>
                      <dd className="font-medium text-slate-700 dark:text-slate-300">
                        {m?.reservation?.user?.name ?? "—"}
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>Sortie</dt>
                      <dd>{m ? formatDate(m.date_sortie) : "—"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>Retour prévu</dt>
                      <dd>{m ? formatDate(m.date_retour_prevue) : "—"}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt>Retour réel</dt>
                      <dd>{m?.date_retour_reelle ? formatDate(m.date_retour_reelle) : "—"}</dd>
                    </div>
                  </dl>
                  <div className="flex gap-2">
                    {["retournee", "maintenance"].includes(car.statut) && (
                      <Button
                        variant="secondary"
                        className="flex-1 justify-center"
                        onClick={() => markAvailable(car)}
                        disabled={actingId === car.id}
                      >
                        {actingId === car.id ? "..." : "Marquer disponible"}
                      </Button>
                    )}
                    <Link
                      to={`/admin/fleet/${car.id}`}
                      className="flex flex-1 items-center justify-center rounded-md border border-slate-300 text-sm font-medium text-blue-900 dark:border-slate-700 dark:text-blue-400"
                    >
                      Historique
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        </>
      )}
    </PageContainer>
  );
}
