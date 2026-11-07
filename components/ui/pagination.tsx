type paginationProps = {
  page: number;
  limit: number;
  total: number;
  onPageChange: (newPage: number) => void;
};

export default function Pagination({
  page,
  limit,
  total,
  onPageChange,
}: paginationProps) {
  const totalPages = Math.ceil(total / limit);

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  const items: (number | string)[] = [];
  for (let i = 1; i <= totalPages; i++) {
    const isFirstOrLast = i === 1 || i === totalPages;
    const isNearCurrent = Math.abs(i - page) <= 2;

    if (isFirstOrLast || isNearCurrent) {
      items.push(i);
    } else if (items[items.length - 1] !== "…") {
      items.push("…");
    }
  }

  const arrowClasses =
    "h-8 px-3 rounded-lg border border-line bg-surface text-sm text-ink cursor-pointer hover:bg-stone-100 disabled:text-ink-muted disabled:hover:bg-surface disabled:cursor-not-allowed";

  return (
    <div className="flex items-center justify-between px-5 py-3 border-t border-line">
      <p className="text-sm text-ink-secondary tabular-nums">
        Showing {from}-{to} of {total}
      </p>

      <div className="flex items-center gap-1">
        <button
          type="button"
          className={arrowClasses}
          disabled={page === 1}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </button>

        {items.map((item, index) =>
          item === "…" ? (
            <span key={index} className="px-1 text-sm text-ink-muted">
              …
            </span>
          ) : (
            <button
              key={index}
              type="button"
              onClick={() => onPageChange(Number(item))}
              className={`size-8 rounded-lg text-sm tabular-nums cursor-pointer ${
                item === page
                  ? "bg-ink text-white"
                  : "text-ink hover:bg-stone-100"
              }`}
            >
              {item}
            </button>
          ),
        )}

        <button
          type="button"
          className={arrowClasses}
          disabled={page === totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
