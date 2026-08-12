export default function Card({ className = "", children, ...props }) {
  return (
    <div
      className={`rounded-lg border border-slate-200 bg-slate-50 shadow-sm dark:border-slate-800 dark:bg-slate-900 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
