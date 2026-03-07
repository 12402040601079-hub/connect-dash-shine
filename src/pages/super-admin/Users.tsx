import React, { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { firestore } from "@/integrations/firebase/client";
import { suspendUser, verifyHelper } from "@/services/admin";
import { AT, GLASS_CARD } from "./adminTheme";

type UserRow = { id: string; name: string; email: string; role: string; suspended: boolean; verified: boolean; };
type ProfileRow = { name?: string; email?: string; role?: string; helperMeta?: { isSuspended?: boolean; verified?: boolean; }; };

const ADMIN_ID = "super-admin-demo";

export default function Users() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<UserRow[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!firestore) return;
    const unsub = onSnapshot(query(collection(firestore, "profiles")), (snap) => {
      setRows(snap.docs.map((d) => {
        const row = d.data() as ProfileRow;
        return {
          id: d.id,
          name: row.name || "Unknown",
          email: row.email || "",
          role: row.role || "user",
          suspended: Boolean(row.helperMeta?.isSuspended),
          verified: Boolean(row.helperMeta?.verified),
        };
      }));
    });
    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    if (!q) return rows;
    const ql = q.toLowerCase();
    return rows.filter((r) => r.name.toLowerCase().includes(ql) || r.email.toLowerCase().includes(ql));
  }, [q, rows]);

  const onToggleSuspend = async (row: UserRow) => {
    setError("");
    try {
      await suspendUser(ADMIN_ID, row.id, !row.suspended, row.suspended ? "Unsuspended via admin" : "Suspended via admin");
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed"); }
  };

  const onToggleVerify = async (row: UserRow) => {
    setError("");
    try {
      await verifyHelper(ADMIN_ID, row.id, !row.verified, row.verified ? "Removed verification" : "Verified helper");
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Failed"); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: AT.text }}>Users</h2>
          <p style={{ margin: "4px 0 0", fontSize: 12, color: AT.muted }}>{rows.length} total registered accounts</p>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search users…"
          style={{ padding: "8px 14px", borderRadius: 10, border: `1px solid ${AT.border}`, background: "rgba(139,92,246,0.08)", color: AT.text, fontSize: 13, outline: "none", minWidth: 220 }}
        />
      </div>

      <div style={{ ...GLASS_CARD, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${AT.border}` }}>
              {["Name", "Email", "Role", "Status", "Actions"].map(h => (
                <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, color: AT.muted, textTransform: "uppercase", letterSpacing: "0.8px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={r.id} style={{ borderBottom: i < filtered.length - 1 ? `1px solid ${AT.border}` : "none" }}>
                <td style={{ padding: "12px 16px", color: AT.text, fontWeight: 600 }}>{r.name}</td>
                <td style={{ padding: "12px 16px", color: AT.sub }}>{r.email}</td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 99, background: r.role === "helper" ? `${AT.accent}1a` : `${AT.primary}1a`, color: r.role === "helper" ? AT.accent : AT.primary, border: `1px solid ${r.role === "helper" ? AT.accent : AT.primary}35` }}>{r.role}</span>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 99, background: r.suspended ? `${AT.danger}1a` : `${AT.accent}1a`, color: r.suspended ? AT.danger : AT.accent, border: `1px solid ${r.suspended ? AT.danger : AT.accent}35` }}>{r.suspended ? "suspended" : "active"}</span>
                </td>
                <td style={{ padding: "12px 16px" }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    {r.role === "helper" && (
                      <button onClick={() => onToggleVerify(r)} style={{ padding: "5px 10px", borderRadius: 7, border: `1px solid ${AT.primary}40`, background: `${AT.primary}14`, color: AT.primary, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                        {r.verified ? "Unverify" : "Verify"}
                      </button>
                    )}
                    <button onClick={() => onToggleSuspend(r)} style={{ padding: "5px 10px", borderRadius: 7, border: `1px solid ${AT.danger}40`, background: `${AT.danger}14`, color: AT.danger, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                      {r.suspended ? "Unsuspend" : "Suspend"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} style={{ padding: "24px 16px", textAlign: "center", color: AT.muted, fontSize: 13 }}>No users found.</td></tr>
            )}
          </tbody>
        </table>
        {error && <p style={{ margin: "8px 16px", fontSize: 12, color: AT.danger }}>{error}</p>}
      </div>
    </div>
  );
}

export default function Users() {
  const [q, setQ] = useState("");
  const [rows, setRows] = useState<UserRow[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!firestore) return;
    const unsub = onSnapshot(query(collection(firestore, "profiles")), (snap) => {
      setRows(
        snap.docs.map((d) => {
          const row = d.data() as ProfileRow;
          return {
            id: d.id,
            name: row.name || "Unknown",
            email: row.email || "",
            role: row.role || "user",
            suspended: Boolean(row.helperMeta?.isSuspended),
            verified: Boolean(row.helperMeta?.verified),
          };
        }),
      );
    });
    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    if (!q) return rows;
    const queryText = q.toLowerCase();
    return rows.filter((r) => r.name.toLowerCase().includes(queryText) || r.email.toLowerCase().includes(queryText));
  }, [q, rows]);

  const onToggleSuspend = async (row: UserRow) => {
    setError("");
    try {
      await suspendUser(ADMIN_ID, row.id, !row.suspended, row.suspended ? "Unsuspended via admin panel" : "Suspended via admin panel");
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to update suspension state";
      setError(message);
    }
  };

  const onToggleVerify = async (row: UserRow) => {
    setError("");
    try {
      await verifyHelper(ADMIN_ID, row.id, !row.verified, row.verified ? "Removed verification" : "Verified helper");
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to update verification state";
      setError(message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Users</h2>
        <div className="flex items-center space-x-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="px-3 py-2 border rounded bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-sm"
            placeholder="Search users..."
          />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded border dark:border-gray-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500">
              <th className="pb-2">Name</th>
              <th className="pb-2">Email</th>
              <th className="pb-2">Role</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((r) => (
              <tr key={r.id} className="text-gray-700 dark:text-gray-200">
                <td className="py-2">{r.name}</td>
                <td className="py-2">{r.email}</td>
                <td className="py-2">{r.role}</td>
                <td className="py-2">{r.suspended ? "suspended" : "active"}</td>
                <td className="py-2">
                  <div className="flex items-center gap-2">
                    <button className="px-2 py-1 text-xs bg-indigo-600 text-white rounded" onClick={() => onToggleVerify(r)}>
                      {r.verified ? "Unverify" : "Verify"}
                    </button>
                    <button className="px-2 py-1 text-xs bg-red-600 text-white rounded" onClick={() => onToggleSuspend(r)}>
                      {r.suspended ? "Unsuspend" : "Suspend"}
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
