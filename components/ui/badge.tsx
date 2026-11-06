export type badgeVariant =
  | "neutral"
  | "success"
  | "warning"
  | "danger"
  | "info"
  | "purple"
  | "accent"
  | "outline";

type badgeProps = {
  variant?: badgeVariant;
  className?: string;
  children: React.ReactNode;
};

const variantClasses: Record<badgeVariant, string> = {
  neutral: "bg-stone-100 text-ink-secondary",
  success: "bg-green-50 text-green-700",
  warning: "bg-amber-50 text-warning",
  danger: "bg-red-50 text-danger",
  info: "bg-blue-50 text-blue-700",
  purple: "bg-indigo-50 text-indigo-700",
  accent: "bg-accent-soft text-accent",
  outline: "bg-surface border border-line text-ink",
};

const baseClasses: string =
  "inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-md whitespace-nowrap";

export default function Badge({
  variant = "neutral",
  className = "",
  children,
}: badgeProps) {
  return (
    <span className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
}
