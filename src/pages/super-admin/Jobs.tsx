import React, { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

import { firestore } from "@/integrations/firebase/client";
import { removeTask } from "@/services/admin";

const ADMIN_ID = "super-admin-demo";

type TaskRow = {
  id: string;
  title?: string;
  category?: string;
  status?: string;
  posterName?: string;
  posterId?: string;
};

export default function Jobs() {
  const [rows, setRows] = useState<TaskRow[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!firestore) return;
    const unsub = onSnapshot(query(collection(firestore, "tasks"), orderBy("createdAt", "desc")), (snap) => {
      setRows(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  const onRemove = async (taskId: string) => {
    setError("");
    try {
      await removeTask(ADMIN_ID, taskId, "Removed from jobs panel");
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : "Failed to remove task";
      setError(message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Jobs</h2>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded border dark:border-gray-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500">
              <th className="pb-2">Title</th>
              <th className="pb-2">Category</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">Poster</th>
              <th className="pb-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((row) => (
              <tr key={row.id} className="text-gray-700 dark:text-gray-200">
                <td className="py-2">{row.title}</td>
                <td className="py-2">{row.category || "General"}</td>
                <td className="py-2">{row.status}</td>
                <td className="py-2">{row.posterName || row.posterId}</td>
                <td className="py-2">
                  <button className="px-2 py-1 text-xs bg-red-600 text-white rounded" onClick={() => onRemove(row.id)}>
                    Remove
                  </button>
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
