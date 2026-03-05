import { AppLayout } from "@/components/AppLayout";
import { GlassCard } from "@/components/GlassCard";
import { mockMessages, mockUsers } from "@/data/mockData";
import { motion } from "framer-motion";
import { useState } from "react";
import { Send, Phone, Video, MoreVertical } from "lucide-react";

export default function Chat() {
  const [message, setMessage] = useState("");
  const currentUser = mockUsers[0];
  const otherUser = mockUsers[1];

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-80px)] md:h-screen max-w-3xl mx-auto">
        {/* Chat Header */}
        <div className="glass-card border-b border-border/50 p-4 flex items-center gap-3 rounded-none">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="font-semibold text-primary">{otherUser.name[0]}</span>
          </div>
          <div className="flex-1">
            <div className="font-semibold text-foreground">{otherUser.name}</div>
            <div className="text-xs text-emerald-500">Online</div>
          </div>
          <div className="flex gap-2">
            <button className="w-9 h-9 rounded-xl glass-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
              <Phone className="w-4 h-4" />
            </button>
            <button className="w-9 h-9 rounded-xl glass-card flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
              <Video className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {mockMessages.map((msg, i) => {
            const isMine = msg.senderId === currentUser.id;
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${
                    isMine
                      ? "gradient-btn rounded-br-md"
                      : "glass-card text-foreground rounded-bl-md"
                  }`}
                >
                  {msg.text}
                  <div className={`text-xs mt-1 ${isMine ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Input */}
        <div className="p-4 glass-card border-t border-border/50 rounded-none">
          <div className="flex gap-3">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 glass-card rounded-xl py-3 px-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button className="gradient-btn rounded-xl px-4 flex items-center justify-center">
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
