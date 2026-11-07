import { Search } from "lucide-react";

type searchInputProps = {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function SearchInput({
  placeholder,
  value,
  onChange,
}: searchInputProps) {
  return (
    <label className="flex items-center gap-2 h-10 px-3 w-full rounded-lg border border-line bg-surface focus-within:ring-2 focus-within:ring-accent/30">
      <Search size={16} className="text-ink-muted" />
      <input
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="flex-1 text-sm outline-none bg-transparent"
      />
    </label>
  );
}
