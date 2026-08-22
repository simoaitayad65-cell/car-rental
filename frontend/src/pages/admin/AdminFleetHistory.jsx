import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { History } from "lucide-react";
import api from "../../api/client";
import PageContainer from "../../components/ui/PageContainer";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";
import { SkeletonRows } from "../../components/ui/Skeleton";
import { CAR_STATUT_LABELS, CAR_STATUT_COLORS } from "../../lib/statuts";

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function formatDateTime(d) {
  if (!d) return "—";
  return new Date(d).toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminFleetHistory() {
  const { carId } = useParams();
  const [car, setCar] = useState(null);
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/admin/cars/${carId}/movements`)
      .then(({ data }) => {
        setCar(data.car);
        setMovements(data.movements);
      })
      .catch(() => setError("Impossible de charger l'historique"))
      .finally(() => setLoading(false));
  }, [carId]);

  return (
    <PageContainer>
      <Link to="/admin/fleet" className="mb-4 inline-block text-sm text-blue-900 hover:underline dark:text-blue-400">
        &larr; Retour au suivi des véhicules
      </Link>

      {loading && (
        <Card className="overflow-hidden">
          <SkeletonRows count={5} />
        </Card>
      )}
      {!loading && error && <p className="text-red-600 dark:text-red-400">{error}</p>}

      {!loading && !error && car && (
        <>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                {car.marque} {car.modele}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {car.category?.nom ?? "Sans catégorie"} · {car.immatriculation}
              </p>
            </div>
            <Badge color={CAR_STATUT_COLORS[car.statut]}>{CAR_STATUT_LABELS[car.statut] ?? car.statut}</Badge>
          </div>

          {movements.length === 0 && (
            <EmptyState
              icon={History}
              title="Aucun mouvement enregistré"
              description="Cette voiture n'est encore jamais sortie pour une location."
            />
          )}

          {movements.length > 0 && (
            <>
              {/* Desktop / tablet */}
              <Card className="hidden overflow-x-auto sm:block">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                    <tr>
                      <th className="px-4 py-3 font-medium">Client</th>
                      <th className="px-4 py-3 font-medium">Réservation</th>
                      <th className="px-4 py-3 font-medium">Sortie</th>
                      <th className="px-4 py-3 font-medium">Retour prévu</th>
                      <th className="px-4 py-3 font-medium">Retour réel</th>
                      <th className="px-4 py-3 font-medium">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {movements.map((m) => (
                      <tr key={m.id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                        <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                          {m.reservation?.user?.name ?? "—"}
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                          {m.reservation ? `${formatDate(m.reservation.date_debut)} → ${formatDate(m.reservation.date_fin)}` : "—"}
                        </td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{formatDateTime(m.date_sortie)}</td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{formatDate(m.date_retour_prevue)}</td>
                        <td className="px-4 py-3 text-slate-600 dark:text-slate-400">
                          {formatDateTime(m.date_retour_reelle)}
                        </td>
                        <td className="px-4 py-3">
                          {m.date_retour_reelle ? (
                            <Badge color="green">Terminé</Badge>
                          ) : (
                            <Badge color="blue">En cours</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>

              {/* Mobile */}
              <div className="space-y-3 sm:hidden">
                {movements.map((m) => (
                  <Card key={m.id} className="p-4">
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <p className="font-medium text-slate-800 dark:text-slate-200">
                        {m.reservation?.user?.name ?? "Client inconnu"}
                      </p>
                      {m.date_retour_reelle ? (
                        <Badge color="green">Terminé</Badge>
                      ) : (
                        <Badge color="blue">En cours</Badge>
                      )}
                    </div>
                    {m.reservation && (
                      <p className="mb-2 text-xs text-slate-500 dark:text-slate-400">
                        Réservation : {formatDate(m.reservation.date_debut)} → {formatDate(m.reservation.date_fin)}
                      </p>
                    )}
                    <dl className="space-y-1 text-sm text-slate-500 dark:text-slate-400">
                      <div className="flex justify-between">
                        <dt>Sortie</dt>
                        <dd>{formatDateTime(m.date_sortie)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt>Retour prévu</dt>
                        <dd>{formatDate(m.date_retour_prevue)}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt>Retour réel</dt>
                        <dd>{formatDateTime(m.date_retour_reelle)}</dd>
                      </div>
                    </dl>
                  </Card>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </PageContainer>
  );
}
