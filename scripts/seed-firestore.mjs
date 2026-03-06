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
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
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
  throw new Error(
    "Missing service account path. Set FIREBASE_SERVICE_ACCOUNT_PATH or GOOGLE_APPLICATION_CREDENTIALS."
  );
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
  { id: "seed-user-rahul", name: "Rahul M.", email: "rahul.seed@example.com", role: "user" },
  { id: "seed-user-sneha", name: "Sneha K.", email: "sneha.seed@example.com", role: "user" },
  { id: "seed-user-amit", name: "Amit P.", email: "amit.seed@example.com", role: "user" },
  { id: "seed-user-priya", name: "Priya S.", email: "priya.seed@example.com", role: "user" },
  { id: "seed-user-dev", name: "Dev R.", email: "dev.seed@example.com", role: "user" },
  { id: "seed-user-nisha", name: "Nisha T.", email: "nisha.seed@example.com", role: "user" },
  { id: "seed-helper-raj", name: "Raj Patel", email: "raj.helper@example.com", role: "helper" },
  { id: "seed-helper-priya", name: "Priya Sharma", email: "priya.helper@example.com", role: "helper" },
  { id: "seed-helper-amit", name: "Amit Kumar", email: "amit.helper@example.com", role: "helper" },
  { id: "seed-helper-nisha", name: "Nisha Tiwari", email: "nisha.helper@example.com", role: "helper" },
];

const tasks = [
  {
    id: "task_math_tutor",
    title: "Math Tutor Needed",
    category: "Tutoring",
    budget: 700,
    location: "Alkapuri, Vadodara",
    description: "Need a patient math tutor for Class 10 board prep. 3 sessions/week.",
    urgent: false,
    posterId: "seed-user-rahul",
    posterName: "Rahul M.",
    posterRole: "user",
    status: "open",
    createdAt: minutesAgo(45),
  },
  {
    id: "task_laptop_wifi",
    title: "Laptop WiFi Repair",
    category: "Repair",
    budget: 500,
    location: "Manjalpur, Vadodara",
    description: "WiFi stopped working after an update. Need urgent diagnosis + fix.",
    urgent: true,
    posterId: "seed-user-sneha",
    posterName: "Sneha K.",
    posterRole: "user",
    status: "open",
    createdAt: minutesAgo(60),
  },
  {
    id: "task_grocery_pickup",
    title: "Grocery Pickup",
    category: "Delivery",
    budget: 200,
    location: "Karelibaug",
    description: "Pick up groceries from Reliance Fresh and deliver to my apartment.",
    urgent: false,
    posterId: "seed-user-amit",
    posterName: "Amit P.",
    posterRole: "user",
    status: "open",
    createdAt: minutesAgo(120),
  },
  {
    id: "task_kitchen_sink",
    title: "Kitchen Sink Plumbing",
    category: "Repair",
    budget: 600,
    location: "Gotri",
    description: "Persistent kitchen sink leak. Need experienced plumber ASAP.",
    urgent: true,
    posterId: "seed-user-priya",
    posterName: "Priya S.",
    posterRole: "user",
    status: "open",
    createdAt: minutesAgo(180),
  },
  {
    id: "task_react_help",
    title: "React Developer Help",
    category: "Tech",
    budget: 900,
    location: "Fatehgunj",
    description: "Need help debugging a React app. 2-3 hours of pair programming.",
    urgent: false,
    posterId: "seed-user-dev",
    posterName: "Dev R.",
    posterRole: "user",
    status: "open",
    createdAt: minutesAgo(240),
  },
  {
    id: "task_dog_walk",
    title: "Dog Walking",
    category: "Pet Care",
    budget: 300,
    location: "Sama",
    description: "Walk my Golden Retriever daily for 30 mins. Morning preferred.",
    urgent: false,
    posterId: "seed-user-nisha",
    posterName: "Nisha T.",
    posterRole: "user",
    status: "open",
    createdAt: minutesAgo(300),
  },
];

