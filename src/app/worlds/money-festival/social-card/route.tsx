import { ImageResponse } from "next/og";
import { MONEY_WORLD_SOCIAL_CARD } from "@/lib/learning/world/moneyWorldSocial";

export const dynamic = "force-static";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(135deg, #dff2c7 0%, #fff4b9 52%, #d8eff4 100%)",
          color: "#17384e",
          fontFamily: "Arial, Helvetica, sans-serif",
          padding: "64px 72px"
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 340,
            height: 340,
            borderRadius: 999,
            background: "rgba(255,255,255,.45)",
            right: -60,
            top: -90
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 220,
            height: 220,
            borderRadius: 999,
            background: "rgba(74,145,110,.16)",
            left: -65,
            bottom: -55
          }}
        />

        <div style={{ width: "68%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                alignSelf: "flex-start",
                padding: "12px 20px",
                borderRadius: 999,
                background: "rgba(255,255,255,.82)",
                border: "2px solid rgba(255,255,255,.9)",
                fontSize: 24,
                fontWeight: 800,
                letterSpacing: 1
              }}
            >
              {MONEY_WORLD_SOCIAL_CARD.kicker}
            </div>

            <div style={{ display: "flex", marginTop: 34, fontSize: 76, lineHeight: 1.02, fontWeight: 900, letterSpacing: -3 }}>
              {MONEY_WORLD_SOCIAL_CARD.title}
            </div>

            <div style={{ display: "flex", marginTop: 24, maxWidth: 720, fontSize: 29, lineHeight: 1.32, fontWeight: 650, color: "#315c5c" }}>
              {MONEY_WORLD_SOCIAL_CARD.description}
            </div>
          </div>

          <div style={{ display: "flex", gap: 14, alignItems: "center", fontSize: 22, fontWeight: 800 }}>
            <div style={{ display: "flex", padding: "10px 16px", borderRadius: 16, background: "#fffdf3" }}>8 Stage</div>
            <div style={{ display: "flex", padding: "10px 16px", borderRadius: 16, background: "#fffdf3" }}>Cerita</div>
            <div style={{ display: "flex", padding: "10px 16px", borderRadius: 16, background: "#fffdf3" }}>Mini-game</div>
          </div>
        </div>

        <div
          style={{
            width: "32%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 18
          }}
        >
          <div
            style={{
              width: 250,
              height: 250,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 70,
              background: "#fffdf3",
              border: "8px solid rgba(255,255,255,.82)",
              boxShadow: "0 18px 38px rgba(42,72,57,.16)"
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <div style={{ display: "flex", fontSize: 44, fontWeight: 900, color: "#d67b32" }}>GAVI</div>
              <div style={{ display: "flex", width: 150, height: 18, borderRadius: 999, background: "#efb84d" }} />
              <div style={{ display: "flex", fontSize: 30, fontWeight: 900, color: "#3c7f86" }}>+ PACA</div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              width: 210,
              justifyContent: "space-between",
              padding: "14px 22px",
              borderRadius: 999,
              background: "#287158",
              color: "white",
              fontSize: 22,
              fontWeight: 900
            }}
          >
            <span>Festival</span>
            <span>Siap!</span>
          </div>
        </div>
      </div>
    ),
    {
      width: MONEY_WORLD_SOCIAL_CARD.width,
      height: MONEY_WORLD_SOCIAL_CARD.height
    }
  );
}
