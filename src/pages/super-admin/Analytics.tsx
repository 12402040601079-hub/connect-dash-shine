import React, { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";
import { firestore } from "@/integrations/firebase/client";
import { AT, GLASS_CARD } from "./adminTheme";

type TaskRow = { status?: string };
type ProfileRow = { role?: string };
type ReportRow = { status?: string };

const Bar = ({ label, val, max, color }: { label: string; val: number; max: number; color: string }) => (
  <div style={{ marginBottom: 14 }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
      <span style={{ fontSize: 12, color: AT.sub }}>{label}</span>
      <span style={{ fontSize: 12, fontWeight: 700, color: AT.text }}>{val}</span>
    </div>
    <div style={{ height: 6, borderRadius: 99, background: `${color}18` }}>
      <div style={{ height: "100%", borderRadius: 99, background: color, width: max ? `${Math.min((val / max) * 100, 100)}%` : "0%", transition: "width 0.6s ease" }} />
    </div>
  </div>
);

export default function Analytics() {
  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [reports, setReports] = useState<ReportRow[]>([]);

  useEffect(() => {
    if (!firestore) return;
    const u1 = onSnapshot(query(collection(firestore, "tasks")), s => setTasks(s.docs.map(d => d.data())));
    const u2 = onSnapshot(query(collection(firestore, "profiles")), s => setProfiles(s.docs.map(d => d.data())));
    const u3 = onSnapshot(query(collection(firestore, "reports")), s => setReports(s.docs.map(d => d.data())));
    return () => { u1(); u2(); u3(); };
  }, []);

  const st = useMemo(() => {
    const totalTasks      = tasks.length;
    const openTasks       = tasks.filter(t => t.status === "open").length;
    const inProgress      = tasks.filter(t => t.status === "in_progress" || t.status === "accepted").length;
    const completedTasks  = tasks.filter(t => t.status === "completed").length;
    const cancelledTasks  = tasks.filter(t => t.status === "cancelled").length;
    const totalUsers      = profiles.length;
    const helpers         = profiles.filter(p => p.role === "helper").length;
    const openReports     = reports.filter(r => r.status === "open" || r.status === "investigating").length;
    const resolvedReports = reports.filter(r => r.status === "resolved").length;
    const dismissedReports= reports.filter(r => r.status === "dismissed").length;
    return { totalTasks, openTasks, inProgress, completedTasks, cancelledTasks, totalUsers, helpers, openReports, resolvedReports, dismissedReports };
  }, [profiles, reports, tasks]);

  const topMetrics = [
    { label: "Total Users",      val: st.totalUsers,     sub: `${st.helpers} helpers`, color: AT.primary },
    { label: "Total Tasks",      val: st.totalTasks,     sub: `${st.openTasks} currently open`, color: AT.accent },
    { label: "Completion Rate",  val: st.totalTasks ? `${Math.round((st.completedTasks / st.totalTasks) * 100)}%` : "0%", sub: `${st.completedTasks} completed`, color: "#a78bfa" },
    { label: "Open Reports",     val: st.openReports,   sub: "Need action", color: AT.danger },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: AT.text }}>Analytics & Insights</h2>
        <p style={{ margin: "4px 0 0", fontSize: 12, color: AT.muted }}>Real-time platform overview</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(175px,1fr))", gap: 14 }}>
        {topMetrics.map(m => (
          <div key={m.label} style={{ ...GLASS_CARD, padding: "18px 20px" }}>
            <div style={{ fontSize: 10, color: AT.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>{m.label}</div>
            <div style={{ fontFamily: "'Poppins','Inter',sans-serif", fontSize: 30, fontWeight: 800, color: m.color, lineHeight: 1 }}>{m.val}</div>
            <div style={{ fontSize: 11, color: AT.muted, marginTop: 7 }}>{m.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <div style={{ ...GLASS_CARD, padding: "20px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: AT.text, marginBottom: 18 }}>Task Status Breakdown</div>
          <Bar label="Open"         val={st.openTasks}      max={st.totalTasks} color={AT.primary} />
          <Bar label="In Progress"  val={st.inProgress}     max={st.totalTasks} color={AT.warn} />
          <Bar label="Completed"    val={st.completedTasks} max={st.totalTasks} color={AT.accent} />
          <Bar label="Cancelled"    val={st.cancelledTasks} max={st.totalTasks} color={AT.danger} />
        </div>
        <div style={{ ...GLASS_CARD, padding: "20px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: AT.text, marginBottom: 18 }}>Reports Overview</div>
          <Bar label="Open / Investigating" val={st.openReports}      max={reports.length} color={AT.danger} />
          <Bar label="Resolved"             val={st.resolvedReports}  max={reports.length} color={AT.accent} />
          <Bar label="Dismissed"            val={st.dismissedReports} max={reports.length} color={AT.muted} />
          <div style={{ marginTop: 16, padding: "12px 14px", borderRadius: 12, background: `${AT.primary}0e`, border: `1px solid ${AT.primary}22` }}>
            <div style={{ fontSize: 11, color: AT.muted }}>User / Helper ratio</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: AT.primary, marginTop: 3, fontFamily: "'Poppins','Inter',sans-serif" }}>
              {st.helpers > 0 ? `1 : ${((st.totalUsers - st.helpers) / st.helpers).toFixed(1)}` : "—"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

