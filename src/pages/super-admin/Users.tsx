import React, { useMemo, useState } from "react";

type UserRow = { id: string; name: string; email: string; role: string; status: string };

const MOCK: UserRow[] = [
  { id: "u1", name: "Jane Doe", email: "jane@example.com", role: "Job Poster", status: "active" },
  { id: "u2", name: "Tom Worker", email: "tom@example.com", role: "Verified Worker", status: "suspended" },
  { id: "u3", name: "Sana", email: "sana@example.com", role: "Job Seeker", status: "active" },
];

export default function Users() {
  const [q, setQ] = useState("");
  const rows = useMemo(() => {
    if (!q) return MOCK;
    return MOCK.filter((r) => r.name.toLowerCase().includes(q.toLowerCase()) || r.email.toLowerCase().includes(q.toLowerCase()));
  }, [q]);

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
            {rows.map((r) => (
              <tr key={r.id} className="text-gray-700 dark:text-gray-200">
                <td className="py-2">{r.name}</td>
                <td className="py-2">{r.email}</td>
                <td className="py-2">{r.role}</td>
                <td className="py-2">{r.status}</td>
                <td className="py-2">
                  <div className="flex items-center gap-2">
                    <button className="px-2 py-1 text-xs bg-indigo-600 text-white rounded">View</button>
                    <button className="px-2 py-1 text-xs bg-yellow-500 text-white rounded">Edit</button>
                    <button className="px-2 py-1 text-xs bg-red-600 text-white rounded">Suspend</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
