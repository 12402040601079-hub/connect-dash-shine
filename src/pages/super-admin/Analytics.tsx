import React from "react";

export default function Analytics() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Analytics & Insights</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded border dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-300">Most popular categories</div>
          <div className="mt-4 h-40 bg-gray-50 dark:bg-gray-900 rounded flex items-center justify-center text-sm text-gray-400">[Bar chart]</div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded border dark:border-gray-700">
          <div className="text-sm text-gray-600 dark:text-gray-300">Top performing workers</div>
          <div className="mt-4 h-40 bg-gray-50 dark:bg-gray-900 rounded flex items-center justify-center text-sm text-gray-400">[Leaderboard]</div>
        </div>
      </div>
    </div>
  );
}
