import { buildMapEmbedUrl, hasMapsApiKey } from "@/lib/maps";

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
  helpers: RecommendedHelper[];
  loading: boolean;
  onUseCurrentLocation: () => void;
  geoBusy?: boolean;
};

function badgeText(helper: RecommendedHelper): string {
  const pct = `${Math.round(helper.score * 100)}% match`;
  if (helper.distanceKm == null || !Number.isFinite(helper.distanceKm)) return pct;
  return `${helper.distanceKm.toFixed(1)} km · ${pct}`;
}

export default function HelperMapCard({
  t,
  locationLabel,
  taskCoords,
  helpers,
  loading,
  onUseCurrentLocation,
  geoBusy,
}: HelperMapCardProps) {
  const hasCoords = Boolean(taskCoords);
  const embedUrl = taskCoords ? buildMapEmbedUrl(taskCoords) : "";

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
            <div style={{ fontSize: 13, fontWeight: 800, color: t.text }}>Nearest Helpers Map</div>
            <div style={{ fontSize: 11, color: t.muted, marginTop: 2 }}>{locationLabel || "Enter a location"}</div>
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

      <div
        style={{
          height: 210,
          background: t.mode === "dark" ? "#10102a" : "#eaf4ff",
          position: "relative",
          borderBottom: `1px solid ${t.border}`,
        }}
      >
        {hasCoords ? (
          <iframe
            title="Task area map"
            src={embedUrl}
            style={{ width: "100%", height: "100%", border: "none" }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "grid",
              placeItems: "center",
              background:
                t.mode === "dark"
                  ? "radial-gradient(circle at 30% 20%, rgba(139,92,246,.35), rgba(13,14,35,.95))"
                  : "radial-gradient(circle at 30% 20%, rgba(59,130,246,.28), rgba(255,255,255,.92))",
            }}
          >
            <div style={{ textAlign: "center", padding: 16 }}>
              <div style={{ color: t.text, fontSize: 14, fontWeight: 700 }}>Map preview is ready</div>
              <div style={{ color: t.muted, marginTop: 6, fontSize: 12 }}>
                Enter location and use current GPS for better nearest-helper accuracy.
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: "12px 14px", display: "grid", gap: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: t.sub }}>Suggested Helpers</div>
          {!hasMapsApiKey && (
            <span style={{ fontSize: 10, color: t.muted }}>
              Optional API key missing - using fallback map view.
            </span>
          )}
        </div>
        {loading ? (
          <div style={{ fontSize: 12, color: t.muted }}>Finding nearby helpers...</div>
        ) : helpers.length === 0 ? (
          <div style={{ fontSize: 12, color: t.muted }}>No helper profiles found yet.</div>
        ) : (
          helpers.slice(0, 3).map((helper) => (
            <div
              key={helper.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 8,
                padding: "8px 10px",
                borderRadius: 10,
                border: `1px solid ${t.border}`,
                background: t.secondary,
              }}
            >
              <span style={{ fontSize: 12, color: t.text, fontWeight: 700 }}>{helper.name}</span>
              <span style={{ fontSize: 11, color: t.muted }}>{badgeText(helper)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
