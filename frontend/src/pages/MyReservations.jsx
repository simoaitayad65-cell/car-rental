import { useEffect, useState } from "react";
import { CalendarX2 } from "lucide-react";
import api from "../api/client";
import PageContainer from "../components/ui/PageContainer";
import EmptyState from "../components/ui/EmptyState";
import { SkeletonGrid } from "../components/ui/Skeleton";
import ReservationCard from "../components/reservations/ReservationCard";

export default function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/reservations")
      .then(({ data }) => setReservations(data))
      .catch(() => setError("Impossible de charger vos locations"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageContainer>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Mes locations</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">L'historique et le suivi de toutes vos réservations.</p>
      </div>

      {loading && <SkeletonGrid count={4} />}
      {!loading && error && <p className="text-red-600 dark:text-red-400">{error}</p>}

      {!loading && !error && reservations.length === 0 && (
        <EmptyState
          icon={CalendarX2}
          title="Aucune location"
          description="Vous n'avez pas encore réservé de voiture."
          actionLabel="Voir les voitures"
          actionTo="/cars"
        />
      )}

      {!loading && !error && reservations.length > 0 && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {reservations.map((r) => (
            <ReservationCard key={r.id} reservation={r} />
          ))}
        </div>
      )}
    </PageContainer>
  );
}
