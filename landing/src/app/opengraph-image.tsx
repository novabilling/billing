import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name}: ${site.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Social preview card, generated at build time from the brand settings. */
export default function OpenGraphImage() {
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
          background: "#0b0f19",
          color: "#f5f7fb",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: -1 }}>{site.name}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 64, fontWeight: 800, lineHeight: 1.1, letterSpacing: -2, maxWidth: 980 }}>{site.tagline}</div>
          <div style={{ fontSize: 28, color: "#9aa4b8" }}>Subscriptions · Usage billing · Mobile money · Payouts · Crypto</div>
        </div>
        <div style={{ fontSize: 24, color: "#9aa4b8" }}>{`Open source · ${site.license}`}</div>
      </div>
    ),
    size,
  );
}
