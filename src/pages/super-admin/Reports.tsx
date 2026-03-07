import React, { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { firestore } from "@/integrations/firebase/client";
import { resolveReport } from "@/services/admin";
import { AT, GLASS_CARD } from "./adminTheme";

const ADMIN_ID = "super-admin-demo";
type ReportRow = { id: string; reporterId?: string; reason?: string; status?: string; details?: string; };

export default function Reports() {
  const [rows, setRows] = useState<ReportRow[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!firestore) return;
    const unsub = onSnapshot(query(collection(firestore, "reports"), orderBy("createdAt", "desc")), (snap) => {
      setRows(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const onResolve = async (id: string, status: "resolved" | "dismissed") => {
    setError("");
    try { await resolveReport(ADMIN_ID, id, status, status === "resolved" ? "Resolved by admin" : "Dismissed by admin"); }
    catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed"); }
  };

  const statusColor = (s?: string) => {
    if (s === "open" || s === "investigating") return AT.danger;
    if (s === "resolved") return AT.accent;
    return AT.muted;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: AT.text }}>Reports & Disputes</h2>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: AT.muted }}>{rows.filter(r => r.status === "open").length} open · {rows.length} total</p>
      </div>
      <div style={{ ...GLASS_CARD, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${AT.border}` }}>
              {["Reporter", "Reason", "Status", "Details", "Actions"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, color: AT.muted, textTransform: "uppercase", letterSpacing: "0.8px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.id} style={{ borderBottom: i < rows.length - 1 ? `1px solid ${AT.border}` : "none" }}>
                <td style={{ padding: "12px 16px", color: AT.sub, fontFamily: "monospace", fontSize: 11 }}>{row.reporterId?.slice(0, 14)}…</td>
                <td style={{ padding: "12px 16px", color: AT.text, fontWeight: 600 }}>{row.reason || "—"}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 99, background: `${statusColor(row.status)}18`, color: statusColor(row.status), border: `1px solid ${statusColor(row.status)}35` }}>{row.status || "open"}</span>
                </td>
                <td style={{ padding: "12px 16px", color: AT.muted, maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.details || "—"}</td>
                <td style={{ padding: "12px 16px" }}>
                  {(row.status === "open" || row.status === "investigating") && (
                    <div style={{ display: "flex", gap: 6 }}>
                      <button onClick={() => onResolve(row.id, "resolved")} style={{ padding: "5px 10px", borderRadius: 7, border: `1px solid ${AT.accent}40`, background: `${AT.accent}14`, color: AT.accent, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Resolve</button>
                      <button onClick={() => onResolve(row.id, "dismissed")} style={{ padding: "5px 10px", borderRadius: 7, border: `1px solid ${AT.muted}40`, background: `${AT.muted}12`, color: AT.muted, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Dismiss</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={5} style={{ padding: "24px 16px", textAlign: "center", color: AT.muted }}>No reports yet.</td></tr>
            )}
          </tbody>
        </table>
        {error && <p style={{ margin: "8px 16px", fontSize: 12, color: AT.danger }}>{error}</p>}
      </div>
    </div>
  );
}

export default function Reports() {
  const [rows, setRows] = useState<ReportRow[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!firestore) return;
    const unsub = onSnapshot(query(collection(firestore, "reports"), orderBy("createdAt", "desc")), (snap) => {
      setRows(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const onResolve = async (reportId: string, status: "resolved" | "dismissed") => {
    setError("");
    try {
      await resolveReport(ADMIN_ID, reportId, status, status === "resolved" ? "Resolved by admin" : "Dismissed by admin");
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to update report";
      setError(message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Reports & Disputes</h2>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded border dark:border-gray-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500">
              <th className="pb-2">Reporter</th>
              <th className="pb-2">Reason</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">Details</th>
              <th className="pb-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((row) => (
              <tr key={row.id} className="text-gray-700 dark:text-gray-200">
                <td className="py-2">{row.reporterId}</td>
                <td className="py-2">{row.reason || "—"}</td>
                <td className="py-2">{row.status || "open"}</td>
                <td className="py-2">{row.details || "—"}</td>
                <td className="py-2">
                  <div className="flex items-center gap-2">
                    <button className="px-2 py-1 text-xs bg-green-600 text-white rounded" onClick={() => onResolve(row.id, "resolved")}>
                      Resolve
                    </button>
                    <button className="px-2 py-1 text-xs bg-gray-600 text-white rounded" onClick={() => onResolve(row.id, "dismissed")}>
                      Dismiss
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {error && <p className="text-xs text-red-500 mt-3">{error}</p>}
      </div>
    </div>
  );
}
