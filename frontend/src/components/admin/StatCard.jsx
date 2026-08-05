const ACCENT_CLASSES = {
  violet: "bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400",
  green: "bg-green-50 text-green-600 dark:bg-green-500/10 dark:text-green-400",
  amber: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
  slate: "bg-slate-100 text-slate-600 dark:bg-slate-500/10 dark:text-slate-300",
};

export default function StatCard({ icon: Icon, label, value, accent = "violet", hint }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</span>
        <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${ACCENT_CLASSES[accent]}`}>
          <Icon size={18} strokeWidth={2} />
        </span>
      </div>
      <p className="text-2xl font-semibold text-slate-900 dark:text-white">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{hint}</p>}
    </div>
  );
}
