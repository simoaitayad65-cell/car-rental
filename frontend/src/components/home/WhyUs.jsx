import { Zap, Tag, Car, Headset } from "lucide-react";

const ITEMS = [
  { icon: Zap, title: "Réservation rapide", text: "Réservez une voiture en ligne en moins de 2 minutes, sans paperasse." },
  { icon: Tag, title: "Prix transparents", text: "Le prix affiché est le prix payé : pas de frais cachés au dernier moment." },
  { icon: Car, title: "Large choix de véhicules", text: "Citadines, berlines, SUV : un véhicule adapté à chaque besoin." },
  { icon: Headset, title: "Support client", text: "Une question ? Notre équipe vous répond directement via la messagerie." },
];

export default function WhyUs() {
  return (
    <section className="animate-fade-in-up border-y border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <h2 className="mb-10 text-center text-2xl font-bold text-slate-900 dark:text-white">Pourquoi choisir Mounfact Car</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
            >
              <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-900/10 text-blue-900 dark:bg-blue-500/10 dark:text-blue-400">
                <Icon size={22} />
              </span>
              <h3 className="mb-1 font-semibold text-slate-900 dark:text-white">{title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
