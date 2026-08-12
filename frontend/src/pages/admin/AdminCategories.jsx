import { useEffect, useState } from "react";
import { Tags } from "lucide-react";
import api from "../../api/client";
import { useToast } from "../../context/ToastContext";
import PageContainer from "../../components/ui/PageContainer";
import Card from "../../components/ui/Card";
import EmptyState from "../../components/ui/EmptyState";
import { SkeletonRows } from "../../components/ui/Skeleton";
import { LinkButton } from "../../components/ui/Button";

export default function AdminCategories() {
  const toast = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  function load() {
    setLoading(true);
    api
      .get("/categories")
      .then(({ data }) => setCategories(data))
      .catch(() => setError("Impossible de charger les catégories"))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleDelete(category) {
    const ok = window.confirm(
      `Supprimer la catégorie "${category.nom}" ? Les voitures liées perdront leur catégorie.`
    );
    if (!ok) return;

    try {
      await api.delete(`/categories/${category.id}`);
      toast.success("Catégorie supprimée.");
      load();
    } catch {
      toast.error("Suppression impossible");
    }
  }

  return (
    <PageContainer narrow>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Catégories</h1>
        <LinkButton to="/admin/categories/new">+ Ajouter une catégorie</LinkButton>
      </div>

      {loading && (
        <Card className="overflow-hidden">
          <SkeletonRows count={4} />
        </Card>
      )}
      {!loading && error && <p className="text-red-600 dark:text-red-400">{error}</p>}

      {!loading && !error && categories.length === 0 && (
        <EmptyState
          icon={Tags}
          title="Aucune catégorie"
          description="Créez votre première catégorie de véhicules."
          actionLabel="Ajouter une catégorie"
          actionTo="/admin/categories/new"
        />
      )}

      {!loading && !error && categories.length > 0 && (
        <>
          {/* Desktop / tablet */}
          <Card className="hidden overflow-x-auto sm:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
                <tr>
                  <th className="px-4 py-3 font-medium">Nom</th>
                  <th className="px-4 py-3 font-medium">Description</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                    <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-200">{cat.nom}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{cat.description}</td>
                    <td className="space-x-2 px-4 py-3 text-right">
                      <LinkButton to={`/admin/categories/${cat.id}/edit`} variant="secondary">
                        Modifier
                      </LinkButton>
                      <button
                        type="button"
                        onClick={() => handleDelete(cat)}
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

          {/* Mobile */}
          <div className="space-y-3 sm:hidden">
            {categories.map((cat) => (
              <Card key={cat.id} className="p-4">
                <p className="font-medium text-slate-800 dark:text-slate-200">{cat.nom}</p>
                {cat.description && (
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{cat.description}</p>
                )}
                <div className="mt-3 flex gap-2">
                  <LinkButton to={`/admin/categories/${cat.id}/edit`} variant="secondary" className="flex-1 justify-center">
                    Modifier
                  </LinkButton>
                  <button
                    type="button"
                    onClick={() => handleDelete(cat)}
                    className="flex-1 rounded-md border border-red-200 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10"
                  >
                    Supprimer
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </PageContainer>
  );
}
