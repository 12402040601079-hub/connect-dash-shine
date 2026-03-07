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
      lastMovedBy: "helper",
      helperAcceptedCounter: false,
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

export function watchHelperBids(
  helperId: string,
  onData: (rows: Array<BidDoc & { id: string }>) => void,
): () => void {
  if (!firestore) {
    onData([]);
    return () => undefined;
  }

  const q = query(collection(firestore, "bids"), where("helperId", "==", helperId), orderBy("updatedAt", "desc"));
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
  fromHelper?: boolean,
  expectedTaskId?: string,
): Promise<void> {
  if (!firestore) {
    throw new Error("Firestore is not configured");
  }

  const bidRef = doc(firestore, "bids", bidId);
  const snap = await getDoc(bidRef);
  const row = snap.data() as BidDoc | undefined;
  if (!row) {
    throw new Error("Bid not found");
  }

  // Guard counter-offers against task drift by validating the original task id.
  if (expectedTaskId && row.taskId !== expectedTaskId) {
    throw new Error("Counter offer task mismatch");
  }

  await updateDoc(bidRef, {
    taskId: row.taskId,
    amount,
    note,
    status: "pending",
    lastMovedBy: fromHelper ? "helper" : "poster",
    helperAcceptedCounter: false,
    updatedAt: serverTimestamp(),
  });
  
  if (fromHelper && row?.posterId) {
    // Helper countering back to user
    await notify(row.posterId, {
      type: "bid_countered",
      title: "Helper sent counter offer",
      body: `${row.helperName} counter-offered INR ${amount}`,
      ref: { taskId: row.taskId, bidId },
    });
  } else if (row?.helperId) {
    // User countering to helper
    await notify(row.helperId, {
      type: "bid_countered",
      title: "Counter offer received",
      body: `User sent a counter offer of INR ${amount}`,
      ref: { taskId: row.taskId, bidId },
    });
  }
}

/**
 * Helper agrees to the user's counter-offer without immediately starting the task.
 * Sets helperAcceptedCounter:true so the user gets a final Accept/Reject prompt.
 */
export async function helperAcceptCounter(
  bidId: string,
  amount: number,
  helperName: string,
  taskId: string,
  posterId: string,
): Promise<void> {
  if (!firestore) {
    throw new Error("Firestore is not configured");
  }

  const bidRef = doc(firestore, "bids", bidId);
  await updateDoc(bidRef, {
    lastMovedBy: "helper",
    helperAcceptedCounter: true,
    updatedAt: serverTimestamp(),
  });

  await notify(posterId, {
    type: "bid_countered",
    title: "Helper accepted your counter offer!",
    body: `${helperName} agreed to INR ${amount}. Please confirm to start the task.`,
    ref: { taskId, bidId },
  });
}
