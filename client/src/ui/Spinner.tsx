export default function Spinner({ className = "" }: { className?: string }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`border-brand-200 border-t-brand-600 mx-auto my-12 size-16 animate-spin rounded-full border-4 ${className}`}
    />
  );
}
