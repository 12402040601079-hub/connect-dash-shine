import React, { useState } from "react";
import Users from "./Users";
import Jobs from "./Jobs";
import Reports from "./Reports";
import { AT } from "./adminTheme";

const TABS = [
  { id: "users",   label: "Users" },
  { id: "jobs",    label: "Jobs" },
  { id: "reports", label: "Reports" },
];

export default function Moderation() {
  const [tab, setTab] = useState("users");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: AT.text }}>Unified Moderation</h2>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: AT.muted }}>Manage users, jobs, and reports from one place</p>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            style={{
              padding: "7px 16px", borderRadius: 99, cursor: "pointer",
              border: `1px solid ${tab === t.id ? AT.primary + "66" : AT.border}`,
              background: tab === t.id ? `${AT.primary}18` : "transparent",
              color: tab === t.id ? AT.primary : AT.muted,
              fontSize: 13, fontWeight: 700,
            }}
          >{t.label}</button>
        ))}
      </div>
      {tab === "users"   && <Users />}
      {tab === "jobs"    && <Jobs />}
      {tab === "reports" && <Reports />}
    </div>
  );
}
