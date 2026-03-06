import React, { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, query } from "firebase/firestore";

import { firestore } from "@/integrations/firebase/client";

type ProfileRow = {
  helperMeta?: {
    verified?: boolean;
    isSuspended?: boolean;
  };
};

type ReportRow = {
  status?: string;
};

export default function TrustSafety() {
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [reports, setReports] = useState<ReportRow[]>([]);

  useEffect(() => {
    if (!firestore) return;
    const unsubProfiles = onSnapshot(query(collection(firestore, "profiles")), (snap) => {
      setProfiles(snap.docs.map((d) => d.data()));
    });
    const unsubReports = onSnapshot(query(collection(firestore, "reports")), (snap) => {
      setReports(snap.docs.map((d) => d.data()));
    });
    return () => {
      unsubProfiles();
      unsubReports();
    };
  }, []);

  const metrics = useMemo(() => {
    const verifiedHelpers = profiles.filter((p) => p.helperMeta?.verified).length;
    const suspendedUsers = profiles.filter((p) => p.helperMeta?.isSuspended).length;
    const abuseFlags = reports.filter((r) => r.status === "open" || r.status === "investigating").length;
    return { verifiedHelpers, suspendedUsers, abuseFlags };
  }, [profiles, reports]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">Trust & Safety</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 p-4 rounded border dark:border-gray-700">
          <div className="text-xs text-gray-500">Verified Helpers</div>
          <div className="text-2xl font-semibold mt-1">{metrics.verifiedHelpers}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded border dark:border-gray-700">
          <div className="text-xs text-gray-500">Suspended Users</div>
          <div className="text-2xl font-semibold mt-1">{metrics.suspendedUsers}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded border dark:border-gray-700">
          <div className="text-xs text-gray-500">Open Abuse Flags</div>
          <div className="text-2xl font-semibold mt-1">{metrics.abuseFlags}</div>
        </div>
      </div>
    </div>
  );
}
