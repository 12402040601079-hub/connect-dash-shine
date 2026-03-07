import React, { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { firestore } from "@/integrations/firebase/client";
import { AT, GLASS_CARD } from "./adminTheme";

type ProfileRow = { helperMeta?: { verified?: boolean; isSuspended?: boolean; }; role?: string; };
type ReportRow = { id?: string; status?: string; reason?: string; reporterId?: string; };

export default function TrustSafety() {
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [reports, setReports] = useState<ReportRow[]>([]);

  useEffect(() => {
    if (!firestore) return;
    const u1 = onSnapshot(query(collection(firestore, "profiles")), s => setProfiles(s.docs.map(d => d.data())));
    const u2 = onSnapshot(query(collection(firestore, "reports")), s => setReports(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => { u1(); u2(); };
  }, []);

  const metrics = useMemo(() => ({
    verifiedHelpers: profiles.filter(p => p.helperMeta?.verified).length,
    suspendedUsers:  profiles.filter(p => p.helperMeta?.isSuspended).length,
    totalHelpers:    profiles.filter(p => p.role === "helper").length,
    abuseFlags:      reports.filter(r => r.status === "open" || r.status === "investigating").length,
    resolvedTotal:   reports.filter(r => r.status === "resolved").length,
  }), [profiles, reports]);

  const openFlags = reports.filter(r => r.status === "open" || r.status === "investigating").slice(0, 6);

  const METRIC_CARDS = [
    { label: "Verified Helpers", val: metrics.verifiedHelpers, sub: `of ${metrics.totalHelpers} helpers`, color: AT.accent },
    { label: "Suspended Users",  val: metrics.suspendedUsers,  sub: "Active bans",                         color: AT.danger },
    { label: "Open Abuse Flags", val: metrics.abuseFlags,      sub: "Needs review",                        color: AT.warn },
    { label: "Resolved Cases",   val: metrics.resolvedTotal,   sub: "All time",                            color: AT.primary },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: AT.text }}>Trust & Safety</h2>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: AT.muted }}>Platform safety overview and active flags</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(175px,1fr))", gap: 14 }}>
        {METRIC_CARDS.map(m => (
          <div key={m.label} style={{ ...GLASS_CARD, padding: "18px 20px" }}>
            <div style={{ fontSize: 10, color: AT.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>{m.label}</div>
            <div style={{ fontFamily: "'Poppins','Inter',sans-serif", fontSize: 30, fontWeight: 800, color: m.color, lineHeight: 1 }}>{m.val}</div>
            <div style={{ fontSize: 11, color: AT.muted, marginTop: 7 }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {openFlags.length > 0 && (
        <div style={{ ...GLASS_CARD, padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: `1px solid ${AT.border}` }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: AT.text }}>Active Flags</div>
            <div style={{ fontSize: 11, color: AT.muted, marginTop: 2 }}>Latest open reports requiring attention</div>
          </div>
          {openFlags.map((r: any, i: number) => (
            <div key={r.id || i} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "12px 20px",
              borderBottom: i < openFlags.length - 1 ? `1px solid ${AT.border}` : "none",
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: AT.text }}>{r.reason || "No reason given"}</div>
                <div style={{ fontSize: 11, color: AT.muted, marginTop: 2 }}>Reporter: {r.reporterId?.slice(0, 14)}…</div>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 99, background: `${AT.danger}18`, color: AT.danger, border: `1px solid ${AT.danger}35` }}>{r.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
