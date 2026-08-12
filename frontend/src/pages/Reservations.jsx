import { useEffect, useState } from "react";
import { CalendarX2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import api from "../api/client";
import PageContainer from "../components/ui/PageContainer";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import { SkeletonRows } from "../components/ui/Skeleton";
import { Select } from "../components/ui/Field";
import { RESERVATION_STATUT_LABELS, RESERVATION_STATUT_COLORS } from "../lib/statuts";

const ADMIN_STATUTS = Object.keys(RESERVATION_STATUT_LABELS);

export default function Reservations() {
  const { user } = useAuth();
  const toast = useToast();
  const isAdmin = user?.role === "admin";
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function load() {
    setLoading(true);
    api
      .get("/reservations")
      .then(({ data }) => setReservations(data))
      .catch(() => setError("Impossible de charger les réservations"))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function updateStatut(reservation, statut) {
    try {
      await api.put(`/reservations/${reservation.id}`, { statut });
      toast.success(statut === "annulee" ? "Réservation annulée." : "Statut mis à jour.");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Action impossible");
    }
  }

  return (
    <PageContainer>
      <h1 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">
        {isAdmin ? "Toutes les réservations" : "Mes réservations"}
      </h1>

      {loading && (
        <Card className="overflow-hidden">
          <SkeletonRows count={5} />
        </Card>
      )}

      {!loading && error && <p className="text-red-600 dark:text-red-400">{error}</p>}

      {!loading && !error && reservations.length === 0 && (
        <EmptyState
          icon={CalendarX2}
          title="Aucune réservation"
          description={isAdmin ? "Aucune réservation n'a encore été créée." : "Vous n'avez pas encore réservé de voiture."}
          actionLabel={isAdmin ? undefined : "Voir les voitures"}
          actionTo={isAdmin ? undefined : "/cars"}
        />
      )}

      {!loading && !error && reservations.length > 0 && (
        <>
          {/* Desktop / tablet : tableau */}
          <Card className="hidden overflow-x-auto sm:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Voiture</th>
                  {isAdmin && <th className="px-4 py-3 font-medium">Client</th>}
                  <th className="px-4 py-3 font-medium">Du</th>
                  <th className="px-4 py-3 font-medium">Au</th>
                  <th className="px-4 py-3 font-medium">Prix total</th>
                  <th className="px-4 py-3 font-medium">Statut</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((r) => (
                  <tr key={r.id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                    <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">
                      {r.car?.marque} {r.car?.modele}
                    </td>
                    {isAdmin && <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{r.user?.name}</td>}
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{r.date_debut}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{r.date_fin}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{r.prix_total} €</td>
                    <td className="px-4 py-3">
                      <Badge color={RESERVATION_STATUT_COLORS[r.statut]}>
                        {RESERVATION_STATUT_LABELS[r.statut] ?? r.statut}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      {isAdmin ? (
                        <Select value={r.statut} onChange={(e) => updateStatut(r, e.target.value)} className="w-36">
                          {ADMIN_STATUTS.map((s) => (
                            <option key={s} value={s}>
                              {RESERVATION_STATUT_LABELS[s]}
                            </option>
                          ))}
                        </Select>
                      ) : (
                        !["terminee", "annulee"].includes(r.statut) && (
                          <Button variant="danger" onClick={() => updateStatut(r, "annulee")}>
                            Annuler
                          </Button>
                        )
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          {/* Mobile : cartes */}
          <div className="space-y-3 sm:hidden">
            {reservations.map((r) => (
              <Card key={r.id} className="p-4">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-200">
                      {r.car?.marque} {r.car?.modele}
                    </p>
                    {isAdmin && <p className="text-xs text-slate-500 dark:text-slate-400">{r.user?.name}</p>}
                  </div>
                  <Badge color={RESERVATION_STATUT_COLORS[r.statut]}>
                    {RESERVATION_STATUT_LABELS[r.statut] ?? r.statut}
                  </Badge>
                </div>
                <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">
                  {r.date_debut} → {r.date_fin} · <span className="font-medium text-slate-700 dark:text-slate-300">{r.prix_total} €</span>
                </p>
                {isAdmin ? (
                  <Select value={r.statut} onChange={(e) => updateStatut(r, e.target.value)} className="w-full">
                    {ADMIN_STATUTS.map((s) => (
                      <option key={s} value={s}>
                        {RESERVATION_STATUT_LABELS[s]}
                      </option>
                    ))}
                  </Select>
                ) : (
                  !["terminee", "annulee"].includes(r.statut) && (
                    <Button variant="danger" className="w-full" onClick={() => updateStatut(r, "annulee")}>
                      Annuler
                    </Button>
                  )
                )}
              </Card>
            ))}
          </div>
        </>
      )}
    </PageContainer>
  );
}
