import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";
import PageContainer from "../components/ui/PageContainer";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import { Select } from "../components/ui/Field";
import { RESERVATION_STATUT_LABELS, RESERVATION_STATUT_COLORS } from "../lib/statuts";

const ADMIN_STATUTS = Object.keys(RESERVATION_STATUT_LABELS);

export default function Reservations() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionError, setActionError] = useState(null);

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
    setActionError(null);
    try {
      await api.put(`/reservations/${reservation.id}`, { statut });
      load();
    } catch (err) {
      setActionError(err.response?.data?.message ?? "Action impossible");
    }
  }

  if (loading) return <p className="py-16 text-center text-slate-500">Chargement...</p>;
  if (error) return <p className="py-16 text-center text-red-600">{error}</p>;

  return (
    <PageContainer>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">
        {isAdmin ? "Toutes les réservations" : "Mes réservations"}
      </h1>
      {actionError && <p className="mb-4 text-sm text-red-600">{actionError}</p>}
      {reservations.length === 0 && <p className="text-slate-500">Aucune réservation.</p>}

      {reservations.length > 0 && (
        <Card className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
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
                <tr key={r.id} className="border-b border-slate-100 last:border-0">
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {r.car?.marque} {r.car?.modele}
                  </td>
                  {isAdmin && <td className="px-4 py-3 text-slate-600">{r.user?.name}</td>}
                  <td className="px-4 py-3 text-slate-600">{r.date_debut}</td>
                  <td className="px-4 py-3 text-slate-600">{r.date_fin}</td>
                  <td className="px-4 py-3 text-slate-600">{r.prix_total} €</td>
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
      )}
    </PageContainer>
  );
}
