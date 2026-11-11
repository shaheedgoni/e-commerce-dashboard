import { X } from "lucide-react";

type modalProps = {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Modal({
  title,
  subtitle,
  onClose,
  children,
}: modalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-xl w-full max-w-md shadow-lg">
        <div className="flex items-start justify-between p-5">
          <div>
            <h2 className="font-semibold text-ink">{title}</h2>
            {subtitle ? (
              <p className="text-sm text-ink-secondary mt-0.5">{subtitle}</p>
            ) : null}
          </div>
          <button
            onClick={onClose}
            className="text-ink-muted hover:text-ink cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
        <div className="px-5 pb-5">{children}</div>
      </div>
    </div>
  );
}
