// Gamification Engine - Helper Levels, XP, Streaks & Addictive Engagement
import confetti from "canvas-confetti";
import { sound } from "./sound";

export type HelperBadge = {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
};

export type GamificationState = {
  xp: number;
  level: number;
  levelTitle: string;
  nextLevelXp: number;
  streakDays: number;
  lastActiveDate: string;
  tasksCompleted: number;
  badges: HelperBadge[];
};

const DEFAULT_BADGES: HelperBadge[] = [
  { id: "first_gig", name: "First Step", icon: "🌱", description: "Completed your first micro-gig", unlocked: true },
  { id: "speedy", name: "Speedy Solver", icon: "⚡", description: "Bidded within 5 minutes of task post", unlocked: true },
  { id: "five_star", name: "5-Star Champion", icon: "⭐", description: "Maintained a 5.0 perfect rating", unlocked: false },
  { id: "community_hero", name: "Community Hero", icon: "🦸‍♂️", description: "Completed 10+ local tasks", unlocked: false },
  { id: "master_pro", name: "Pro Helper", icon: "👑", description: "Reached Level 5 with 1,000+ XP", unlocked: false },
];

const STORAGE_KEY = "microlink_gamification_state";

export function getGamificationState(): GamificationState {
  if (typeof window === "undefined") {
    return {
      xp: 280,
      level: 2,
      levelTitle: "Active Helper",
      nextLevelXp: 500,
      streakDays: 3,
      lastActiveDate: new Date().toISOString().split("T")[0],
      tasksCompleted: 4,
      badges: DEFAULT_BADGES,
    };
  }

  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // ignore
    }
  }

  const initial: GamificationState = {
    xp: 280,
    level: 2,
    levelTitle: "Rising Helper",
    nextLevelXp: 500,
    streakDays: 3,
    lastActiveDate: new Date().toISOString().split("T")[0],
    tasksCompleted: 4,
    badges: DEFAULT_BADGES,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
}

export function addHelperXP(points: number, reason: string): GamificationState {
  const current = getGamificationState();
  const newXp = current.xp + points;

  // Level thresholds: 200, 500, 1000, 2000, 5000
  let level = 1;
  let levelTitle = "Novice Helper";
  let nextLevelXp = 200;

  if (newXp >= 2000) {
    level = 5;
    levelTitle = "Legendary Hero";
    nextLevelXp = 5000;
  } else if (newXp >= 1000) {
    level = 4;
    levelTitle = "Master Specialist";
    nextLevelXp = 2000;
  } else if (newXp >= 500) {
    level = 3;
    levelTitle = "Pro Contributor";
    nextLevelXp = 1000;
  } else if (newXp >= 200) {
    level = 2;
    levelTitle = "Rising Helper";
    nextLevelXp = 500;
  }

  const leveledUp = level > current.level;

  const updated: GamificationState = {
    ...current,
    xp: newXp,
    level,
    levelTitle,
    nextLevelXp,
    tasksCompleted: current.tasksCompleted + 1,
  };

  // Unlock badges dynamically
  updated.badges = updated.badges.map((b) => {
    if (b.id === "community_hero" && updated.tasksCompleted >= 10) return { ...b, unlocked: true };
    if (b.id === "master_pro" && updated.level >= 4) return { ...b, unlocked: true };
    return b;
  });

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  // Trigger sensory celebration
  if (leveledUp) {
    triggerCelebration();
    sound.playSuccess();
  } else {
    sound.playTap();
  }

  return updated;
}

export function triggerCelebration() {
  if (typeof window === "undefined") return;
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#6366f1", "#10b981", "#fbbf24", "#ec4899"],
    });
  } catch {
    // confetti unavailable
  }
}
