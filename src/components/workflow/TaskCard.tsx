type TaskCardProps = {
  title: string;
  category: string;
  description: string;
  budget: number;
  status: string;
  action?: { label: string; onClick: () => void };
};

export default function TaskCard({ title, category, description, budget, status, action }: TaskCardProps) {
  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12, background: "#fff" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
        <div>
          <h4 style={{ fontSize: 15, fontWeight: 800 }}>{title}</h4>
          <p style={{ fontSize: 12, color: "#555", marginTop: 4 }}>{description}</p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: 800 }}>INR {budget}</div>
          <div style={{ fontSize: 11, color: "#666", textTransform: "uppercase" }}>{status}</div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#1d4ed8" }}>{category}</span>
        {action && (
          <button onClick={action.onClick} style={{ border: "none", borderRadius: 8, background: "#111827", color: "#fff", cursor: "pointer", fontSize: 12, padding: "6px 10px" }}>
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
}
