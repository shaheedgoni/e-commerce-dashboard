type inputProps = {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
};

export default function Input({
  label,
  type = "text",
  placeholder = "",
  value,
  onChange,
  error = "",
}: inputProps) {
  const borderColor = error
    ? "border-danger focus:border-danger focus:ring-2 focus:ring-danger/20"
    : "border-line focus:border-accent focus:ring-2 focus:ring-accent/20";

  return (
    <label className="flex flex-col">
      <span className="text-sm font-medium text-ink mb-1">{label}</span>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`h-10 px-3 rounded-lg border bg-surface text-sm text-ink placeholder:text-ink-muted outline-none ${borderColor}`}
      />
      {error ? <p className="text-xs mt-1 text-danger">{error}*</p> : null}
    </label>
  );
}
