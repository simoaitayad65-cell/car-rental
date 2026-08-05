import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/client";
import PageContainer from "../../components/ui/PageContainer";
import Card from "../../components/ui/Card";
import Field, { Input, Textarea } from "../../components/ui/Field";
import Button from "../../components/ui/Button";

export default function AdminCategoryForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(isEdit);
  const [errors, setErrors] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    api
      .get(`/categories/${id}`)
      .then(({ data }) => {
        setNom(data.nom ?? "");
        setDescription(data.description ?? "");
      })
      .catch(() => setErrors({ message: "Catégorie introuvable" }))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors(null);
    setSubmitting(true);
    try {
      if (isEdit) {
        await api.put(`/categories/${id}`, { nom, description });
      } else {
        await api.post("/categories", { nom, description });
      }
      navigate("/admin/categories");
    } catch (err) {
      setErrors(err.response?.data ?? { message: "Erreur lors de l'enregistrement" });
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="py-16 text-center text-slate-500 dark:text-slate-400">Chargement...</p>;

  return (
    <PageContainer narrow>
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
          {isEdit ? "Modifier la catégorie" : "Ajouter une catégorie"}
        </h2>

        <form onSubmit={handleSubmit}>
          <Field label="Nom">
            <Input value={nom} onChange={(e) => setNom(e.target.value)} required />
          </Field>
          <Field label="Description">
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          </Field>

          {errors && (
            <ul className="mb-4 list-disc space-y-1 pl-5 text-sm text-red-600 dark:text-red-400">
              {Object.entries(errors)
                .filter(([key]) => key !== "message")
                .flatMap(([, messages]) => messages)
                .map((msg) => (
                  <li key={msg}>{msg}</li>
                ))}
              {errors.message && <li>{errors.message}</li>}
            </ul>
          )}

          <Button type="submit" disabled={submitting}>
            {submitting ? "Enregistrement..." : isEdit ? "Enregistrer" : "Créer"}
          </Button>
        </form>
      </Card>
    </PageContainer>
  );
}
