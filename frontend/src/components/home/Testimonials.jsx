import { Star } from "lucide-react";

// Témoignages de présentation (pas des avis réels issus de la base de données).
const TESTIMONIALS = [
  {
    name: "Yassine B.",
    role: "Casablanca",
    quote: "Réservation faite en 5 minutes depuis mon téléphone, la voiture était prête à l'heure. Simple et honnête sur le prix.",
  },
  {
    name: "Nadia El K.",
    role: "Rabat",
    quote: "Très bon rapport qualité-prix. J'ai pu suivre ma réservation et échanger directement avec l'équipe via la messagerie.",
  },
  {
    name: "Omar T.",
    role: "Marrakech",
    quote: "Grand choix de véhicules et process d'annulation flexible. C'est devenu mon service de location par défaut.",
  },
];

export default function Testimonials() {
  return (
    <section className="animate-fade-in-up border-y border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <h2 className="mb-10 text-center text-2xl font-bold text-slate-900 dark:text-white">Ce que disent nos clients</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="rounded-xl border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="mb-3 flex gap-0.5 text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={15} fill="currentColor" strokeWidth={0} />
                ))}
              </div>
              <p className="mb-4 text-sm text-slate-600 dark:text-slate-300">"{t.quote}"</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{t.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
