import React from "react";
import { AT } from "./adminTheme";

const PAGE_TITLES: Record<string, string> = {
  dashboard: "Dashboard",
  analytics: "Analytics & Insights",
  users: "User Management",
  jobs: "Job Posts",
  reports: "Reports & Disputes",
  moderation: "Unified Moderation",
  "trust-safety": "Trust & Safety",
  categories: "Categories",
};

export default function Header({ active, onSignOut }: { active?: string; onSignOut?: () => void }) {
  const title = PAGE_TITLES[active ?? "dashboard"] ?? "Super Admin";
  return (
    <header style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 24px", height: 60, flexShrink: 0,
      borderBottom: `1px solid ${AT.border}`,
      background: "rgba(7,6,26,0.75)",
      backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)",
    }}>
      <h1 style={{ fontSize: 16, fontWeight: 700, color: AT.text, margin: 0 }}>{title}</h1>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: AT.text }}>super@microlink</div>
          <div style={{ fontSize: 10, color: AT.muted }}>Administrator</div>
        </div>
        <div style={{
          width: 36, height: 36, borderRadius: "50%",
          background: AT.primaryGrad,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 800, color: "#fff",
        }}>SA</div>
        <button
          onClick={onSignOut}
          style={{
            padding: "7px 14px", borderRadius: 8,
            border: `1px solid ${AT.danger}40`,
            background: `${AT.danger}12`,
            color: AT.danger, fontSize: 12, fontWeight: 700, cursor: "pointer",
          }}
        >Sign Out</button>
      </div>
    </header>
  );
}
