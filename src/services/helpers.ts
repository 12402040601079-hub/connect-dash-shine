import { collection, getDocs, query, where } from "firebase/firestore";

import { firestore } from "@/integrations/firebase/client";
import type { ProfileDoc } from "@/lib/firestoreSchema";

export type HelperProfile = ProfileDoc & { id: string };

export async function getHelperProfiles(): Promise<HelperProfile[]> {
  if (!firestore) return [];

  const q = query(collection(firestore, "profiles"), where("role", "==", "helper"));
  const snap = await getDocs(q);

  return snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as ProfileDoc) }))
    .filter((helper) => helper?.helperMeta?.isSuspended !== true);
}
