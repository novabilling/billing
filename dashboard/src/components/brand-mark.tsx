import { cn } from "@/lib/utils/cn";

/**
 * The PimaBill mark: two readings, the second higher than the first. Drawn
 * in currentColor so it follows the surrounding text colour.
 */
export function BrandMark({ className, animated = false }: { className?: string; animated?: boolean }) {
  return (
    <svg viewBox="0 0 120 120" aria-hidden className={cn("h-6 w-6", animated && "brand-mark-animated", className)}>
      <rect className="brand-mark-low" x="24" y="62" width="30" height="30" rx="6" fill="currentColor" fillOpacity={0.55} />
      <rect className="brand-mark-high" x="66" y="28" width="30" height="30" rx="6" fill="currentColor" />
    </svg>
  );
}

/** Full-area loading state: the mark climbing, with an accessible label. */
export function BrandLoader({ label = "Loading", className }: { label?: string; className?: string }) {
  return (
    <div role="status" aria-live="polite" className={cn("flex items-center justify-center p-8 text-primary", className)}>
      <BrandMark animated className="h-12 w-12" />
      <span className="sr-only">{label}</span>
    </div>
  );
}
