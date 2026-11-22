import { CircleAlert, Inbox, Lock } from "lucide-react";
import Button from "./button";

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-stone-100 rounded-md animate-pulse ${className}`} />
  );
}

type emptyStateProps = {
  title: string;
  message: string;
};

export function EmptyState({ title, message }: emptyStateProps) {
  return (
    <div className="flex flex-col items-center text-center py-16 px-6">
      <Inbox size={32} className="text-ink-muted mb-3" />
      <p className="font-medium text-ink">{title}</p>
      <p className="text-sm text-ink-secondary mt-1">{message}</p>
    </div>
  );
}

type errorStateProps = {
  message: string;
  requestId?: string;
  onReentry: () => void;
};

export function ErrorState({ message, requestId, onReentry }: errorStateProps) {
  return (
    <div className="flex flex-col items-center text-center py-16 px-6">
      <CircleAlert className="text-danger mb-3" />
      <p className="font-medium text-ink">Something went wrong</p>
      <p className="text-sm text-ink-secondary mt-1">{message}</p>
      {requestId ? (
        <p className="text-xs text-ink-muted font-mono mt-2">
          Ref: {requestId}
        </p>
      ) : null}
      <Button variant="secondary" className="mt-4" onClick={onReentry}>
        Retry
      </Button>
    </div>
  );
}

type noAccessState = {
  onBack: () => void;
};

export function NoAccessState({ onBack }: noAccessState) {
  return (
    <div className="flex flex-col items-center text-center py-24 px-6">
      <span className="size-14 rounded-full bg-stone-100 flex items-center justify-center mb-4">
        <Lock size={22} className="text-ink-secondary" />
      </span>
      <p className="text-lg font-medium text-ink">
        You don&apos;t have access to this page
      </p>
      <Button className="mt-5" onClick={onBack}>
        Back to Orders
      </Button>
    </div>
  );
}
