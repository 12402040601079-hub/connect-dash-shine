import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { cert, initializeApp } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

function loadDotEnv(filepath) {
  if (!fs.existsSync(filepath)) return;
  const raw = fs.readFileSync(filepath, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadDotEnv(path.resolve(projectRoot, ".env"));

const serviceAccountPathRaw =
  process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
  process.env.GOOGLE_APPLICATION_CREDENTIALS;

if (!serviceAccountPathRaw) {
  throw new Error("Missing service account path. Set FIREBASE_SERVICE_ACCOUNT_PATH or GOOGLE_APPLICATION_CREDENTIALS.");
}

const serviceAccountPath = path.isAbsolute(serviceAccountPathRaw)
  ? serviceAccountPathRaw
  : path.resolve(projectRoot, serviceAccountPathRaw);

if (!fs.existsSync(serviceAccountPath)) {
  throw new Error(`Service account file not found: ${serviceAccountPath}`);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

initializeApp({
  credential: cert(serviceAccount),
  projectId: serviceAccount.project_id,
});

const db = getFirestore();
const now = new Date();
const minutesAgo = (n) => Timestamp.fromDate(new Date(now.getTime() - n * 60_000));

const profiles = [
  {
    id: "seed-requester-rahul",
    role: "requester",
    name: "Rahul M.",
    email: "rahul.seed@example.com",
    phone: "+919876500001",
    age: "27",
    gender: "Male",
    address: "Alkapuri, Vadodara",
    bio: "Need reliable helpers for home and study tasks.",
    interests: ["Tutoring", "Digital Help"],
    location: { city: "Vadodara", lat: 22.3072, lng: 73.1812 },
    helperMeta: undefined,
    stats: { completedCount: 3, ratingAvg: 4.7, ratingCount: 3 },
  },
  {
    id: "seed-requester-sneha",
    role: "requester",
    name: "Sneha K.",
    email: "sneha.seed@example.com",
    phone: "+919876500002",
    age: "25",
    gender: "Female",
    address: "Manjalpur, Vadodara",
    bio: "Looking for fast repairs and delivery help.",
    interests: ["Repair", "Grocery Help"],
    location: { city: "Vadodara", lat: 22.2802, lng: 73.2022 },
    helperMeta: undefined,
    stats: { completedCount: 2, ratingAvg: 4.5, ratingCount: 2 },
  },
  {
    id: "seed-both-dev",
    role: "both",
    name: "Dev R.",
    email: "dev.seed@example.com",
    phone: "+919876500003",
    age: "29",
    gender: "Male",
    address: "Fatehgunj, Vadodara",
    bio: "Can help with tech and also post occasional tasks.",
    interests: ["Digital Help", "Drone Setup"],
    location: { city: "Vadodara", lat: 22.336, lng: 73.168 },
    helperMeta: {
      skills: ["Digital Help", "Drone Setup"],
      availability: { weekdays: ["monday", "wednesday", "friday"], startHour: 10, endHour: 19, timezone: "Asia/Kolkata" },
      experienceYears: 4,
      verified: true,
      isSuspended: false,
    },
    stats: { completedCount: 9, ratingAvg: 4.8, ratingCount: 11 },
  },
  {
    id: "seed-helper-raj",
    role: "helper",
    name: "Raj Patel",
    email: "raj.helper@example.com",
    phone: "+919876500010",
    age: "31",
    gender: "Male",
    address: "Karelibaug, Vadodara",
    bio: "Repair specialist with laptop and WiFi expertise.",
    interests: ["Repair", "Digital Help"],
    location: { city: "Vadodara", lat: 22.3231, lng: 73.1972 },
    helperMeta: {
      skills: ["Repair", "Digital Help"],
      availability: { weekdays: ["monday", "tuesday", "thursday", "saturday"], startHour: 9, endHour: 20, timezone: "Asia/Kolkata" },
      experienceYears: 6,
      verified: true,
      isSuspended: false,
    },
    stats: { completedCount: 21, ratingAvg: 4.9, ratingCount: 25 },
  },
  {
    id: "seed-helper-priya",
    role: "helper",
    name: "Priya Sharma",
    email: "priya.helper@example.com",
    phone: "+919876500011",
    age: "28",
    gender: "Female",
    address: "Gotri, Vadodara",
    bio: "Tutor for board exams and foundational math.",
    interests: ["Tutoring", "Other: SAT Prep"],
    location: { city: "Vadodara", lat: 22.3274, lng: 73.158 },
    helperMeta: {
      skills: ["Tutoring", "SAT Prep"],
      availability: { weekdays: ["tuesday", "wednesday", "friday", "sunday"], startHour: 8, endHour: 18, timezone: "Asia/Kolkata" },
      experienceYears: 5,
      verified: true,
      isSuspended: false,
    },
    stats: { completedCount: 14, ratingAvg: 4.7, ratingCount: 17 },
  },
];

const tasks = [
  {
    id: "task_math_tutor",
    title: "Math Tutor Needed",
    description: "Need a patient math tutor for Class 10 board prep. 3 sessions/week.",
    category: "Tutoring",
    location: { address: "Alkapuri, Vadodara", city: "Vadodara", lat: 22.3072, lng: 73.1812 },
    schedule: { date: "2026-03-08", time: "17:00" },
    paymentOptional: 700,
    posterId: "seed-requester-rahul",
    posterName: "Rahul M.",
    acceptedBy: null,
    acceptedBidId: null,
    status: "open",
    recommendedHelpers: ["seed-helper-priya", "seed-both-dev"],
    createdAt: minutesAgo(90),
    updatedAt: minutesAgo(90),
  },
  {
    id: "task_laptop_wifi",
    title: "Laptop WiFi Repair",
    description: "WiFi stopped working after update. Need diagnosis and fix.",
    category: "Repair",
    location: { address: "Manjalpur, Vadodara", city: "Vadodara", lat: 22.2802, lng: 73.2022 },
    schedule: { date: "2026-03-07", time: "15:00" },
    paymentOptional: 500,
    posterId: "seed-requester-sneha",
    posterName: "Sneha K.",
    acceptedBy: "seed-helper-raj",
    acceptedBidId: "task_laptop_wifi_seed-helper-raj",
    status: "accepted",
    recommendedHelpers: ["seed-helper-raj", "seed-both-dev"],
    createdAt: minutesAgo(120),
    updatedAt: minutesAgo(45),
  },
  {
    id: "task_drone_setup",
    title: "Need Drone Setup Help",
    description: "Bought a drone and need help with safe setup + first calibration.",
    category: "Other - Drone Setup",
    location: { address: "Fatehgunj, Vadodara", city: "Vadodara", lat: 22.336, lng: 73.168 },
    schedule: { date: "2026-03-09", time: "11:30" },
    paymentOptional: 950,
    posterId: "seed-requester-rahul",
    posterName: "Rahul M.",
    acceptedBy: null,
    acceptedBidId: null,
    status: "open",
    recommendedHelpers: ["seed-both-dev"],
    createdAt: minutesAgo(35),
    updatedAt: minutesAgo(35),
  },
  {
    id: "task_grocery_delivery",
    title: "Grocery Pickup",
    description: "Pick up groceries from nearby store and deliver by evening.",
    category: "Grocery Help",
    location: { address: "Karelibaug, Vadodara", city: "Vadodara", lat: 22.3231, lng: 73.1972 },
    schedule: { date: "2026-03-07", time: "18:00" },
    paymentOptional: 250,
    posterId: "seed-both-dev",
    posterName: "Dev R.",
    acceptedBy: null,
    acceptedBidId: null,
    status: "open",
    recommendedHelpers: ["seed-helper-raj"],
    createdAt: minutesAgo(20),
    updatedAt: minutesAgo(20),
  },
];

const bids = [
  {
    id: "task_laptop_wifi_seed-helper-raj",
    taskId: "task_laptop_wifi",
    helperId: "seed-helper-raj",
    helperName: "Raj Patel",
    posterId: "seed-requester-sneha",
    amount: 500,
    note: "I can come by 3 PM with tools.",
    status: "accepted",
    createdAt: minutesAgo(60),
    updatedAt: minutesAgo(45),
  },
  {
    id: "task_math_tutor_seed-helper-priya",
    taskId: "task_math_tutor",
    helperId: "seed-helper-priya",
    helperName: "Priya Sharma",
    posterId: "seed-requester-rahul",
    amount: 700,
    note: "Board exam tutoring experience for 5+ years.",
    status: "pending",
    createdAt: minutesAgo(70),
    updatedAt: minutesAgo(70),
  },
  {
    id: "task_drone_setup_seed-both-dev",
    taskId: "task_drone_setup",
    helperId: "seed-both-dev",
    helperName: "Dev R.",
    posterId: "seed-requester-rahul",
    amount: 900,
    note: "I can help with full calibration and first-flight checks.",
    status: "pending",
    createdAt: minutesAgo(25),
    updatedAt: minutesAgo(25),
  },
];

const ratings = [
  {
    id: "task_completed_001_seed-requester-sneha_seed-helper-raj",
    taskId: "task_completed_001",
    fromUserId: "seed-requester-sneha",
    toUserId: "seed-helper-raj",
    stars: 5,
    review: "Excellent and quick support.",
    createdAt: minutesAgo(400),
  },
];

const notifications = [
  {
    id: "n1",
    userId: "seed-helper-raj",
    type: "bid_accepted",
    title: "Your bid was accepted",
    body: "You were selected for Laptop WiFi Repair.",
    ref: { taskId: "task_laptop_wifi", bidId: "task_laptop_wifi_seed-helper-raj" },
    read: false,
    createdAt: minutesAgo(40),
  },
  {
    id: "n2",
    userId: "seed-requester-sneha",
    type: "task_accepted",
    title: "Helper assigned",
    body: "Raj Patel is now assigned to your task.",
    ref: { taskId: "task_laptop_wifi", bidId: "task_laptop_wifi_seed-helper-raj" },
    read: true,
    createdAt: minutesAgo(39),
  },
];

const reports = [
  {
    id: "r1",
    reporterId: "seed-requester-rahul",
    againstUserId: "seed-helper-raj",
    reason: "Late arrival",
    details: "Helper arrived 45 minutes late without prior notice.",
    status: "open",
    createdAt: minutesAgo(300),
    updatedAt: minutesAgo(300),
  },
];

const convIdForTask = (taskId, uidA, uidB) => {
  const sorted = [uidA, uidB].sort();
  return `${taskId}_${sorted[0]}_${sorted[1]}`;
};

const conversations = [
  {
    taskId: "task_laptop_wifi",
    uidA: "seed-helper-raj",
    uidB: "seed-requester-sneha",
    taskTitle: "Laptop WiFi Repair",
    participantNames: {
      "seed-helper-raj": "Raj Patel",
      "seed-requester-sneha": "Sneha K.",
    },
    lastMessage: "I can be there at 3 PM, please share exact building gate.",
    lastMessageAt: minutesAgo(34),
    messages: [
      { senderId: "seed-helper-raj", senderName: "Raj Patel", text: "Hi! I can help with the WiFi issue.", createdAt: minutesAgo(38) },
      { senderId: "seed-requester-sneha", senderName: "Sneha K.", text: "Great, can you come today?", createdAt: minutesAgo(37) },
      { senderId: "seed-helper-raj", senderName: "Raj Patel", text: "I can be there at 3 PM, please share exact building gate.", createdAt: minutesAgo(34) },
    ],
  },
];

async function seed() {
  const batch = db.batch();

  for (const p of profiles) {
    batch.set(
      db.collection("profiles").doc(p.id),
      {
        name: p.name,
        email: p.email,
        phone: p.phone,
        age: p.age,
        gender: p.gender,
        address: p.address,
        bio: p.bio,
        interests: p.interests,
        role: p.role,
        joinedDate: "6 March 2026",
        joinedFull: now.toISOString(),
        location: p.location,
        helperMeta: p.helperMeta || null,
        stats: p.stats,
        onboardingComplete: true,
        updatedAt: Timestamp.now(),
      },
      { merge: true },
    );
  }

  for (const task of tasks) {
    const { id, ...data } = task;
    batch.set(db.collection("tasks").doc(id), data, { merge: true });
  }

  for (const bid of bids) {
    const { id, ...data } = bid;
    batch.set(db.collection("bids").doc(id), data, { merge: true });
  }

  for (const rating of ratings) {
    const { id, ...data } = rating;
    batch.set(db.collection("ratings").doc(id), data, { merge: true });
  }

  for (const note of notifications) {
    const { id, ...data } = note;
    batch.set(db.collection("notifications").doc(id), data, { merge: true });
  }

  for (const report of reports) {
    const { id, ...data } = report;
    batch.set(db.collection("reports").doc(id), data, { merge: true });
  }

  await batch.commit();

  for (const conv of conversations) {
    const id = convIdForTask(conv.taskId, conv.uidA, conv.uidB);
    const participants = [conv.uidA, conv.uidB].sort();
    await db.collection("conversations").doc(id).set(
      {
        taskId: conv.taskId,
        taskTitle: conv.taskTitle,
        participants,
        participantNames: conv.participantNames,
        createdAt: conv.messages[0]?.createdAt || minutesAgo(120),
        updatedAt: conv.lastMessageAt,
        lastMessage: conv.lastMessage,
        lastMessageAt: conv.lastMessageAt,
      },
      { merge: true },
    );

    for (let i = 0; i < conv.messages.length; i += 1) {
      await db.collection("conversations").doc(id).collection("messages").doc(`m${i + 1}`).set(conv.messages[i], { merge: true });
    }
  }

  console.log("Firestore seed completed.");
  console.log(
    `Profiles: ${profiles.length}, Tasks: ${tasks.length}, Bids: ${bids.length}, Ratings: ${ratings.length}, Notifications: ${notifications.length}, Reports: ${reports.length}, Conversations: ${conversations.length}`,
  );
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
