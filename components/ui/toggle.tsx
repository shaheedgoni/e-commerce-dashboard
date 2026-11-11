type toggleProps = {
  label?: string;
  checked?: boolean;
  onChange: (checked: boolean) => void;
};

export default function Toggle({ label, checked, onChange }: toggleProps) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2 cursor-pointer"
    >
      <span
        className={`w-9 h-5 rounded-full p-0.5 flex transition-colors ${checked ? "bg-accent justify-end" : "bg-stone-300 justify-start"}`}
      >
        <span className="size-4 rounded-full bg-white shadow-white shadow-sm" />
      </span>

      <span className="text-sm text-ink">{label}</span>
    </button>
  );
}
