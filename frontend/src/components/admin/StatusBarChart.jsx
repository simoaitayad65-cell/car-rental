const STATUS_COLORS = {
  good: "#0ca30c",
  warning: "#fab219",
  critical: "#d03b3b",
};

export default function StatusBarChart({ title, bars }) {
  const max = Math.max(...bars.map((b) => b.value), 1);

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h3 className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-200">{title}</h3>

      <div className="space-y-4">
        {bars.map((bar) => (
          <div key={bar.label}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: STATUS_COLORS[bar.status] }}
                />
                {bar.label}
              </span>
              <span className="font-semibold text-slate-900 dark:text-white">{bar.value}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${(bar.value / max) * 100}%`,
                  backgroundColor: STATUS_COLORS[bar.status],
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
