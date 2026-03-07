import {
  deleteDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { firestore } from "@/integrations/firebase/client";
import { notify } from "@/services/notifications";
import type { RatingDoc } from "@/lib/firestoreSchema";

type SubmitRatingInput = {
  taskId: string;
  fromUserId: string;
  toUserId: string;
  stars: number;
  review: string;
};

export async function submitRating(input: SubmitRatingInput): Promise<void> {
  if (!firestore) {
    throw new Error("Firestore is not configured");
  }

  const ratingId = `${input.taskId}_${input.fromUserId}_${input.toUserId}`;
  const reciprocalRatingId = `${input.taskId}_${input.toUserId}_${input.fromUserId}`;
  await runTransaction(firestore, async (tx) => {
    const ratingRef = doc(firestore, "ratings", ratingId);
    const profileRef = doc(firestore, "profiles", input.toUserId);

    const existing = await tx.get(ratingRef);
    if (existing.exists()) {
      throw new Error("Rating already submitted for this task and user pair");
    }

    // Firestore transactions require all reads before writes.
    const profileSnap = await tx.get(profileRef);
    const profileData = profileSnap.exists() ? profileSnap.data() : {};
    const currentStats = profileData?.stats ?? { completedCount: 0, ratingAvg: 0, ratingCount: 0 };
    const nextCount = Number(currentStats.ratingCount || 0) + 1;
    const currentAvg = Number(currentStats.ratingAvg || 0);
    const nextAvg = (currentAvg * (nextCount - 1) + input.stars) / nextCount;

    tx.set(ratingRef, {
      taskId: input.taskId,
      fromUserId: input.fromUserId,
      toUserId: input.toUserId,
      stars: input.stars,
      review: input.review,
      createdAt: serverTimestamp(),
    });

    tx.set(
      profileRef,
      {
        stats: {
          completedCount: Number(currentStats.completedCount || 0),
          ratingCount: nextCount,
          ratingAvg: Number(nextAvg.toFixed(2)),
        },
      },
      { merge: true },
    );
  });

  await notify(input.toUserId, {
    type: "rating_received",
    title: "New rating received",
    body: `You received ${input.stars} star${input.stars > 1 ? "s" : ""}.`,
    ref: { taskId: input.taskId },
  });

  const reciprocalRef = doc(firestore, "ratings", reciprocalRatingId);
  const reciprocalSnap = await getDoc(reciprocalRef);
  if (reciprocalSnap.exists()) {
    await cleanupTaskSessionAfterMutualRatings(input.taskId);
  }
}

async function cleanupTaskSessionAfterMutualRatings(taskId: string): Promise<void> {
  if (!firestore) return;

  const conversationSnap = await getDocs(query(collection(firestore, "conversations"), where("taskId", "==", taskId)));

  // Lock the chat permanently — preserve all message history but disable new messages.
  await Promise.all(
    conversationSnap.docs.map((conversationDoc) =>
      updateDoc(conversationDoc.ref, {
        sessionStatus: "closed",
        sessionCloseReason: "mutual_ratings",
        updatedAt: serverTimestamp(),
      }).catch(() => undefined),
    ),
  );

  // Clean up all task-related notifications so inboxes stay clear.
  const notificationSnap = await getDocs(query(collection(firestore, "notifications"), where("ref.taskId", "==", taskId)));
  await Promise.all(notificationSnap.docs.map((row) => deleteDoc(row.ref).catch(() => undefined)));
}

export async function getRatingsForHelper(helperId: string): Promise<Array<RatingDoc & { id: string }>> {
  if (!firestore) {
    return [];
  }

  const q = query(collection(firestore, "ratings"), where("toUserId", "==", helperId), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as RatingDoc) }));
}
