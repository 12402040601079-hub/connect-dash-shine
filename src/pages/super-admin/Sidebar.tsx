import React from "react";
import { AT } from "./adminTheme";

type Item = { id: string; label: string; icon: string };

const SVG = ({ d, size = 17 }: { d: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    <path d={d} />
  </svg>
);

const items: Item[] = [
  { id: "dashboard",    label: "Dashboard",      icon: "M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z" },
  { id: "analytics",   label: "Analytics",      icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  { id: "users",       label: "Users",          icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zm8 0a3 3 0 100-6 3 3 0 000 6zm4 10v-2a3 3 0 00-3-3" },
  { id: "jobs",        label: "Jobs",           icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
  { id: "reports",     label: "Reports",        icon: "M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" },
  { id: "moderation",  label: "Moderation",     icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" },
  { id: "trust-safety",label: "Trust & Safety", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
  { id: "categories",  label: "Categories",     icon: "M4 6h16M4 10h16M4 14h16M4 18h16" },
];

export default function Sidebar({
  onNavigate,
  active,
  onSignOut,
}: {
  onNavigate?: (id: string) => void;
  active?: string;
  onSignOut?: () => void;
}) {
  return (
    <aside style={{
      width: 230, minWidth: 230,
      background: AT.sidebar,
      borderRight: `1px solid ${AT.border}`,
      display: "flex", flexDirection: "column",
    }}>
      {/* Logo */}
      <div style={{ padding: "18px 18px 14px", borderBottom: `1px solid ${AT.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: AT.primaryGrad,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 17, fontWeight: 900, color: "#fff",
          }}>M</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: AT.text, letterSpacing: "-0.3px" }}>MicroLink</div>
            <div style={{ fontSize: 10, color: AT.muted, marginTop: 1 }}>Super Admin</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "10px 8px", overflowY: "auto" }}>
        {items.map((it) => {
          const isActive = active === it.id;
          return (
            <button
              key={it.id}
              onClick={() => onNavigate?.(it.id)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 9,
                padding: "8px 12px", marginBottom: 2,
                borderRadius: 10, border: "none",
                borderLeft: `2px solid ${isActive ? AT.primary : "transparent"}`,
                background: isActive ? AT.secondary : "transparent",
                color: isActive ? AT.primary : AT.sub,
                fontSize: 13, fontWeight: isActive ? 700 : 500,
                cursor: "pointer", textAlign: "left", transition: "all 0.15s",
              }}
            >
              <span style={{ color: isActive ? AT.primary : AT.muted }}>
                <SVG d={it.icon} />
              </span>
              {it.label}
            </button>
          );
        })}
      </nav>

      {/* Sign out */}
      <div style={{ padding: "10px 8px 14px", borderTop: `1px solid ${AT.border}` }}>
        <button
          onClick={onSignOut}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: 9,
            padding: "8px 12px", borderRadius: 10,
            border: `1px solid ${AT.danger}30`,
            background: `${AT.danger}0e`,
            color: AT.danger, fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}
        >
          <SVG d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          Sign Out
        </button>
        <div style={{ marginTop: 10, paddingLeft: 4, fontSize: 10, color: AT.muted }}>v1.0 · Platform Control Center</div>
      </div>
    </aside>
  );
}
