import { User, Task, Bid, Message } from "./types";

export const mockUsers: User[] = [
  { id: "1", name: "Alex Rivera", email: "alex@demo.com", phone: "+1234567890", role: "poster", interests: ["Design", "Writing"], rating: 4.8, joinedDate: "2024-06-15", avatar: "" },
  { id: "2", name: "Jordan Chen", email: "jordan@demo.com", phone: "+1234567891", role: "helper", interests: ["Delivery", "Handyman", "Tech"], rating: 4.9, joinedDate: "2024-03-20", avatar: "" },
  { id: "3", name: "Sam Patel", email: "sam@demo.com", phone: "+1234567892", role: "helper", interests: ["Cleaning", "Moving"], rating: 4.6, joinedDate: "2024-09-01", avatar: "" },
];

export const mockTasks: Task[] = [
  { id: "1", title: "Help me move a couch", description: "Need someone to help carry a couch to 2nd floor apartment", price: 45, location: { lat: 40.7128, lng: -74.006, address: "123 Main St, NYC" }, status: "open", posterId: "1", category: "Moving", createdAt: "2026-03-01" },
  { id: "2", title: "Dog walking for the afternoon", description: "Walk my golden retriever for ~2 hours in Central Park", price: 30, location: { lat: 40.7829, lng: -73.9654, address: "Central Park, NYC" }, status: "open", posterId: "1", category: "Pet Care", createdAt: "2026-03-02" },
  { id: "3", title: "Fix leaky kitchen faucet", description: "Kitchen sink faucet dripping constantly, need it repaired", price: 60, location: { lat: 40.7484, lng: -73.9857, address: "456 Park Ave, NYC" }, status: "in_progress", posterId: "1", category: "Handyman", createdAt: "2026-02-28" },
  { id: "4", title: "Assemble IKEA bookshelf", description: "BILLY bookshelf needs assembly, instructions included", price: 35, location: { lat: 40.7589, lng: -73.9851, address: "789 Broadway, NYC" }, status: "open", posterId: "1", category: "Assembly", createdAt: "2026-03-03" },
  { id: "5", title: "Grocery pickup & delivery", description: "Pick up grocery order from Whole Foods and deliver to my place", price: 20, location: { lat: 40.7355, lng: -73.9911, address: "95 E Houston St, NYC" }, status: "completed", posterId: "1", category: "Delivery", createdAt: "2026-02-25" },
];

export const mockBids: Bid[] = [
  { id: "1", taskId: "1", helperId: "2", amount: 40, message: "I have a truck and can help. Available now!", status: "pending", createdAt: "2026-03-01" },
  { id: "2", taskId: "1", helperId: "3", amount: 45, message: "Experienced mover here. Can bring a dolly.", status: "pending", createdAt: "2026-03-01" },
  { id: "3", taskId: "2", helperId: "2", amount: 25, message: "Love dogs! Would be happy to walk yours.", status: "accepted", createdAt: "2026-03-02" },
];

export const mockMessages: Message[] = [
  { id: "1", senderId: "1", receiverId: "2", text: "Hey, can you come at 3pm?", timestamp: "2026-03-03T15:00:00" },
  { id: "2", senderId: "2", receiverId: "1", text: "Sure! I'll be there. Should I bring any tools?", timestamp: "2026-03-03T15:02:00" },
  { id: "3", senderId: "1", receiverId: "2", text: "Nope, just yourself. The couch isn't too heavy.", timestamp: "2026-03-03T15:05:00" },
  { id: "4", senderId: "2", receiverId: "1", text: "Sounds good! See you then 👍", timestamp: "2026-03-03T15:06:00" },
];
