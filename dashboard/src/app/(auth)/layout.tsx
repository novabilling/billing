import { BrandLockup, BrandMark } from "@/components/brand-mark";
import { brand } from "@/lib/brand";

/** Sign-in, sign-up, password reset and invitations: the brand on one side, the form on the other. */
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-[#0E6E6B] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <BrandLockup accent="text-[#9BE3DB]" className="text-xl text-white" />
        <div className="max-w-md">
          <p className="font-display text-4xl font-semibold leading-tight tracking-tight">Measure it. Bill it. Settle it.</p>
          <p className="mt-4 text-lg text-white/80">{brand.tagline}.</p>
          <dl className="mt-10 grid gap-3 rounded-2xl bg-white/10 p-6 font-mono text-sm tabular-nums">
            <div className="flex justify-between gap-4">
              <dt className="text-white/70">Collected</dt>
              <dd>UGX 1,250,000</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-white/70">Paid out</dt>
              <dd>UGX −840,000</dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-white/20 pt-3 font-medium">
              <dt>Balance</dt>
              <dd>UGX 410,000</dd>
            </div>
          </dl>
        </div>
        <p className="text-sm text-white/60">Open source · AGPL-3.0</p>
        <BrandMark className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 text-white/5" />
      </aside>
      <main className="flex flex-col items-center justify-center px-4 py-12 sm:px-8">
        <BrandLockup className="mb-10 lg:hidden" />
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
