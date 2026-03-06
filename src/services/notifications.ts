import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { firestore } from "@/integrations/firebase/client";
import type { NotificationDoc, NotificationType } from "@/lib/firestoreSchema";

export type NotificationInput = {
  type: NotificationType;
  title: string;
  body: string;
  ref?: NotificationDoc["ref"];
};

export async function notify(userId: string, payload: NotificationInput): Promise<void> {
  if (!firestore) {
    throw new Error("Firestore is not configured");
  }

  await addDoc(collection(firestore, "notifications"), {
    userId,
    type: payload.type,
    title: payload.title,
    body: payload.body,
    ref: payload.ref ?? {},
    read: false,
    createdAt: serverTimestamp(),
  });
}

export function getMyNotifications(
  userId: string,
  onData: (rows: Array<NotificationDoc & { id: string }>) => void,
): () => void {
  if (!firestore) {
    onData([]);
    return () => undefined;
  }

  const q = query(
    collection(firestore, "notifications"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
  );

  return onSnapshot(q, (snap) => {
    onData(snap.docs.map((d) => ({ id: d.id, ...(d.data() as NotificationDoc) })));
  });
}

export async function markNotificationRead(notificationId: string): Promise<void> {
  if (!firestore) {
    throw new Error("Firestore is not configured");
  }

  await updateDoc(doc(firestore, "notifications", notificationId), {
    read: true,
  });
}
