import React, { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";

import { firestore } from "@/integrations/firebase/client";
import { suspendUser, verifyHelper } from "@/services/admin";

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  suspended: boolean;
  verified: boolean;
};

type ProfileRow = {
  name?: string;
  email?: string;
  role?: string;
  helperMeta?: {
    isSuspended?: boolean;
    verified?: boolean;
  };
};

const ADMIN_ID = "super-admin-demo";

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
            role: row.role || "requester",
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