const bids = [
  {
    id: "task_laptop_wifi_seed-helper-raj",
    taskId: "task_laptop_wifi",
    helperId: "seed-helper-raj",
    helperName: "Raj Patel",
    posterId: "seed-user-sneha",
    amount: 500,
    note: "I can come by today afternoon.",
    status: "pending",
    createdAt: minutesAgo(30),
    updatedAt: minutesAgo(30),
  },
  {
    id: "task_math_tutor_seed-helper-priya",
    taskId: "task_math_tutor",
    helperId: "seed-helper-priya",
    helperName: "Priya Sharma",
    posterId: "seed-user-rahul",
    amount: 700,
    note: "Board exam tutoring experience for 5+ years.",
    status: "pending",
    createdAt: minutesAgo(60),
    updatedAt: minutesAgo(60),
  },
  {
    id: "task_kitchen_sink_seed-helper-amit",
    taskId: "task_kitchen_sink",
    helperId: "seed-helper-amit",
    helperName: "Amit Kumar",
    posterId: "seed-user-priya",
    amount: 800,
    note: "Can carry tools and fix same day.",
    status: "pending",
    createdAt: minutesAgo(120),
    updatedAt: minutesAgo(120),
  },
  {
    id: "task_dog_walk_seed-helper-nisha",
    taskId: "task_dog_walk",
    helperId: "seed-helper-nisha",
    helperName: "Nisha Tiwari",
    posterId: "seed-user-nisha",
    amount: 300,
    note: "Available every evening.",
    status: "pending",
    createdAt: minutesAgo(180),
    updatedAt: minutesAgo(180),
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
    uidB: "seed-user-sneha",
    taskTitle: "Laptop WiFi Repair",
    participantNames: {
      "seed-helper-raj": "Raj Patel",
      "seed-user-sneha": "Sneha K.",
    },
    lastMessage: "I can come by today afternoon around 3 PM. Does that work?",
    lastMessageAt: minutesAgo(34),
    messages: [
      { senderId: "seed-helper-raj", senderName: "Raj Patel", text: "Hello! I saw your task posting for the laptop repair.", createdAt: minutesAgo(38) },
      { senderId: "seed-user-sneha", senderName: "Sneha K.", text: "Hi! Yes, my laptop WiFi isn't working after an update. Can you fix it?", createdAt: minutesAgo(37) },
      { senderId: "seed-helper-raj", senderName: "Raj Patel", text: "Absolutely, I specialise in hardware and driver issues. I have my tools ready.", createdAt: minutesAgo(36) },
      { senderId: "seed-user-sneha", senderName: "Sneha K.", text: "Great! What time works for you today?", createdAt: minutesAgo(35) },
      { senderId: "seed-helper-raj", senderName: "Raj Patel", text: "I can come by today afternoon around 3 PM. Does that work?", createdAt: minutesAgo(34) },
    ],
  },
  {
    taskId: "task_math_tutor",
    uidA: "seed-helper-priya",
    uidB: "seed-user-rahul",
    taskTitle: "Math Tutor Needed",
    participantNames: {
      "seed-helper-priya": "Priya Sharma",
      "seed-user-rahul": "Rahul M.",
    },
    lastMessage: "Thanks for sharing details. I can start this week.",
    lastMessageAt: minutesAgo(80),
    messages: [
      { senderId: "seed-helper-priya", senderName: "Priya Sharma", text: "Hi Rahul, I just placed a bid for your math tutoring task.", createdAt: minutesAgo(95) },
      { senderId: "seed-user-rahul", senderName: "Rahul M.", text: "Great, what grades do you usually teach?", createdAt: minutesAgo(90) },
      { senderId: "seed-helper-priya", senderName: "Priya Sharma", text: "Class 8 to 12, with board exam prep focus.", createdAt: minutesAgo(85) },
      { senderId: "seed-user-rahul", senderName: "Rahul M.", text: "Thanks for sharing details. I can start this week.", createdAt: minutesAgo(80) },
    ],
  },
];

async function seed() {
  const batch = db.batch();

  for (const p of profiles) {
    batch.set(db.collection("profiles").doc(p.id), {
      name: p.name,
      email: p.email,
      phone: "",
      age: "",
      gender: "",
      address: "",
      bio: "",
      interests: [],
      role: p.role,
      joinedDate: "6 March 2026",
      joinedFull: now.toISOString(),
      updatedAt: Timestamp.now(),
    }, { merge: true });
  }

  for (const task of tasks) {
    const { id, ...data } = task;
    batch.set(db.collection("tasks").doc(id), data, { merge: true });
  }

  for (const bid of bids) {
    const { id, ...data } = bid;
    batch.set(db.collection("bids").doc(id), data, { merge: true });
  }

  await batch.commit();

  for (const conv of conversations) {
    const id = convIdForTask(conv.taskId, conv.uidA, conv.uidB);
    const participants = [conv.uidA, conv.uidB].sort();
    await db.collection("conversations").doc(id).set({
      taskId: conv.taskId,
      taskTitle: conv.taskTitle,
      participants,
      participantNames: conv.participantNames,
      createdAt: conv.messages[0]?.createdAt || minutesAgo(120),
      updatedAt: conv.lastMessageAt,
      lastMessage: conv.lastMessage,
      lastMessageAt: conv.lastMessageAt,
    }, { merge: true });

    for (let i = 0; i < conv.messages.length; i += 1) {
      await db.collection("conversations").doc(id).collection("messages").doc(`m${i + 1}`).set(conv.messages[i], { merge: true });
    }
  }

  console.log("Firestore seed completed.");
  console.log(`Profiles: ${profiles.length}, Tasks: ${tasks.length}, Bids: ${bids.length}, Conversations: ${conversations.length}`);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
