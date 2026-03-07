import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { firestore } from "@/integrations/firebase/client";
import { canAccept, canConfirmCompletion, canRequestCompletion } from "@/lib/taskStatus";
import type { TaskDoc, TaskStatus } from "@/lib/firestoreSchema";
import { acceptBid as acceptBidDoc, rejectOtherBids } from "@/services/bids";
import { notify } from "@/services/notifications";

export type CreateTaskInput = {
  title: string;
  description: string;
  category: string;
  location: {
    address: string;
    city: string;
    lat: number;
    lng: number;
    geohash?: string;
  };
  schedule: {
    date: string;
    time: string;
  };
  paymentOptional: number | null;
  posterId: string;
  posterName: string;
  recommendedHelpers?: string[];
};

type TaskWithId = TaskDoc & { id: string };

function assertFirestore() {
  if (!firestore) {
    throw new Error("Firestore is not configured");
  }
}

export async function createTask(input: CreateTaskInput): Promise<string> {
  assertFirestore();

  const { recommendedHelpers = [], ...taskPayload } = input;

  const created = await addDoc(collection(firestore!, "tasks"), {
    ...taskPayload,
    acceptedBy: null,
    acceptedBidId: null,
    status: "open",
    paymentStatus: "pending",
    paymentMethod: null,
    recommendedHelpers,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return created.id;
}

export function watchOpenTasks(onData: (rows: TaskWithId[]) => void): () => void {
  if (!firestore) {
    onData([]);
    return () => undefined;
  }

  const q = query(collection(firestore, "tasks"), where("status", "in", ["open", "accepted", "in_progress", "completion_requested"]), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    onData(snap.docs.map((d) => ({ id: d.id, ...(d.data() as TaskDoc) })));
  });
}

export async function getOpenTasks(): Promise<TaskWithId[]> {
  if (!firestore) {
    return [];
  }

  const q = query(collection(firestore, "tasks"), where("status", "in", ["open", "accepted", "in_progress", "completion_requested"]), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as TaskDoc) }));
}

export function watchMyPostedTasks(userId: string, onData: (rows: TaskWithId[]) => void): () => void {
  if (!firestore) {
    onData([]);
    return () => undefined;
  }

  const q = query(collection(firestore, "tasks"), where("posterId", "==", userId), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snap) => {
    onData(snap.docs.map((d) => ({ id: d.id, ...(d.data() as TaskDoc) })));
  });
}

export async function getMyPostedTasks(userId: string): Promise<TaskWithId[]> {
  if (!firestore) {
    return [];
  }

  const q = query(collection(firestore, "tasks"), where("posterId", "==", userId), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as TaskDoc) }));
}

export async function acceptBid(args: {
  taskId: string;
  bidId: string;
  helperId: string;
  posterId: string;
  currentStatus: TaskStatus;
  taskTitle: string;
}): Promise<void> {
  assertFirestore();

  if (!canAccept(args.currentStatus)) {
    throw new Error("Task can only accept bids while open");
  }

  await updateDoc(doc(firestore!, "tasks", args.taskId), {
    acceptedBy: args.helperId,
    acceptedBidId: args.bidId,
    status: "accepted",
    updatedAt: serverTimestamp(),
  });

  await acceptBidDoc(args.bidId);
  await rejectOtherBids(args.taskId, args.bidId);

  await Promise.all([
    notify(args.helperId, {
      type: "bid_accepted",
      title: "Your bid was accepted",
      body: `You were selected for task: ${args.taskTitle}`,
      ref: { taskId: args.taskId, bidId: args.bidId },
    }),
    notify(args.posterId, {
      type: "task_accepted",
      title: "Helper assigned",
      body: "Task is now accepted and ready for progress updates.",
      ref: { taskId: args.taskId, bidId: args.bidId },
    }),
  ]);
}

