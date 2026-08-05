const fieldClasses =
  "block w-full rounded-md border border-stone-300 px-3 py-2 text-sm shadow-sm focus:border-violet-700 focus:outline-none focus:ring-1 focus:ring-violet-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder:text-slate-500";

export function Input({ className = "", ...props }) {
  return <input className={`${fieldClasses} ${className}`} {...props} />;
}

export function Select({ className = "", ...props }) {
  return <select className={`${fieldClasses} bg-white dark:bg-slate-800 ${className}`} {...props} />;
}

export function Textarea({ className = "", ...props }) {
  return <textarea className={`${fieldClasses} ${className}`} {...props} />;
}

export default function Field({ label, error, className = "", children }) {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
      )}
      {children}
      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
