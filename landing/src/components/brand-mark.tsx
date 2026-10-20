/**
 * The PimaBill mark: two readings, the second higher than the first. Drawn
 * in currentColor so it follows the surrounding text colour.
 */
export default function BrandMark({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden className={className}>
      <rect x="24" y="62" width="30" height="30" rx="6" fill="currentColor" fillOpacity={0.55} />
      <rect x="66" y="28" width="30" height="30" rx="6" fill="currentColor" />
    </svg>
  );
}
