export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "user" | "helper";
  interests: string[];
  rating: number;
  joinedDate: string;
  avatar: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: string;
  location: { lat: number; lng: number; address: string; city?: string };
  schedule?: { date: string; time: string };
  paymentOptional?: number | null;
  acceptedBy?: string | null;
  acceptedBidId?: string | null;
  status:
    | "open"
    | "accepted"
    | "in_progress"
    | "completion_requested"
    | "completed"
    | "closed"
    | "cancelled";
  posterId: string;
  createdAt: string;
}

export interface Bid {
  id: string;
  taskId: string;
  helperId: string;
  amount: number;
  message: string;
  status: "pending" | "accepted" | "rejected" | "withdrawn";
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
}
