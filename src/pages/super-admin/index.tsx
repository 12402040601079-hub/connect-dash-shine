import React, { useState } from "react";
import { signOut } from "firebase/auth";
import { firebaseAuth } from "@/integrations/firebase/client";
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

  const handleSignOut = async () => {
    try { if (firebaseAuth) await signOut(firebaseAuth); } catch {}
    window.location.href = "/";
  };

  return (
    <AdminLayout active={view} onNav={(id) => setView(id)} onSignOut={handleSignOut}>
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
