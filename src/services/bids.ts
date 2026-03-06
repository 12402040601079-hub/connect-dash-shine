import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

import { firestore } from "@/integrations/firebase/client";
import type { BidDoc } from "@/lib/firestoreSchema";
import { notify } from "@/services/notifications";

export type PlaceBidInput = {
  taskId: string;
  helperId: string;
  helperName: string;
  posterId: string;
  amount: number;
  note: string;
};

export async function placeBid(input: PlaceBidInput): Promise<string> {
  if (!firestore) {
    throw new Error("Firestore is not configured");
  }

  const bidId = `${input.taskId}_${input.helperId}`;
  await setDoc(
    doc(firestore, "bids", bidId),
    {
      taskId: input.taskId,
      helperId: input.helperId,
      helperName: input.helperName,
      posterId: input.posterId,
      amount: input.amount,
      note: input.note,
      status: "pending",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  await notify(input.posterId, {
    type: "bid_received",
    title: "New bid received",
    body: `${input.helperName} bid INR ${input.amount} on your task`,
    ref: { taskId: input.taskId, bidId },
  });

  return bidId;
}

export function watchTaskBids(
  taskId: string,
  onData: (rows: Array<BidDoc & { id: string }>) => void,
): () => void {
  if (!firestore) {
    onData([]);
    return () => undefined;
  }

  const q = query(collection(firestore, "bids"), where("taskId", "==", taskId), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    onData(snap.docs.map((d) => ({ id: d.id, ...(d.data() as BidDoc) })));
  });
}

export async function getTaskBids(taskId: string): Promise<Array<BidDoc & { id: string }>> {
  if (!firestore) {
    return [];
  }

  const q = query(collection(firestore, "bids"), where("taskId", "==", taskId), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as BidDoc) }));
}

export async function acceptBid(bidId: string): Promise<void> {
  if (!firestore) {
    throw new Error("Firestore is not configured");
  }

  await updateDoc(doc(firestore, "bids", bidId), {
    status: "accepted",
    updatedAt: serverTimestamp(),
  });
}

export async function rejectOtherBids(taskId: string, acceptedBidId: string): Promise<void> {
  if (!firestore) {
    throw new Error("Firestore is not configured");
  }

  const allBids = await getTaskBids(taskId);
  await Promise.all(
    allBids
      .filter((bid) => bid.id !== acceptedBidId)
      .map((bid) =>
        updateDoc(doc(firestore, "bids", bid.id), {
          status: "rejected",
          updatedAt: serverTimestamp(),
        }),
      ),
  );
}

export async function updateBidStatus(
  bidId: string,
  status: "pending" | "accepted" | "rejected" | "withdrawn",
): Promise<void> {
  if (!firestore) {
    throw new Error("Firestore is not configured");
  }

  await updateDoc(doc(firestore, "bids", bidId), {
    status,
    updatedAt: serverTimestamp(),
  });
}

export async function counterBid(
  bidId: string,
  amount: number,
  note: string,
): Promise<void> {
  if (!firestore) {
    throw new Error("Firestore is not configured");
  }

  await updateDoc(doc(firestore, "bids", bidId), {
    amount,
    note,
    status: "pending",
    updatedAt: serverTimestamp(),
  });

  const bidRef = doc(firestore, "bids", bidId);
  const snap = await getDoc(bidRef);
  const row = snap.data() as BidDoc | undefined;
  if (row?.helperId) {
    await notify(row.helperId, {
      type: "bid_countered",
      title: "Counter offer received",
      body: `User sent a counter offer of INR ${amount}`,
      ref: { taskId: row.taskId, bidId },
    });
  }
}
