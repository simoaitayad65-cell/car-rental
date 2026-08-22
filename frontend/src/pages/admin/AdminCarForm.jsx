import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/client";
import PageContainer from "../../components/ui/PageContainer";
import Card from "../../components/ui/Card";
import Field, { Input, Select, Textarea } from "../../components/ui/Field";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import { CAR_STATUT_LABELS, CAR_STATUT_COLORS } from "../../lib/statuts";

const AUTO_MANAGED_STATUTS = ["reservee", "en_location", "retournee"];

const emptyForm = {
  category_id: "",
  marque: "",
  modele: "",
  immatriculation: "",
  prix_jour: "",
  statut: "disponible",
  image: "",
  images: "",
  nb_places: "",
  transmission: "",
  carburant: "",
  nb_portes: "",
  climatisation: true,
  description: "",
};

export default function AdminCarForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(isEdit);
  const [errors, setErrors] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get("/categories").then(({ data }) => setCategories(data));
  }, []);

  useEffect(() => {
    if (!isEdit) return;
    api
      .get(`/cars/${id}`)
      .then(({ data }) => {
        setForm({
          category_id: data.category_id ?? "",
          marque: data.marque ?? "",
          modele: data.modele ?? "",
          immatriculation: data.immatriculation ?? "",
          prix_jour: data.prix_jour ?? "",
          statut: data.statut ?? "disponible",
          image: data.image ?? "",
          images: "",
          nb_places: data.nb_places ?? "",
          transmission: data.transmission ?? "",
          carburant: data.carburant ?? "",
          nb_portes: data.nb_portes ?? "",
          climatisation: data.climatisation ?? true,
          description: data.description ?? "",
        });
      })
      .catch(() => setErrors({ message: "Voiture introuvable" }))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors(null);
    setSubmitting(true);

    const payload = {
      category_id: form.category_id || null,
      marque: form.marque,
      modele: form.modele,
      immatriculation: form.immatriculation,
      prix_jour: form.prix_jour,
      statut: form.statut,
      image: form.image || null,
      nb_places: form.nb_places || null,
      transmission: form.transmission || null,
      carburant: form.carburant || null,
      nb_portes: form.nb_portes || null,
      climatisation: form.climatisation,
      description: form.description || null,
    };

    if (!isEdit) {
      payload.images = form.images
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    try {
      if (isEdit) {
        await api.put(`/cars/${id}`, payload);
      } else {
        await api.post("/cars", payload);
      }
      navigate("/admin/cars");
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
          {isEdit ? "Modifier la voiture" : "Ajouter une voiture"}
        </h2>

        <form onSubmit={handleSubmit}>
          <Field label="Catégorie">
            <Select value={form.category_id} onChange={update("category_id")}>
              <option value="">Sans catégorie</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nom}
                </option>
              ))}
            </Select>
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Marque">
              <Input value={form.marque} onChange={update("marque")} required />
            </Field>
            <Field label="Modèle">
              <Input value={form.modele} onChange={update("modele")} required />
            </Field>
          </div>
          <Field label="Immatriculation">
            <Input value={form.immatriculation} onChange={update("immatriculation")} required />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Prix / jour (€)">
              <Input
                type="number"
                step="0.01"
                min="0"
                value={form.prix_jour}
                onChange={update("prix_jour")}
                required
              />
            </Field>
            <Field label="Statut">
              {AUTO_MANAGED_STATUTS.includes(form.statut) ? (
                <div className="flex h-[38px] items-center gap-2 rounded-md border border-slate-200 bg-slate-100 px-3 dark:border-slate-700 dark:bg-slate-800">
                  <Badge color={CAR_STATUT_COLORS[form.statut]}>{CAR_STATUT_LABELS[form.statut]}</Badge>
                  <span className="text-xs text-slate-500 dark:text-slate-400">géré automatiquement</span>
                </div>
              ) : (
                <Select value={form.statut} onChange={update("statut")}>
                  <option value="disponible">Disponible</option>
                  <option value="maintenance">Maintenance</option>
                </Select>
              )}
            </Field>
          </div>

          <p className="mb-2 mt-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
            Caractéristiques (facultatif)
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Nombre de places">
              <Input type="number" min="1" max="50" value={form.nb_places} onChange={update("nb_places")} />
            </Field>
            <Field label="Nombre de portes">
              <Input type="number" min="1" max="10" value={form.nb_portes} onChange={update("nb_portes")} />
            </Field>
            <Field label="Transmission">
              <Select value={form.transmission} onChange={update("transmission")}>
                <option value="">Non renseigné</option>
                <option value="manuelle">Manuelle</option>
                <option value="automatique">Automatique</option>
              </Select>
            </Field>
            <Field label="Carburant">
              <Select value={form.carburant} onChange={update("carburant")}>
                <option value="">Non renseigné</option>
                <option value="essence">Essence</option>
                <option value="diesel">Diesel</option>
                <option value="hybride">Hybride</option>
                <option value="electrique">Électrique</option>
              </Select>
            </Field>
          </div>
          <label className="mb-4 flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
            <input
              type="checkbox"
              checked={form.climatisation}
              onChange={(e) => setForm((f) => ({ ...f, climatisation: e.target.checked }))}
              className="h-4 w-4 rounded border-slate-300 text-blue-900 focus:ring-blue-900"
            />
            Climatisation
          </label>
          <Field label="Description">
            <Textarea
              value={form.description}
              onChange={update("description")}
              rows={3}
              placeholder="Quelques phrases pour présenter le véhicule..."
            />
          </Field>

          <Field label="Image (URL)">
            <Input value={form.image} onChange={update("image")} placeholder="https://..." />
          </Field>
          {!isEdit && (
            <Field label="Galerie (une URL par ligne)">
              <Textarea value={form.images} onChange={update("images")} rows={3} />
            </Field>
          )}

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
