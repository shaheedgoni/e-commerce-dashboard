type dateInputProps = {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function DateInput({ label, value, onChange }: dateInputProps) {
  return (
    <label className="flex flex-col gap-1.5 w-full">
      <span className="text-xs text-ink-secondary">{label}</span>
      <input
        type="date"
        value={value}
        onChange={onChange}
        className="h-10 px-3 rounded-lg border border-line bg-surface text-sm"
      />
    </label>
  );
}
