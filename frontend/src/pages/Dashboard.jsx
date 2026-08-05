import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";
import PageContainer from "../components/ui/PageContainer";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { RESERVATION_STATUT_LABELS, RESERVATION_STATUT_COLORS } from "../lib/statuts";

const RECENT_COUNT = 5;

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/reservations")
      .then(({ data }) => setReservations(data))
      .catch(() => setError("Impossible de charger les réservations"))
      .finally(() => setLoading(false));
  }, []);

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <PageContainer>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-8">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900">Bienvenue {user?.name}</h1>
            <Badge color={user?.role === "admin" ? "indigo" : "violet"}>{user?.role}</Badge>
          </div>

          <dl className="mb-6 space-y-2 text-sm">
            <div className="flex justify-between border-b border-slate-100 py-2">
              <dt className="text-slate-500">Email</dt>
              <dd className="font-medium text-slate-800">{user?.email}</dd>
            </div>
            <div className="flex justify-between border-b border-slate-100 py-2">
              <dt className="text-slate-500">Téléphone</dt>
              <dd className="font-medium text-slate-800">{user?.telephone ?? "—"}</dd>
            </div>
            <div className="flex justify-between border-b border-slate-100 py-2">
              <dt className="text-slate-500">Adresse</dt>
              <dd className="font-medium text-slate-800">{user?.adresse ?? "—"}</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-slate-500">Numéro de permis</dt>
              <dd className="font-medium text-slate-800">{user?.numero_permis ?? "—"}</dd>
            </div>
          </dl>

          <Button variant="secondary" onClick={handleLogout}>
            Se déconnecter
          </Button>
        </Card>

        <Card className="p-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              {user?.role === "admin" ? "Dernières réservations" : "Mes réservations"}
            </h2>
            <Link to="/reservations" className="text-sm font-medium text-violet-700 hover:underline">
              Voir tout →
            </Link>
          </div>

          {loading && <p className="text-sm text-slate-500">Chargement...</p>}
          {error && <p className="text-sm text-red-600">{error}</p>}

          {!loading && !error && reservations.length === 0 && (
            <p className="text-sm text-slate-500">
              Aucune réservation pour l'instant.{" "}
              <Link to="/cars" className="font-medium text-violet-700 hover:underline">
                Voir les voitures
              </Link>
            </p>
          )}

          <ul className="divide-y divide-slate-100">
            {reservations.slice(0, RECENT_COUNT).map((r) => (
              <li key={r.id} className="flex items-center justify-between py-2.5 text-sm">
                <div>
                  <p className="font-medium text-slate-800">
                    {r.car?.marque} {r.car?.modele}
                  </p>
                  <p className="text-slate-500">
                    {r.date_debut} → {r.date_fin} · {r.prix_total} €
                  </p>
                </div>
                <Badge color={RESERVATION_STATUT_COLORS[r.statut]}>
                  {RESERVATION_STATUT_LABELS[r.statut] ?? r.statut}
                </Badge>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </PageContainer>
  );
}
