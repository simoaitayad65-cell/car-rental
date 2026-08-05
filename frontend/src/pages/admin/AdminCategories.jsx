import { useEffect, useState } from "react";
import api from "../../api/client";
import PageContainer from "../../components/ui/PageContainer";
import Card from "../../components/ui/Card";
import { LinkButton } from "../../components/ui/Button";

export default function AdminCategories() {
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
      load();
    } catch {
      setError("Suppression impossible");
    }
  }

  return (
    <PageContainer narrow>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Catégories</h1>
        <LinkButton to="/admin/categories/new">+ Ajouter une catégorie</LinkButton>
      </div>

      {loading && <p className="text-slate-500 dark:text-slate-400">Chargement...</p>}
      {error && <p className="text-red-600 dark:text-red-400">{error}</p>}

      {!loading && categories.length > 0 && (
        <Card className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-400">
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
      )}
    </PageContainer>
  );
}
