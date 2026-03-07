import React, { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { firestore } from "@/integrations/firebase/client";
import { removeTask } from "@/services/admin";
import { AT, GLASS_CARD } from "./adminTheme";

const ADMIN_ID = "super-admin-demo";
type TaskRow = { id: string; title?: string; category?: string; status?: string; posterName?: string; posterId?: string; };

const statusColor = (s?: string) => {
  if (s === "completed") return AT.accent;
  if (s === "open") return AT.primary;
  if (s === "cancelled") return AT.danger;
  return AT.warn;
};

export default function Jobs() {
  const [rows, setRows] = useState<TaskRow[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!firestore) return;
    const unsub = onSnapshot(query(collection(firestore, "tasks"), orderBy("createdAt", "desc")), (snap) => {
      setRows(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const onRemove = async (taskId: string) => {
    setError("");
    try { await removeTask(ADMIN_ID, taskId, "Removed from admin panel"); }
    catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed to remove"); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: AT.text }}>Jobs</h2>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: AT.muted }}>{rows.length} total tasks posted</p>
      </div>
      <div style={{ ...GLASS_CARD, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${AT.border}` }}>
              {["Title", "Category", "Status", "Poster", "Actions"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, color: AT.muted, textTransform: "uppercase", letterSpacing: "0.8px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.id} style={{ borderBottom: i < rows.length - 1 ? `1px solid ${AT.border}` : "none" }}>
                <td style={{ padding: "12px 16px", color: AT.text, fontWeight: 600 }}>{row.title}</td>
                <td style={{ padding: "12px 16px", color: AT.sub }}>{row.category || "General"}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 99, background: `${statusColor(row.status)}1a`, color: statusColor(row.status), border: `1px solid ${statusColor(row.status)}35` }}>{row.status || "open"}</span>
                </td>
                <td style={{ padding: "12px 16px", color: AT.sub }}>{row.posterName || row.posterId}</td>
                <td style={{ padding: "12px 16px" }}>
                  <button onClick={() => onRemove(row.id)} style={{ padding: "5px 10px", borderRadius: 7, border: `1px solid ${AT.danger}40`, background: `${AT.danger}14`, color: AT.danger, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Remove</button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={5} style={{ padding: "24px 16px", textAlign: "center", color: AT.muted }}>No tasks yet.</td></tr>
            )}
          </tbody>
        </table>
        {error && <p style={{ margin: "8px 16px", fontSize: 12, color: AT.danger }}>{error}</p>}
      </div>
    </div>
  );
}

