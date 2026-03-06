import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

import { firestore } from "@/integrations/firebase/client";

function assertFirestore() {
  if (!firestore) {
    throw new Error("Firestore is not configured");
  }
}

async function logAdminAction(adminId: string, type: string, target: Record<string, string | undefined>, note: string) {
  assertFirestore();
  await addDoc(collection(firestore!, "admin_actions"), {
    adminId,
    type,
    target,
    note,
    createdAt: serverTimestamp(),
  });
}

export async function suspendUser(adminId: string, userId: string, isSuspended: boolean, note = ""): Promise<void> {
  assertFirestore();

  await setDoc(
    doc(firestore!, "profiles", userId),
    {
      helperMeta: {
        isSuspended,
      },
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  await logAdminAction(adminId, isSuspended ? "suspend_user" : "unsuspend_user", { userId }, note);
}

export async function verifyHelper(adminId: string, userId: string, verified: boolean, note = ""): Promise<void> {
  assertFirestore();

  await setDoc(
    doc(firestore!, "profiles", userId),
    {
      helperMeta: {
        verified,
      },
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  await logAdminAction(adminId, "verify_helper", { userId }, note);
}

export async function removeTask(adminId: string, taskId: string, note = ""): Promise<void> {
  assertFirestore();

  await updateDoc(doc(firestore!, "tasks", taskId), {
    status: "cancelled",
    updatedAt: serverTimestamp(),
  });

  await logAdminAction(adminId, "remove_task", { taskId }, note);
}

export async function resolveReport(
  adminId: string,
  reportId: string,
  status: "resolved" | "dismissed",
  actionTaken: string,
): Promise<void> {
  assertFirestore();

  await updateDoc(doc(firestore!, "reports", reportId), {
    status,
    actionTaken,
    updatedAt: serverTimestamp(),
  });

  await logAdminAction(adminId, "resolve_report", { reportId }, actionTaken);
}
