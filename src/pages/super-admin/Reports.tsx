import React from "react";

export default function Reports() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Reports & Disputes</h2>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded border dark:border-gray-700">
        <div className="text-sm text-gray-600 dark:text-gray-300">Reported items will appear here. Provide tools to investigate and resolve.</div>
        <div className="mt-4 h-40 bg-gray-50 dark:bg-gray-900 rounded flex items-center justify-center text-sm text-gray-400">[Reports list]</div>
      </div>
    </div>
  );
}
