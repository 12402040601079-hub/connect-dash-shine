import React from "react";

export default function Categories() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Categories</h2>
        <button className="px-3 py-2 bg-indigo-600 text-white rounded text-sm">Add Category</button>
      </div>

      <div className="bg-white dark:bg-gray-800 p-4 rounded border dark:border-gray-700">
        <div className="text-sm text-gray-600 dark:text-gray-300">Manage job categories. Example: Tutoring, Delivery, Cleaning.</div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between p-2 rounded bg-gray-50 dark:bg-gray-900 border dark:border-gray-700">
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-100">Tutoring</div>
              <div className="text-xs text-gray-500">Enabled</div>
            </div>
            <div className="space-x-2">
              <button className="px-2 py-1 text-xs bg-yellow-500 text-white rounded">Edit</button>
              <button className="px-2 py-1 text-xs bg-red-600 text-white rounded">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
