import { CheckCircle2, XCircle, X } from "lucide-react";

const STYLES = {
  success: {
    icon: CheckCircle2,
    classes: "border-green-200 bg-white text-green-800 dark:border-green-500/30 dark:bg-slate-900 dark:text-green-400",
    iconClasses: "text-green-600 dark:text-green-400",
  },
  error: {
    icon: XCircle,
    classes: "border-red-200 bg-white text-red-800 dark:border-red-500/30 dark:bg-slate-900 dark:text-red-400",
    iconClasses: "text-red-600 dark:text-red-400",
  },
};

export default function Toast({ type = "success", message, onClose }) {
  const { icon: Icon, classes, iconClasses } = STYLES[type] ?? STYLES.success;

  return (
    <div
      role="status"
      className={`animate-toast-in flex w-80 max-w-[90vw] items-start gap-3 rounded-lg border px-4 py-3 shadow-lg ${classes}`}
    >
      <Icon size={20} className={`mt-0.5 shrink-0 ${iconClasses}`} />
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        type="button"
        onClick={onClose}
        className="shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        aria-label="Fermer"
      >
        <X size={16} />
      </button>
    </div>
  );
}
