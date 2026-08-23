import { Fragment } from "react";
import { ClipboardList, CheckCircle2, KeyRound, Undo2, Flag, XCircle } from "lucide-react";

const STEPS = [
  { key: "en_attente", label: "Réservation", icon: ClipboardList },
  { key: "confirmee", label: "Confirmation", icon: CheckCircle2 },
  { key: "en_cours", label: "Location", icon: KeyRound },
  { key: "retour", label: "Retour", icon: Undo2 },
  { key: "terminee", label: "Terminée", icon: Flag },
];

function completedCount(statut) {
  switch (statut) {
    case "en_attente":
      return 1;
    case "confirmee":
      return 2;
    case "en_cours":
      return 3;
    case "terminee":
      return 5;
    default:
      return 0;
  }
}

export default function ReservationTimeline({ statut, compact = false }) {
  if (statut === "annulee") {
    return (
      <div
        className={`flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 font-medium text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400 ${
          compact ? "px-2.5 py-1.5 text-xs" : "px-3 py-2 text-sm"
        }`}
      >
        <XCircle size={compact ? 14 : 16} className="shrink-0" />
        Réservation annulée
      </div>
    );
  }

  const done = completedCount(statut);

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        {STEPS.map((step, i) => (
          <span
            key={step.key}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i < done ? "bg-blue-900 dark:bg-blue-500" : "bg-slate-200 dark:bg-slate-700"
            }`}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-start">
      {STEPS.map((step, i) => {
        const isDone = i < done;
        const isCurrent = i === done - 1;
        const Icon = step.icon;
        return (
          <Fragment key={step.key}>
            <div className="flex flex-col items-center">
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                  isDone
                    ? "border-blue-900 bg-blue-900 text-white dark:border-blue-500 dark:bg-blue-500"
                    : "border-slate-300 bg-slate-50 text-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-600"
                } ${isCurrent ? "ring-4 ring-amber-500/30" : ""}`}
              >
                <Icon size={16} />
              </span>
              <span
                className={`mt-2 max-w-[4.5rem] text-center text-xs font-medium leading-tight ${
                  isDone ? "text-slate-800 dark:text-slate-200" : "text-slate-400 dark:text-slate-600"
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <span
                className={`mt-[17px] h-0.5 flex-1 transition-colors ${
                  i < done - 1 ? "bg-blue-900 dark:bg-blue-500" : "bg-slate-200 dark:bg-slate-700"
                }`}
              />
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
