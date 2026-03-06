import React from "react";

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
          <span className="sr-only">Toggle sidebar</span>
          ☰
        </button>
        <h1 className="text-lg font-medium text-gray-900 dark:text-gray-100">Super Admin</h1>
      </div>

      <div className="flex items-center space-x-4">
        <button className="px-3 py-2 bg-indigo-600 text-white rounded text-sm">Create Announcement</button>
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <div className="text-xs text-gray-500">Admin</div>
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">super@microlink</div>
          </div>
          <div className="w-9 h-9 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-sm">SA</div>
        </div>
      </div>
    </header>
  );
}
