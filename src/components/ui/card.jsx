export function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-xl border bg-white dark:bg-zinc-900 shadow p-4 ${className}`}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, className = "" }) {
  return <div className={`text-base ${className}`}>{children}</div>;
}
