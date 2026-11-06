import { Loader2 } from "lucide-react";

type buttonVariant = "primary" | "secondary" | "ghost" | "danger";

type buttonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: buttonVariant;
  loading?: boolean;
};

const variantClasses: Record<buttonVariant, string> = {
  primary: "bg-accent text-white hover:bg-accent-hover",
  secondary: "bg-surface border border-line text-ink hover:bg-stone-100",
  ghost: "bg-transparent text-ink hover:bg-stone-100",
  danger: "bg-danger text-white hover:bg-red-800",
};

const baseClasses: string =
  "cursor-pointer inline-flex items-center justify-center gap-2 h-10 px-4 rounded-lg text-sm font-medium transition-colors disabled:bg-stone-200 disabled:text-ink-muted disabled:border-transparent disabled:cursor-not-allowed";

export default function Button({
  variant = "primary",
  className = "",
  loading = false,
  disabled,
  children,
  ...rest
}: buttonProps) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...rest}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
}
