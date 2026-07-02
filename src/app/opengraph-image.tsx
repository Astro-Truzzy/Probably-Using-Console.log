import { ImageResponse } from "next/og";
import { siteDescription, siteName } from "../../Lib/config";

export const alt = siteName;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#020617",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 48,
        }}
      >
        <div
          style={{
            fontSize: 56,
            fontFamily: "monospace",
            color: "#22d3ee",
            textAlign: "center",
          }}
        >
          probably using console.log()
        </div>
        <div
          style={{
            fontSize: 28,
            marginTop: 24,
            color: "#94a3b8",
            textAlign: "center",
          }}
        >
          {siteDescription}
        </div>
      </div>
    ),
    { ...size }
  );
}
