import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name}: ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Social preview card, generated at build time from the brand settings. */
export default function OpenGraphImage() {
  const name = site.name.toLowerCase();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#f1f4f3",
          color: "#10141b",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="64" height="64" viewBox="0 0 120 120">
            <rect x="24" y="62" width="30" height="30" rx="6" fill="#0e6e6b" fillOpacity={0.55} />
            <rect x="66" y="28" width="30" height="30" rx="6" fill="#0e6e6b" />
          </svg>
          <div style={{ display: "flex", fontSize: 44, fontWeight: 700, letterSpacing: -1 }}>
            <span>{name.slice(0, site.nameSplit)}</span>
            <span style={{ color: "#0e6e6b" }}>{name.slice(site.nameSplit)}</span>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ fontSize: 68, fontWeight: 700, lineHeight: 1.08, letterSpacing: -2, maxWidth: 1000 }}>{site.tagline}</div>
          <div style={{ fontSize: 28, color: "#4b5563" }}>Subscriptions · Usage · Mobile money · Payouts · Crypto · Ledger</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 24, color: "#4b5563" }}>
          <span>{`Open source · ${site.license}`}</span>
          <span style={{ color: "#a8481f" }}>Measure it. Bill it. Settle it.</span>
        </div>
      </div>
    ),
    size,
  );
}
