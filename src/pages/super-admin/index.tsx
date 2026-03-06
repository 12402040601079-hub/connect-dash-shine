import React, { useState } from "react";
import AdminLayout from "./AdminLayout";
import Dashboard from "./Dashboard";
import Users from "./Users";
import Jobs from "./Jobs";
import Reports from "./Reports";
import Categories from "./Categories";
import Analytics from "./Analytics";
import Moderation from "./Moderation";
import TrustSafety from "./TrustSafety";

const VIEWS = {
  dashboard: "dashboard",
  moderation: "moderation",
  trustSafety: "trust-safety",
  users: "users",
  jobs: "jobs",
  reports: "reports",
  categories: "categories",
  analytics: "analytics",
};

export default function SuperAdminApp() {
  const [view, setView] = useState<string>(VIEWS.dashboard);

  return (
    <AdminLayout active={view} onNav={(id) => setView(id)}>
      {view === VIEWS.dashboard && <Dashboard />}
      {view === VIEWS.moderation && <Moderation />}
      {view === VIEWS.trustSafety && <TrustSafety />}
      {view === VIEWS.users && <Users />}
      {view === VIEWS.jobs && <Jobs />}
      {view === VIEWS.reports && <Reports />}
      {view === VIEWS.categories && <Categories />}
      {view === VIEWS.analytics && <Analytics />}
    </AdminLayout>
  );
}
