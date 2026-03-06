import type { Timestamp } from "firebase/firestore";

export type UserRole = "user" | "helper";
export type TaskStatus =
  | "open"
  | "accepted"
  | "in_progress"
  | "completion_requested"
  | "completed"
  | "closed"
  | "cancelled";

export type BidStatus = "pending" | "accepted" | "rejected" | "withdrawn";

export type TaskCategory =
  | "Tutoring"
  | "Cleaning"
  | "Repair"
  | "Grocery Help"
  | "Digital Help"
  | string;

export type GeoPointShape = {
  city: string;
  lat: number;
  lng: number;
  geohash?: string;
};

export type Availability = {
  weekdays: string[];
  startHour: number;
  endHour: number;
  timezone: string;
};

export type ProfileDoc = {
  name: string;
  email: string;
  phone: string;
  age: string;
  gender: string;
  address: string;
  bio: string;
  interests: string[];
  role: UserRole;
  joinedDate: string;
  joinedFull: string;
  location?: GeoPointShape;
  helperMeta?: {
    skills: string[];
    availability: Availability;
    experienceYears: number;
    verified: boolean;
    isSuspended: boolean;
  };
  stats?: {
    completedCount: number;
    ratingAvg: number;
    ratingCount: number;
  };
  updatedAt?: Timestamp;
};

export type TaskDoc = {
  title: string;
  description: string;
  category: TaskCategory;
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
  acceptedBy: string | null;
  acceptedBidId: string | null;
  status: TaskStatus;
  paymentStatus?: "pending" | "paid";
  paymentMethod?: "upi_qr" | "card" | "netbanking" | string;
  recommendedHelpers: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
  completedAt?: Timestamp;
  paymentCompletedAt?: Timestamp;
};

export type BidDoc = {
  taskId: string;
  helperId: string;
  helperName: string;
  posterId: string;
  amount: number;
  note: string;
  status: BidStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

export type RatingDoc = {
  taskId: string;
  fromUserId: string;
  toUserId: string;
  stars: number;
  review: string;
  createdAt: Timestamp;
};

export type NotificationType =
  | "bid_received"
  | "bid_accepted"
  | "bid_countered"
  | "task_accepted"
  | "payment_confirmed"
  | "task_payment_received"
  | "completion_requested"
  | "task_completed"
  | "rating_received"
  | "admin_alert";

export type NotificationDoc = {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  ref: {
    taskId?: string;
    bidId?: string;
    conversationId?: string;
  };
  read: boolean;
  createdAt: Timestamp;
};

export type ReportDoc = {
  reporterId: string;
  againstUserId?: string;
  taskId?: string;
  reason: string;
  details: string;
  status: "open" | "investigating" | "resolved" | "dismissed";
  actionTaken?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};
