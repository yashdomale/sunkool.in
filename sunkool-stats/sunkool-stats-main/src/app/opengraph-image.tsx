import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const runtime = "nodejs";
export const alt = "SUNKOOL — Engineered to Defeat Heat";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logo = await readFile(join(process.cwd(), "public/sunkool-wordmark.png"));
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(120% 90% at 18% 8%, rgba(246,177,26,0.20), transparent 58%), radial-gradient(120% 90% at 88% 18%, rgba(88,167,232,0.22), transparent 58%), linear-gradient(180deg, #0b0d0f 0%, #000000 60%)",
        }}
      >
        <img src={logoSrc} width={440} height={149} alt="SUNKOOL" />
        <div
          style={{
            marginTop: 40,
            fontSize: 46,
            fontWeight: 700,
            letterSpacing: -1,
            color: "rgba(255,255,255,0.92)",
          }}
        >
          Engineered to Defeat Heat
        </div>
      </div>
    ),
    size
  );
}
