export default function Logo({ size }: { size: number }) {
  return (
    <div
      style={{ width: `${size}px`, height: `${size}px` }}
      className="bg-ink rounded-lg text-surface cursor-default flex items-center justify-center"
    >
      S
    </div>
  );
}
