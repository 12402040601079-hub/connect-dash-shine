export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "poster" | "helper" | "both";
  interests: string[];
  rating: number;
  joinedDate: string;
  avatar: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  price: number;
  location: { lat: number; lng: number; address: string };
  status: "open" | "in_progress" | "completed" | "cancelled";
  posterId: string;
  category: string;
  createdAt: string;
}

export interface Bid {
  id: string;
  taskId: string;
  helperId: string;
  amount: number;
  message: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
}
