import React from "react";

export default function Jobs() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Jobs</h2>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded border dark:border-gray-700">
        <div className="text-sm text-gray-600 dark:text-gray-300">Jobs table placeholder — wire to your jobs data (Supabase)</div>
        <div className="mt-4 h-40 bg-gray-50 dark:bg-gray-900 rounded flex items-center justify-center text-sm text-gray-400">[Jobs table]</div>
      </div>
    </div>
  );
}
