import React from "react";

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow-sm border dark:border-gray-700">
      <div className="text-xs text-gray-500">{title}</div>
      <div className="mt-2 text-2xl font-semibold text-gray-900 dark:text-gray-100">{value}</div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard title="Total Users" value={12458} />
        <StatCard title="Total Job Posts" value={8421} />
        <StatCard title="Active Jobs" value={124} />
        <StatCard title="Completed Jobs" value={7980} />
        <StatCard title="Pending Approvals" value={18} />
        <StatCard title="Reported Jobs" value={9} />
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-4 rounded border dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-300">Jobs posted per week (mock)</div>
          <div className="mt-4 h-48 bg-gray-50 dark:bg-gray-900 rounded flex items-center justify-center text-sm text-gray-400">[Chart placeholder]</div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded border dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-300">Recent activity</div>
          <ul className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-200">
            <li>New user signed up: jane@example.com</li>
            <li>Job posted: "Fix my sink"</li>
            <li>User verification approved: tom@example.com</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
