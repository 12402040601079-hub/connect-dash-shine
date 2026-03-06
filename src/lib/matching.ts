import type { ProfileDoc, TaskDoc } from "@/lib/firestoreSchema";

type RankedHelper = {
  helperId: string;
  score: number;
  skillsScore: number;
  distanceScore: number;
  ratingScore: number;
  availabilityScore: number;
};

type TaskWithSkills = TaskDoc & {
  requiredSkills?: string[];
};

function normalize(value: number, max: number): number {
  if (!Number.isFinite(value) || max <= 0) return 0;
  return Math.max(0, Math.min(1, value / max));
}

function scoreSkills(requiredSkills: string[], helperSkills: string[]): number {
  if (requiredSkills.length === 0) return 0.5;
  const required = new Set(requiredSkills.map((s) => s.toLowerCase()));
  const helper = new Set(helperSkills.map((s) => s.toLowerCase()));
  let matched = 0;
  required.forEach((skill) => {
    if (helper.has(skill)) matched += 1;
  });
  return normalize(matched, required.size);
}

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}

export function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const radius = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return radius * c;
}

function scoreDistance(task: TaskWithSkills, helper: ProfileDoc): number {
  const taskLocation = task.location;
  const helperLocation = helper.location;
  if (!taskLocation || !helperLocation) return 0.3;

  const km = distanceKm(taskLocation.lat, taskLocation.lng, helperLocation.lat, helperLocation.lng);
  if (km <= 2) return 1;
  if (km <= 5) return 0.8;
  if (km <= 10) return 0.6;
  if (km <= 20) return 0.4;
  return 0.2;
}

function scoreRating(helper: ProfileDoc): number {
  const avg = helper.stats?.ratingAvg ?? 0;
  return normalize(avg, 5);
}

function scoreAvailability(task: TaskWithSkills, helper: ProfileDoc): number {
  const dateText = task.schedule?.date;
  const timeText = task.schedule?.time;
  const avail = helper.helperMeta?.availability;
  if (!dateText || !timeText || !avail) return 0.4;

  const dayName = new Date(dateText).toLocaleDateString("en-US", { weekday: "long" }).toLowerCase();
  const weekdayMatch = avail.weekdays.map((d) => d.toLowerCase()).includes(dayName);
  const hour = Number(timeText.split(":")[0] ?? 0);
  const hourMatch = hour >= avail.startHour && hour <= avail.endHour;

  if (weekdayMatch && hourMatch) return 1;
  if (weekdayMatch || hourMatch) return 0.6;
  return 0.2;
}

export function rankHelpersForTask(task: TaskWithSkills, helpers: Array<ProfileDoc & { id: string }>): RankedHelper[] {
  const requiredSkills = task.requiredSkills ?? [task.category];

  return helpers
    .map((helper) => {
      const skillsScore = scoreSkills(requiredSkills, helper.helperMeta?.skills ?? []);
      const distanceScore = scoreDistance(task, helper);
      const ratingScore = scoreRating(helper);
      const availabilityScore = scoreAvailability(task, helper);

      const score =
        skillsScore * 0.35 +
        distanceScore * 0.3 +
        ratingScore * 0.2 +
        availabilityScore * 0.15;

      return {
        helperId: helper.id,
        score: Number(score.toFixed(4)),
        skillsScore,
        distanceScore,
        ratingScore,
        availabilityScore,
      };
    })
    .sort((a, b) => b.score - a.score);
}
