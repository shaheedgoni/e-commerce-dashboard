type cardProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Card({ children, className = "" }: cardProps) {
  return (
    <div className={`bg-surface border border-line rounded-xl ${className}`}>
      {children}
    </div>
  );
}
