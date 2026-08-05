import { Link } from "react-router-dom";

export const buttonVariants = {
  primary:
    "bg-violet-700 text-white hover:bg-violet-900 focus-visible:outline-violet-700",
  secondary:
    "bg-white text-stone-700 border border-stone-300 hover:bg-stone-50 focus-visible:outline-stone-400 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700",
  accent:
    "bg-amber-500 text-slate-900 hover:bg-amber-600 focus-visible:outline-amber-500",
  danger:
    "bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600",
  ghost: "text-slate-600 hover:bg-slate-100 focus-visible:outline-slate-400 dark:text-slate-300 dark:hover:bg-slate-800",
};

const base =
  "inline-flex items-center justify-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 cursor-pointer";

export default function Button({ variant = "primary", className = "", ...props }) {
  return <button className={`${base} ${buttonVariants[variant]} ${className}`} {...props} />;
}

export function LinkButton({ variant = "primary", className = "", ...props }) {
  return <Link className={`${base} ${buttonVariants[variant]} ${className}`} {...props} />;
}
