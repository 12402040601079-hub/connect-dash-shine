import React, { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

import { firestore } from "@/integrations/firebase/client";
import { resolveReport } from "@/services/admin";

const ADMIN_ID = "super-admin-demo";

type ReportRow = {
  id: string;
  reporterId?: string;
  reason?: string;
  status?: string;
  details?: string;
};

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
