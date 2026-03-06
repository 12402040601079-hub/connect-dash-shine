import React from "react";

type Item = { id: string; label: string };

const items: Item[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "users", label: "Users" },
  { id: "jobs", label: "Jobs" },
  { id: "reports", label: "Reports" },
  { id: "categories", label: "Categories" },
  { id: "analytics", label: "Analytics" },
  { id: "notifications", label: "Notifications" },
  { id: "settings", label: "Settings" },
];

export default function Sidebar({
  onNavigate,
  active,
}: {
  onNavigate?: (id: string) => void;
  active?: string;
}) {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r dark:border-gray-700 flex flex-col">
      <div className="px-6 py-5 border-b dark:border-gray-700">
        <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">MicroLink — Super Admin</div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Platform control center</div>
      </div>
      <nav className="flex-1 overflow-auto px-2 py-4 space-y-1" aria-label="Sidebar">
        {items.map((it) => (
          <button
            key={it.id}
            onClick={() => onNavigate?.(it.id)}
            className={`w-full text-left px-3 py-2 rounded text-sm ${
              active === it.id
                ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30"
                : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
            }`}
          >
            {it.label}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t dark:border-gray-700 text-xs text-gray-500">v1.0 • Manage the platform</div>
    </aside>
  );
}
