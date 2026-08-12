import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarCheck, Euro, Car, Users } from "lucide-react";
import api from "../../api/client";
import StatCard from "../../components/admin/StatCard";
import LineChart from "../../components/admin/LineChart";
import StatusBarChart from "../../components/admin/StatusBarChart";
import Badge from "../../components/ui/Badge";
import { RESERVATION_STATUT_LABELS, RESERVATION_STATUT_COLORS } from "../../lib/statuts";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/admin/stats")
      .then(({ data }) => setStats(data))
      .catch(() => setError("Impossible de charger les statistiques"));
  }, []);

  if (error) return <p className="p-8 text-center text-red-600">{error}</p>;
  if (!stats) return <p className="p-8 text-center text-slate-500 dark:text-slate-400">Chargement...</p>;

  const { totals } = stats;

  return (
    <div className="mx-auto max-w-7xl animate-fade-in-up px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">Tableau de bord</h1>

      {/* KPI row */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={CalendarCheck} label="Réservations totales" value={totals.reservations} accent="blue" />
        <StatCard
          icon={Euro}
          label="Revenu (payé)"
          value={`${totals.revenue.toLocaleString("fr-FR")} €`}
          accent="green"
        />
        <StatCard
          icon={Car}
          label="Voitures disponibles"
          value={`${totals.cars_disponible} / ${totals.cars_total}`}
          accent="amber"
        />
        <StatCard icon={Users} label="Clients inscrits" value={totals.clients} accent="slate" />
      </div>

      {/* Charts row */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <LineChart title="Réservations (14 derniers jours)" data={stats.reservations_by_day} color="#2a78d6" />
        <LineChart
          title="Revenu (14 derniers jours)"
          data={stats.revenue_by_day}
          color="#008300"
          isCurrency
        />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <StatusBarChart
            title="Disponibilité du parc"
            bars={[
              { label: "Disponible", value: totals.cars_disponible, status: "good" },
              { label: "Loué", value: totals.cars_loue, status: "warning" },
              { label: "Maintenance", value: totals.cars_maintenance, status: "critical" },
            ]}
          />
        </div>

        {/* Recent reservations */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Dernières réservations</h3>
            <Link to="/reservations" className="text-sm font-medium text-blue-900 hover:underline dark:text-blue-400">
              Voir tout →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-2 font-medium">Client</th>
                  <th className="px-5 py-2 font-medium">Voiture</th>
                  <th className="px-5 py-2 font-medium">Prix</th>
                  <th className="px-5 py-2 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_reservations.map((r) => (
                  <tr key={r.id} className="border-t border-slate-100 dark:border-slate-800">
                    <td className="px-5 py-2.5 text-slate-700 dark:text-slate-300">{r.user?.name}</td>
                    <td className="px-5 py-2.5 text-slate-700 dark:text-slate-300">
                      {r.car?.marque} {r.car?.modele}
                    </td>
                    <td className="px-5 py-2.5 text-slate-700 dark:text-slate-300">{r.prix_total} €</td>
                    <td className="px-5 py-2.5">
                      <Badge color={RESERVATION_STATUT_COLORS[r.statut]}>
                        {RESERVATION_STATUT_LABELS[r.statut] ?? r.statut}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recently added cars */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Dernières voitures ajoutées</h3>
          <Link to="/admin/cars" className="text-sm font-medium text-blue-900 hover:underline dark:text-blue-400">
            Voir tout →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {stats.recent_cars.map((car) => (
            <Link
              key={car.id}
              to={`/admin/cars/${car.id}/edit`}
              className="group overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800"
            >
              {car.image && (
                <img
                  src={car.image}
                  alt={`${car.marque} ${car.modele}`}
                  className="h-24 w-full object-cover transition-transform group-hover:scale-105"
                />
              )}
              <div className="p-2">
                <p className="truncate text-xs font-medium text-slate-800 dark:text-slate-200">
                  {car.marque} {car.modele}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{car.prix_jour} €/j</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
