type selectProps = {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
};

export default function Select({
  label,
  value,
  onChange,
  children,
}: selectProps) {
  return (
    <label className="flex flex-col gap-1.5 w-full">
      <span className="text-xs text-ink-secondary">{label}</span>

      <select
        value={value}
        onChange={onChange}
        className="h-10 px-3 rounded-lg border border-line bg-surface text-sm"
      >
        {children}
      </select>
    </label>
  );
}
