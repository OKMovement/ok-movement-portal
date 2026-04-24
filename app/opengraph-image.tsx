import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "OK Movement - Obi/Kwankwaso 2027";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

const title = "OK Movement";
const kicker = "OBI/KWANKWASO 2027";
const description =
  "Uniting Nigerians for accountable leadership, integrity, competence, and a new dawn.";

export default async function Image() {
  const logoData = await readFile(
    join(process.cwd(), "public/images/logo.png"),
    "base64"
  );
  const logoSrc = `data:image/png;base64,${logoData}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f7f8f4",
          color: "#111111",
          fontFamily: "Arial, Helvetica, sans-serif",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, #009b4f 0%, #009b4f 28%, #ffffff 28%, #ffffff 68%, #e51b2a 68%, #e51b2a 100%)",
            opacity: 0.16,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 780,
            height: 780,
            borderRadius: 390,
            background: "#ffffff",
            left: -230,
            top: -70,
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: 1050,
            height: 470,
            position: "relative",
          }}
        >
          <div
            style={{
              width: 420,
              height: 420,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 210,
              background: "#ffffff",
              boxShadow: "0 30px 80px rgba(0, 0, 0, 0.18)",
            }}
          >
            <img
              src={logoSrc}
              alt=""
              width={360}
              height={360}
              style={{ objectFit: "contain" }}
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              marginLeft: 72,
              width: 540,
            }}
          >
            <div
              style={{
                color: "#e51b2a",
                fontSize: 30,
                fontWeight: 900,
                letterSpacing: 0,
                textTransform: "uppercase",
              }}
            >
              {kicker}
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 98,
                lineHeight: 0.94,
                fontWeight: 900,
                marginTop: 26,
              }}
            >
              {title}
            </div>
            <div
              style={{
                display: "flex",
                color: "#009b4f",
                fontSize: 34,
                lineHeight: 1.24,
                fontWeight: 700,
                marginTop: 30,
              }}
            >
              {description}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
