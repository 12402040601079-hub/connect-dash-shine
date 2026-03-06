type NearbyTask = {
  id: string;
  title: string;
  category: string;
  distanceKm: number | null;
  hasBid: boolean;
  lat?: number;
  lng?: number;
};

type Radius = 0 | 2 | 5 | 10;

type HelperRequestsMapProps = {
  t: any;
  tasks: NearbyTask[];
  radius: Radius;
  onRadiusChange: (radius: Radius) => void;
  helperHasLocation: boolean;
};

function pinColor(distanceKm: number | null): string {
  if (distanceKm == null) return "#94a3b8";
  if (distanceKm <= 2) return "#10b981";
  if (distanceKm <= 5) return "#3b82f6";
  if (distanceKm <= 10) return "#f59e0b";
  return "#ef4444";
}

function taskBucket(distanceKm: number | null): "2" | "5" | "10" | "far" | "unknown" {
  if (distanceKm == null) return "unknown";
  if (distanceKm <= 2) return "2";
  if (distanceKm <= 5) return "5";
  if (distanceKm <= 10) return "10";
  return "far";
}

function hashToUnit(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i += 1) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return (h % 1000) / 1000;
}

function pinPosition(task: NearbyTask, index: number) {
  const baseAngle = hashToUnit(task.id) * Math.PI * 2;
  const angle = baseAngle + index * 0.23;
  const radial = task.distanceKm == null ? 0.82 : Math.min(0.9, Math.max(0.15, task.distanceKm / 10));
  const x = 50 + Math.cos(angle) * radial * 43;
  const y = 50 + Math.sin(angle) * radial * 38;
  return { x, y };
}

export default function HelperRequestsMap({
  t,
  tasks,
  radius,
  onRadiusChange,
  helperHasLocation,
}: HelperRequestsMapProps) {
  const count2 = tasks.filter((task) => taskBucket(task.distanceKm) === "2").length;
  const count5 = tasks.filter((task) => {
    const b = taskBucket(task.distanceKm);
    return b === "2" || b === "5";
  }).length;
  const count10 = tasks.filter((task) => {
    const b = taskBucket(task.distanceKm);
    return b === "2" || b === "5" || b === "10";
  }).length;

  return (
    <div
      style={{
        borderRadius: 14,
        border: `1px solid ${t.border}`,
        background: t.mode === "dark" ? "rgba(13,10,31,0.72)" : "rgba(255,255,255,0.9)",
        overflow: "hidden",
      }}
    >
      <div style={{ padding: "12px 14px", borderBottom: `1px solid ${t.border}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <div>
            <div style={{ color: t.text, fontSize: 14, fontWeight: 800 }}>Nearby Work Map</div>
            <div style={{ color: t.muted, fontSize: 11, marginTop: 2 }}>
              What work is near me right now?
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {([
              { id: 0, label: `All (${tasks.length})` },
              { id: 2, label: `2km (${count2})` },
              { id: 5, label: `5km (${count5})` },
              { id: 10, label: `10km (${count10})` },
            ] as Array<{ id: Radius; label: string }>).map((chip) => (
              <button
                key={chip.id}
                type="button"
                className="press"
                onClick={() => onRadiusChange(chip.id)}
                style={{
                  padding: "6px 10px",
                  borderRadius: 999,
                  border: `1px solid ${radius === chip.id ? t.primary + "66" : t.border}`,
                  background: radius === chip.id ? `${t.primary}18` : t.secondary,
                  color: radius === chip.id ? t.primary : t.muted,
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        style={{
          position: "relative",
          height: 220,
          background:
            t.mode === "dark"
              ? "radial-gradient(circle at 50% 55%, rgba(32,38,67,0.9), rgba(9,10,24,1))"
              : "radial-gradient(circle at 50% 55%, rgba(214,236,255,0.9), rgba(248,252,255,1))",
          borderBottom: `1px solid ${t.border}`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 18,
            height: 18,
            transform: "translate(-50%,-50%)",
            borderRadius: "50%",
            background: "#111827",
            border: "2px solid #fff",
            boxShadow: "0 0 0 8px rgba(255,255,255,0.18)",
          }}
          title="You"
        />

        {[30, 56, 82].map((r, idx) => (
          <div
            key={r}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: r * 2,
              height: r * 2,
              transform: "translate(-50%,-50%)",
              borderRadius: "50%",
              border: `1px dashed ${t.mode === "dark" ? "rgba(255,255,255,0.22)" : "rgba(15,23,42,0.22)"}`,
            }}
            title={idx === 0 ? "2km" : idx === 1 ? "5km" : "10km"}
          />
        ))}

        {tasks.slice(0, 35).map((task, i) => {
          const pos = pinPosition(task, i);
          const color = pinColor(task.distanceKm);
          return (
            <div
              key={task.id}
              title={`${task.title} (${task.distanceKm == null ? "distance unknown" : `${task.distanceKm.toFixed(1)} km`})`}
              style={{
                position: "absolute",
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: "translate(-50%, -50%)",
                width: 14,
                height: 14,
                borderRadius: "50%",
                background: color,
                border: "2px solid #fff",
                boxShadow: task.hasBid ? "0 0 0 4px rgba(59,130,246,0.25)" : "none",
              }}
            />
          );
        })}
      </div>

      <div style={{ padding: "10px 14px", display: "grid", gap: 6 }}>
        {!helperHasLocation && (
          <div style={{ fontSize: 11, color: t.warn, fontWeight: 700 }}>
            Add your profile location to get accurate nearby distances.
          </div>
        )}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", fontSize: 11, color: t.muted }}>
          <span>Green: under 2km</span>
          <span>Blue: 2-5km</span>
          <span>Amber: 5-10km</span>
          <span>Red: above 10km</span>
        </div>
      </div>
    </div>
  );
}
