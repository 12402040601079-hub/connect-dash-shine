import { buildMapEmbedUrl } from "@/lib/maps";

type Coord = { lat: number; lng: number };

type RecommendedHelper = {
  id: string;
  name: string;
  distanceKm: number | null;
  score: number;
};

type HelperMapCardProps = {
  t: any;
  locationLabel: string;
  taskCoords: Coord | null;
  onUseCurrentLocation: () => void;
  onConfirmLocation: () => void;
  showPreview: boolean;
  recommendationCount?: number;
  geoBusy?: boolean;
};

export default function HelperMapCard({
  t,
  locationLabel,
  taskCoords,
  onUseCurrentLocation,
  onConfirmLocation,
  showPreview,
  recommendationCount = 0,
  geoBusy,
}: HelperMapCardProps) {
  const hasCoords = Boolean(taskCoords);
  const embedUrl = taskCoords ? buildMapEmbedUrl(taskCoords) : "";
  const coordsText = taskCoords ? `${taskCoords.lat}, ${taskCoords.lng}` : "Not captured yet";

  return (
    <div
      style={{
        borderRadius: 14,
        border: `1px solid ${t.border}`,
        overflow: "hidden",
        background: t.mode === "dark" ? "rgba(10, 10, 28, 0.7)" : "rgba(255,255,255,0.86)",
      }}
    >
      <div style={{ padding: "12px 14px", borderBottom: `1px solid ${t.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: t.text }}>Task Location Capture</div>
            <div style={{ fontSize: 11, color: t.muted, marginTop: 2 }}>
              {locationLabel || "Enter location text and tap Use my location"}
            </div>
          </div>
          <button
            type="button"
            className="press"
            onClick={onUseCurrentLocation}
            disabled={geoBusy}
            style={{
              padding: "6px 10px",
              borderRadius: 10,
              border: `1px solid ${t.border}`,
              background: t.secondary,
              color: t.text,
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {geoBusy ? "Locating..." : "Use my location"}
          </button>
        </div>
      </div>

      {showPreview && hasCoords ? (
        <div
          style={{
            height: 190,
            background: t.mode === "dark" ? "#10102a" : "#eaf4ff",
            position: "relative",
            borderBottom: `1px solid ${t.border}`,
            animation: "fadeIn .18s ease both",
          }}
        >
          <iframe
            title="Task location preview"
            src={embedUrl}
            style={{ width: "100%", height: "100%", border: "none", pointerEvents: "none" }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -100%)",
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "#ef4444",
              border: "2px solid #fff",
              boxShadow: "0 0 0 6px rgba(239,68,68,0.25)",
            }}
          />
          <div
            style={{
              position: "absolute",
              left: 10,
              right: 10,
              bottom: 10,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 8,
              padding: "8px 10px",
              borderRadius: 10,
              background: t.mode === "dark" ? "rgba(6,8,20,0.7)" : "rgba(255,255,255,0.75)",
              border: `1px solid ${t.border}`,
            }}
          >
            <span style={{ fontSize: 11, color: t.text, fontWeight: 700 }}>Pin captured. Confirm location.</span>
            <button
              type="button"
              className="press"
              onClick={onConfirmLocation}
              style={{
                padding: "5px 10px",
                borderRadius: 9,
                border: `1px solid ${t.accent}55`,
                background: `${t.accent}18`,
                color: t.accent,
                fontSize: 11,
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      ) : null}

      <div style={{ padding: "10px 14px", display: "grid", gap: 6 }}>
        <div style={{ fontSize: 12, color: t.sub }}>
          Coordinates: <span style={{ color: t.text, fontWeight: 700 }}>{coordsText}</span>
        </div>
        <div style={{ fontSize: 11, color: t.muted }}>
          This map is a quick coordinate capture tool. It powers distance badges, helper discovery, and radius notifications.
        </div>
        {recommendationCount > 0 && (
          <div style={{ fontSize: 11, color: t.muted }}>
            {recommendationCount} nearby helper match{recommendationCount > 1 ? "es" : ""} ready for routing.
          </div>
        )}
      </div>
    </div>
  );
}
