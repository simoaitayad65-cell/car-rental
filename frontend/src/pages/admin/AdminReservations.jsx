import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, X, CalendarX2, CheckCircle2, KeyRound, Undo2, XCircle } from "lucide-react";
import api from "../../api/client";
import { useToast } from "../../context/ToastContext";
import PageContainer from "../../components/ui/PageContainer";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";
import { SkeletonRows } from "../../components/ui/Skeleton";
import { Select } from "../../components/ui/Field";
import { RESERVATION_STATUT_LABELS, RESERVATION_STATUT_COLORS } from "../../lib/statuts";

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });
}

function ActionButtons({ reservation, onAction, acting }) {
  const busy = acting === reservation.id;
  switch (reservation.statut) {
    case "en_attente":
      return (
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => onAction(reservation, "confirmee")} disabled={busy}>
            <CheckCircle2 size={14} /> Confirmer
          </Button>
          <Button variant="danger" onClick={() => onAction(reservation, "annulee")} disabled={busy}>
            <XCircle size={14} /> Annuler
          </Button>
        </div>
      );
    case "confirmee":
      return (
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => onAction(reservation, "en_cours")} disabled={busy}>
            <KeyRound size={14} /> Démarrer
          </Button>
          <Button variant="danger" onClick={() => onAction(reservation, "annulee")} disabled={busy}>
            <XCircle size={14} /> Annuler
          </Button>
        </div>
      );
    case "en_cours":
      return (
        <Button onClick={() => onAction(reservation, "terminee")} disabled={busy}>
          <Undo2 size={14} /> Terminer (retour)
        </Button>
      );
    default:
      return <span className="text-xs text-slate-400 dark:text-slate-500">—</span>;
  }
}

export default function AdminReservations() {
  const toast = useToast();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statutFilter, setStatutFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [acting, setActing] = useState(null);

  function load() {
    setLoading(true);
    api
      .get("/reservations")
      .then(({ data }) => setReservations(data))
      .catch(() => setError("Impossible de charger les réservations"))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleAction(reservation, statut) {
    setActing(reservation.id);
    try {
      await api.put(`/reservations/${reservation.id}`, { statut });
      toast.success(statut === "annulee" ? "Réservation annulée." : "Statut mis à jour.");
      load();
    } catch (err) {
      toast.error(err.response?.data?.message ?? "Action impossible");
    } finally {
      setActing(null);
    }
  }

  const filtered = useMemo(() => {
    let result = reservations;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((r) =>
        `${r.user?.name ?? ""} ${r.car?.marque ?? ""} ${r.car?.modele ?? ""}`.toLowerCase().includes(q)
      );
    }
    if (statutFilter) {
      result = result.filter((r) => r.statut === statutFilter);
    }
    if (dateFilter) {
      result = result.filter((r) => r.date_debut <= dateFilter && r.date_fin >= dateFilter);
    }
    return result;
  }, [reservations, search, statutFilter, dateFilter]);

  return (
    <PageContainer>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Gestion des locations</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">
          {loading ? "Chargement..." : `${filtered.length} réservation(s)`}
        </p>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un client ou une voiture..."
            className="w-full rounded-md border border-slate-300 py-2 pl-9 pr-3 text-sm shadow-sm focus:border-blue-900 focus:outline-none focus:ring-1 focus:ring-blue-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          />
        </div>
        <Select value={statutFilter} onChange={(e) => setStatutFilter(e.target.value)} className="sm:w-48">
          <option value="">Tous les statuts</option>
          {Object.entries(RESERVATION_STATUT_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
        <div className="relative sm:w-44">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-blue-900 focus:outline-none focus:ring-1 focus:ring-blue-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          />
          {dateFilter && (
            <button
              type="button"
              onClick={() => setDateFilter("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label="Effacer la date"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {loading && (
        <Card className="overflow-hidden">
          <SkeletonRows count={6} />
        </Card>
      )}
      {!loading && error && <p className="text-red-600 dark:text-red-400">{error}</p>}

      {!loading && !error && filtered.length === 0 && (
        <EmptyState
          icon={CalendarX2}
          title="Aucune réservation"
          description="Aucune réservation ne correspond à ces filtres."
        />
      )}

      {!loading && !error && filtered.length > 0 && (
        <>
          {/* Desktop / tablet */}
          <Card className="hidden overflow-x-auto sm:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Client</th>
                  <th className="px-4 py-3 font-medium">Voiture</th>
                  <th className="px-4 py-3 font-medium">Du</th>
                  <th className="px-4 py-3 font-medium">Au</th>
                  <th className="px-4 py-3 font-medium">Prix</th>
                  <th className="px-4 py-3 font-medium">Statut</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                    <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{r.user?.name}</td>
                    <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">
                      {r.car?.marque} {r.car?.modele}
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{formatDate(r.date_debut)}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{formatDate(r.date_fin)}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{r.prix_total} €</td>
                    <td className="px-4 py-3">
                      <Badge color={RESERVATION_STATUT_COLORS[r.statut]}>
                        {RESERVATION_STATUT_LABELS[r.statut] ?? r.statut}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <ActionButtons reservation={r} onAction={handleAction} acting={acting} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link to={`/reservations/${r.id}`} className="text-sm font-medium text-blue-900 hover:underline dark:text-blue-400">
                        Détails
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          {/* Mobile */}
          <div className="space-y-3 sm:hidden">
            {filtered.map((r) => (
              <Card key={r.id} className="p-4">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-slate-800 dark:text-slate-200">
                      {r.car?.marque} {r.car?.modele}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{r.user?.name}</p>
                  </div>
                  <Badge color={RESERVATION_STATUT_COLORS[r.statut]}>
                    {RESERVATION_STATUT_LABELS[r.statut] ?? r.statut}
                  </Badge>
                </div>
                <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">
                  {formatDate(r.date_debut)} → {formatDate(r.date_fin)} ·{" "}
                  <span className="font-medium text-slate-700 dark:text-slate-300">{r.prix_total} €</span>
                </p>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <ActionButtons reservation={r} onAction={handleAction} acting={acting} />
                  <Link to={`/reservations/${r.id}`} className="text-sm font-medium text-blue-900 hover:underline dark:text-blue-400">
                    Détails
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </PageContainer>
  );
}
