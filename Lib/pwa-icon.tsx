import { ImageResponse } from "next/og";

export function pwaIconImage(size: number) {
  const fontSize = Math.round(size * 0.28);

  return new ImageResponse(
    (
      <div
        style={{
          fontSize,
          background: "#020617",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#22d3ee",
          fontFamily: "monospace",
        }}
      >
        {">_"}
      </div>
    ),
    { width: size, height: size }
  );
}