export async function requestCompletion(args: {
  taskId: string;
  helperId: string;
  posterId: string;
  currentStatus: TaskStatus;
  taskTitle: string;
}): Promise<void> {
  assertFirestore();

  if (!canRequestCompletion(args.currentStatus)) {
    throw new Error("Task cannot request completion from current state");
  }

  await updateDoc(doc(firestore!, "tasks", args.taskId), {
    status: "completion_requested",
    updatedAt: serverTimestamp(),
  });

  await notify(args.posterId, {
    type: "completion_requested",
    title: "Completion requested",
    body: `Helper marked task as done: ${args.taskTitle}`,
    ref: { taskId: args.taskId },
  });

  await notify(args.helperId, {
    type: "completion_requested",
    title: "Completion request sent",
    body: "Waiting for user confirmation.",
    ref: { taskId: args.taskId },
  });
}

export async function confirmCompletion(args: {
  taskId: string;
  helperId: string;
  posterId: string;
  currentStatus: TaskStatus;
  taskTitle: string;
}): Promise<void> {
  assertFirestore();

  if (!canConfirmCompletion(args.currentStatus)) {
    throw new Error("Task is not ready for completion confirmation");
  }

  await updateDoc(doc(firestore!, "tasks", args.taskId), {
    status: "completed",
    completedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  await Promise.all([
    notify(args.helperId, {
      type: "task_completed",
      title: "Task completed",
      body: `User confirmed completion for ${args.taskTitle}`,
      ref: { taskId: args.taskId },
    }),
    notify(args.posterId, {
      type: "task_completed",
      title: "Task completed",
      body: `You confirmed completion for ${args.taskTitle}`,
      ref: { taskId: args.taskId },
    }),
  ]);
}

export async function cancelTask(args: {
  taskId: string;
  posterId: string;
  currentStatus: TaskStatus;
  taskTitle: string;
  acceptedBy?: string | null;
}): Promise<void> {
  assertFirestore();

  if (["completed", "closed", "cancelled"].includes(args.currentStatus)) {
    throw new Error("This task can no longer be deleted");
  }

  await updateDoc(doc(firestore!, "tasks", args.taskId), {
    status: "cancelled",
    updatedAt: serverTimestamp(),
  });

  await notify(args.posterId, {
    type: "admin_alert",
    title: "Task removed",
    body: `Your task was marked cancelled: ${args.taskTitle}`,
    ref: { taskId: args.taskId },
  });
}

export async function markTaskPaid(args: {
  taskId: string;
  posterId: string;
  helperId: string;
  taskTitle: string;
  method: "upi_qr" | "card" | "netbanking";
}): Promise<void> {
  assertFirestore();

  const taskRef = doc(firestore!, "tasks", args.taskId);
  const liveTaskSnap = await getDoc(taskRef);
  const liveTask = liveTaskSnap.data() as TaskDoc | undefined;

  if (!liveTaskSnap.exists() || !liveTask) {
    throw new Error("Task not found");
  }

  if (["open", "cancelled", "closed"].includes(liveTask.status)) {
    throw new Error("Task is still syncing acceptance. Please retry payment in a few seconds.");
  }

  if (liveTask.paymentStatus === "paid") {
    return;
  }

  // Preserve status for completion-stage tasks; only advance to in_progress from accepted.
  const statusesToPreserve = ["in_progress", "completion_requested", "completed"];
  const nextStatus = statusesToPreserve.includes(liveTask.status) ? liveTask.status : "in_progress";

  await updateDoc(taskRef, {
    paymentStatus: "paid",
    paymentMethod: args.method,
    paymentCompletedAt: serverTimestamp(),
    status: nextStatus,
    updatedAt: serverTimestamp(),
  });

  await Promise.all([
    notify(args.helperId, {
      type: "task_payment_received",
      title: "Payment received",
      body: `Payment for ${args.taskTitle} is successful. Work can start now.`,
      ref: { taskId: args.taskId },
    }),
    notify(args.posterId, {
      type: "payment_confirmed",
      title: "Payment successful",
      body: `Payment completed for ${args.taskTitle}`,
      ref: { taskId: args.taskId },
    }),
  ]);
}
