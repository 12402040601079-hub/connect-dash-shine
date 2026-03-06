import React, { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";

import { firestore } from "@/integrations/firebase/client";

type TaskRow = { status?: string };
type ProfileRow = { role?: string };
type ReportRow = { status?: string };

export default function Analytics() {
  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [reports, setReports] = useState<ReportRow[]>([]);

  useEffect(() => {
    if (!firestore) return;
    const unsubTasks = onSnapshot(query(collection(firestore, "tasks")), (snap) => {
      setTasks(snap.docs.map((d) => d.data()));
    });
    const unsubProfiles = onSnapshot(query(collection(firestore, "profiles")), (snap) => {
      setProfiles(snap.docs.map((d) => d.data()));
    });
    const unsubReports = onSnapshot(query(collection(firestore, "reports")), (snap) => {
      setReports(snap.docs.map((d) => d.data()));
    });
    return () => {
      unsubTasks();
      unsubProfiles();
      unsubReports();
    };
  }, []);

  const stats = useMemo(() => {
    const totalTasks = tasks.length;
    const openTasks = tasks.filter((t) => t.status === "open").length;
    const completedTasks = tasks.filter((t) => t.status === "completed").length;
    const totalUsers = profiles.length;
    const helpers = profiles.filter((p) => p.role === "helper").length;
    const openReports = reports.filter((r) => r.status === "open" || r.status === "investigating").length;
    return { totalTasks, openTasks, completedTasks, totalUsers, helpers, openReports };
  }, [profiles, reports, tasks]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Analytics & Insights</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded border dark:border-gray-700">
          <div className="text-xs text-gray-500">Total Users</div>
          <div className="text-2xl font-semibold mt-1">{stats.totalUsers}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded border dark:border-gray-700">
          <div className="text-xs text-gray-500">Helpers</div>
          <div className="text-2xl font-semibold mt-1">{stats.helpers}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded border dark:border-gray-700">
          <div className="text-xs text-gray-500">Open Reports</div>
          <div className="text-2xl font-semibold mt-1">{stats.openReports}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded border dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-300">Task status snapshot</div>
          <div className="mt-4 space-y-2 text-sm">
            <div>Total tasks: {stats.totalTasks}</div>
            <div>Open: {stats.openTasks}</div>
            <div>Completed: {stats.completedTasks}</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded border dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-300">Trust & safety overview</div>
          <div className="mt-4 space-y-2 text-sm">
            <div>Open or investigating reports: {stats.openReports}</div>
            <div>Resolved reports: {reports.filter((r) => r.status === "resolved").length}</div>
            <div>Dismissed reports: {reports.filter((r) => r.status === "dismissed").length}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
