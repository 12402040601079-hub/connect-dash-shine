import { describe, expect, it } from "vitest";

import { rankHelpersForTask } from "@/lib/matching";
import type { ProfileDoc, TaskDoc } from "@/lib/firestoreSchema";

describe("rankHelpersForTask", () => {
  it("ranks helpers by composite score", () => {
    const task = {
      category: "Repair",
      schedule: { date: "2026-03-07", time: "10:00" },
      location: { address: "A", city: "X", lat: 12.9716, lng: 77.5946 },
      requiredSkills: ["repair"],
    } as TaskDoc & { requiredSkills: string[] };

    const helpers: Array<ProfileDoc & { id: string }> = [
      {
        id: "h1",
        name: "Near Skilled",
        email: "h1@example.com",
        phone: "",
        age: "",
        gender: "",
        address: "",
        bio: "",
        interests: [],
        role: "helper",
        joinedDate: "",
        joinedFull: "",
        location: { city: "X", lat: 12.972, lng: 77.595 },
        helperMeta: {
          skills: ["repair", "digital help"],
          availability: { weekdays: ["friday", "saturday"], startHour: 8, endHour: 18, timezone: "Asia/Kolkata" },
          experienceYears: 3,
          verified: true,
          isSuspended: false,
        },
        stats: { completedCount: 10, ratingAvg: 4.8, ratingCount: 20 },
      },
      {
        id: "h2",
        name: "Far Low Skill",
        email: "h2@example.com",
        phone: "",
        age: "",
        gender: "",
        address: "",
        bio: "",
        interests: [],
        role: "helper",
        joinedDate: "",
        joinedFull: "",
        location: { city: "Y", lat: 13.2, lng: 77.0 },
        helperMeta: {
          skills: ["cleaning"],
          availability: { weekdays: ["monday"], startHour: 18, endHour: 20, timezone: "Asia/Kolkata" },
          experienceYears: 1,
          verified: false,
          isSuspended: false,
        },
        stats: { completedCount: 2, ratingAvg: 3.2, ratingCount: 3 },
      },
    ];

    const ranked = rankHelpersForTask(task, helpers);

    expect(ranked).toHaveLength(2);
    expect(ranked[0]?.helperId).toBe("h1");
    expect(ranked[0]?.score).toBeGreaterThan(ranked[1]?.score ?? 0);
  });
});
