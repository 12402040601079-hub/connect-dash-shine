import React, { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { firestore } from "@/integrations/firebase/client";
import { AT, GLASS_CARD } from "./adminTheme";

export default function Dashboard() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    if (!firestore) return;
    const u1 = onSnapshot(query(collection(firestore, "tasks"), orderBy("createdAt", "desc")), s =>
      setTasks(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    const u2 = onSnapshot(query(collection(firestore, "profiles")), s =>
      setProfiles(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    const u3 = onSnapshot(query(collection(firestore, "reports"), orderBy("createdAt", "desc")), s =>
      setReports(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    return () => { u1(); u2(); u3(); };
  }, []);

  const stats = useMemo(() => ({
    totalUsers:     profiles.length,
    helpers:        profiles.filter((p: any) => p.role === "helper").length,
    totalTasks:     tasks.length,
    openTasks:      tasks.filter((t: any) => t.status === "open").length,
    completedTasks: tasks.filter((t: any) => t.status === "completed").length,
    openReports:    reports.filter((r: any) => r.status === "open" || r.status === "investigating").length,
  }), [profiles, tasks, reports]);

  const STAT_CARDS = [
    { label: "Total Users",    val: stats.totalUsers,     color: AT.primary,   sub: `${stats.helpers} helpers registered` },
    { label: "Total Tasks",    val: stats.totalTasks,     color: AT.accent,    sub: `${stats.openTasks} currently open` },
    { label: "Open Tasks",     val: stats.openTasks,      color: AT.warn,      sub: "Awaiting helpers" },
    { label: "Completed",      val: stats.completedTasks, color: "#a78bfa",    sub: "Successfully done" },
    { label: "Helpers",        val: stats.helpers,        color: "#34d399",    sub: `${stats.totalUsers - stats.helpers} regular users` },
    { label: "Open Reports",   val: stats.openReports,    color: AT.danger,    sub: "Need review" },
  ];

  const taskStatusColor = (s?: string) => {
    if (s === "completed") return AT.accent;
    if (s === "open") return AT.primary;
    if (s === "cancelled") return AT.danger;
    return AT.warn;
  };

  const recentTasks = tasks.slice(0, 6);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(175px,1fr))", gap: 14 }}>
        {STAT_CARDS.map((s) => (
          <div key={s.label} style={{ ...GLASS_CARD, padding: "18px 20px" }}>
            <div style={{ fontSize: 10, color: AT.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontFamily: "'Poppins','Inter',sans-serif", fontSize: 32, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.val}</div>
            <div style={{ fontSize: 11, color: AT.muted, marginTop: 7 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Two-column section */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 18, alignItems: "start" }}>
        {/* Recent tasks */}
        <div style={{ ...GLASS_CARD, padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: `1px solid ${AT.border}` }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: AT.text }}>Recent Tasks</div>
            <div style={{ fontSize: 11, color: AT.muted, marginTop: 2 }}>Latest posted job tasks</div>
          </div>
          {recentTasks.length === 0 && (
            <div style={{ padding: "20px", fontSize: 13, color: AT.muted }}>No tasks yet.</div>
          )}
          {recentTasks.map((task: any, i: number) => (
            <div key={task.id} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "12px 20px",
              borderBottom: i < recentTasks.length - 1 ? `1px solid ${AT.border}` : "none",
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: AT.text }}>{task.title || "Untitled"}</div>
                <div style={{ fontSize: 11, color: AT.muted, marginTop: 2 }}>{task.category || "General"} · {task.posterName || task.posterId || "?"}</div>
              </div>
              <span style={{
                fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 99,
                background: `${taskStatusColor(task.status)}1a`,
                color: taskStatusColor(task.status),
                border: `1px solid ${taskStatusColor(task.status)}35`,
              }}>{task.status || "open"}</span>
            </div>
          ))}
        </div>

        {/* Right column: breakdown cards */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {/* User breakdown */}
          <div style={{ ...GLASS_CARD, padding: "18px 20px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: AT.text, marginBottom: 14 }}>User Breakdown</div>
            {[
              { label: "Regular Users", val: stats.totalUsers - stats.helpers, color: AT.primary },
              { label: "Helpers",        val: stats.helpers,                    color: AT.accent },
            ].map(row => (
              <div key={row.label} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 12, color: AT.sub }}>{row.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: AT.text }}>{row.val}</span>
                </div>
                <div style={{ height: 5, borderRadius: 99, background: `${row.color}1a` }}>
                  <div style={{ height: "100%", borderRadius: 99, background: row.color, width: stats.totalUsers ? `${(row.val / stats.totalUsers) * 100}%` : "0%", transition: "width 0.6s ease" }} />
                </div>
              </div>
            ))}
          </div>

          {/* Task breakdown */}
          <div style={{ ...GLASS_CARD, padding: "18px 20px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: AT.text, marginBottom: 14 }}>Task Status</div>
            {[
              { label: "Open",      val: stats.openTasks,      color: AT.primary },
              { label: "Completed", val: stats.completedTasks, color: AT.accent },
              { label: "Other",     val: stats.totalTasks - stats.openTasks - stats.completedTasks, color: AT.warn },
            ].map(row => (
              <div key={row.label} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 12, color: AT.sub }}>{row.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: AT.text }}>{row.val}</span>
                </div>
                <div style={{ height: 5, borderRadius: 99, background: `${row.color}1a` }}>
                  <div style={{ height: "100%", borderRadius: 99, background: row.color, width: stats.totalTasks ? `${(row.val / stats.totalTasks) * 100}%` : "0%", transition: "width 0.6s ease" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
