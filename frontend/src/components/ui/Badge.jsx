const colors = {
  gray: "bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300",
  green: "bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-400",
  amber: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-400",
  red: "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-400",
  violet: "bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-400",
  indigo: "bg-indigo-100 text-indigo-800 dark:bg-indigo-500/15 dark:text-indigo-400",
};

export default function Badge({ color = "gray", children }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[color]}`}>
      {children}
    </span>
  );
}
