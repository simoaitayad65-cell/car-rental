import { Search, CalendarCheck, KeyRound } from "lucide-react";

const STEPS = [
  { icon: Search, title: "1. Choisissez votre voiture", text: "Parcourez le catalogue et trouvez le véhicule qui correspond à votre trajet et votre budget." },
  { icon: CalendarCheck, title: "2. Réservez en ligne", text: "Sélectionnez vos dates, confirmez vos coordonnées : votre demande part instantanément." },
  { icon: KeyRound, title: "3. Récupérez les clés", text: "Une fois votre réservation confirmée, récupérez votre voiture le jour J et prenez la route." },
];

export default function HowItWorks() {
  return (
    <section className="animate-fade-in-up">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <h2 className="mb-10 text-center text-2xl font-bold text-slate-900 dark:text-white">Comment ça marche</h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, text }, i) => (
            <div key={title} className="relative text-center">
              <div className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-900 text-white shadow-lg shadow-blue-900/20">
                <Icon size={26} />
              </div>
              <h3 className="mb-1 font-semibold text-slate-900 dark:text-white">{title}</h3>
              <p className="mx-auto max-w-xs text-sm text-slate-500 dark:text-slate-400">{text}</p>
              {i < STEPS.length - 1 && (
                <span className="absolute right-[-1rem] top-8 hidden h-px w-8 bg-slate-300 dark:bg-slate-700 sm:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
