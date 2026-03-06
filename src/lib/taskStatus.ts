import type { TaskStatus } from "@/lib/firestoreSchema";

const ALLOWED_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  open: ["accepted", "cancelled"],
  accepted: ["in_progress", "completion_requested", "cancelled"],
  in_progress: ["completion_requested", "cancelled"],
  completion_requested: ["completed", "in_progress"],
  completed: ["closed"],
  closed: [],
  cancelled: [],
};

export const TASK_STATUS = {
  OPEN: "open",
  ACCEPTED: "accepted",
  IN_PROGRESS: "in_progress",
  COMPLETION_REQUESTED: "completion_requested",
  COMPLETED: "completed",
  CLOSED: "closed",
  CANCELLED: "cancelled",
} as const;

export function canTransition(from: TaskStatus, to: TaskStatus): boolean {
  return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}

export function canAccept(status: TaskStatus): boolean {
  return status === TASK_STATUS.OPEN;
}

export function canRequestCompletion(status: TaskStatus): boolean {
  return status === TASK_STATUS.ACCEPTED || status === TASK_STATUS.IN_PROGRESS;
}

export function canConfirmCompletion(status: TaskStatus): boolean {
  return status === TASK_STATUS.COMPLETION_REQUESTED;
}
