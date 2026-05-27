import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: "#FFDB2A",
          color: "#0d0d0d",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
          fontWeight: 900,
          fontFamily: "sans-serif",
          border: "2px solid #0d0d0d",
          borderRadius: 16,
        }}
      >
        ⚽
      </div>
    ),
    { ...size },
  );
}
