import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import api from "../../api/client";

export default function SearchBar() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    api
      .get("/categories")
      .then(({ data }) => setCategories(data))
      .catch(() => {});
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    navigate(categoryId ? `/cars?category_id=${categoryId}` : "/cars");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-xl bg-slate-50/95 p-3 shadow-xl backdrop-blur-sm sm:flex-row sm:items-center"
    >
      <label className="flex-1">
        <span className="mb-1 block px-1 text-xs font-medium text-slate-500">Catégorie</span>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 focus:border-blue-900 focus:outline-none focus:ring-1 focus:ring-blue-900"
        >
          <option value="">Toutes les catégories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nom}
            </option>
          ))}
        </select>
      </label>

      <button
        type="submit"
        className="flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-6 py-2.5 text-sm font-semibold text-slate-900 transition-colors hover:bg-amber-600 sm:mt-5"
      >
        <Search size={16} />
        Rechercher
      </button>
    </form>
  );
}
