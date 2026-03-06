import { describe, expect, it } from "vitest";

import {
  TASK_STATUS,
  canAccept,
  canConfirmCompletion,
  canRequestCompletion,
  canTransition,
} from "@/lib/taskStatus";

describe("task status transitions", () => {
  it("allows open to accepted", () => {
    expect(canTransition(TASK_STATUS.OPEN, TASK_STATUS.ACCEPTED)).toBe(true);
    expect(canAccept(TASK_STATUS.OPEN)).toBe(true);
  });

  it("blocks completed back to open", () => {
    expect(canTransition(TASK_STATUS.COMPLETED, TASK_STATUS.OPEN)).toBe(false);
  });

  it("allows completion request only from accepted/in_progress", () => {
    expect(canRequestCompletion(TASK_STATUS.ACCEPTED)).toBe(true);
    expect(canRequestCompletion(TASK_STATUS.IN_PROGRESS)).toBe(true);
    expect(canRequestCompletion(TASK_STATUS.OPEN)).toBe(false);
  });

  it("allows confirm completion only from completion_requested", () => {
    expect(canConfirmCompletion(TASK_STATUS.COMPLETION_REQUESTED)).toBe(true);
    expect(canConfirmCompletion(TASK_STATUS.ACCEPTED)).toBe(false);
  });
});
