import React from "react";

import Users from "./Users";
import Jobs from "./Jobs";
import Reports from "./Reports";

export default function Moderation() {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Unified Moderation</h2>
      <div className="space-y-8">
        <Users />
        <Jobs />
        <Reports />
      </div>
    </div>
  );
}
