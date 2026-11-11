import React from "react";

type tableProps = {
  children?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
};

export function Table({ children, footer }: tableProps) {
  return (
    <div className="bg-surface border border-line rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">{children}</table>
      </div>
      {footer}
    </div>
  );
}

export function Th({ children, className = "" }: tableProps) {
  return (
    <th
      className={`text-left text-xs font-medium bg-canvas text-ink-muted px-5 py-3 whitespace-nowrap ${className}`}
    >
      {children}
    </th>
  );
}

export function Tr({ children }: tableProps) {
  return <tr className="border-t border-line hover:bg-stone-50">{children}</tr>;
}

export function Td({ children, className = "" }: tableProps) {
  return (
    <td className={`px-5 py-4 text-ink whitespace-nowrap ${className}`}>
      {children}
    </td>
  );
}
