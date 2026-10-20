import { ImageResponse } from "next/og";
import { company } from "@/data/site";

export const dynamic = "force-static";
export const alt = `${company.name}: cloud hosting, business email, domains and IT support in ${company.location}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const plates = [0, 1, 2, 3, 4, 5, 6];
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "linear-gradient(135deg, #040d1c 0%, #0b3d91 140%)", color: "#fff", position: "relative" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 72px", width: 700 }}>
          <div style={{ display: "flex", fontSize: 26, letterSpacing: 6, color: "#75c9ff", textTransform: "uppercase" }}>{company.location}</div>
          <div style={{ display: "flex", fontSize: 92, fontWeight: 800, lineHeight: 1, marginTop: 20, letterSpacing: -3 }}>{company.name}</div>
          <div style={{ display: "flex", fontSize: 34, color: "#a2b8d4", marginTop: 28, lineHeight: 1.3 }}>
            Cloud hosting, business email, domains, IT support and custom web applications.
          </div>
        </div>
        <svg width="460" height="540" viewBox="0 20 240 282" style={{ position: "absolute", right: 30, top: 45 }}>
          {plates.map((i) => {
            const y = 196 - i * 26;
            return (
              <g key={i}>
                <path d={`M120 ${y} L214 ${y + 45} L120 ${y + 90} L26 ${y + 45} Z`} fill="#0b1c38" stroke="#75c9ff" strokeWidth="1.6" />
                <path d={`M26 ${y + 45} L120 ${y + 90} L214 ${y + 45} L214 ${y + 52} L120 ${y + 97} L26 ${y + 52} Z`} fill="#071428" stroke="#3d8fd6" strokeWidth="1" />
              </g>
            );
          })}
        </svg>
      </div>
    ),
    size,
  );
}
