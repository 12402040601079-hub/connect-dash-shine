import { AppLayout } from "@/components/AppLayout";
import { GlassCard } from "@/components/GlassCard";
import { mockBids, mockTasks, mockUsers } from "@/data/mockData";
import { motion } from "framer-motion";
import { DollarSign, User, Clock, Check, X } from "lucide-react";

export default function Marketplace() {
  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold text-foreground">Bidding Marketplace</h1>
          <p className="text-muted-foreground mt-1">Manage bids on your tasks</p>
        </motion.div>

        {mockTasks.filter(t => t.status === "open").map((task, ti) => {
          const taskBids = mockBids.filter(b => b.taskId === task.id);
          if (taskBids.length === 0) return null;

          return (
            <GlassCard key={task.id} delay={ti * 0.1} hover={false}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-display font-semibold text-lg text-foreground">{task.title}</h3>
                  <p className="text-sm text-muted-foreground">Budget: ${task.price}</p>
                </div>
                <span className="text-xs bg-emerald-500/10 text-emerald-500 rounded-full px-3 py-1 font-medium">
                  {taskBids.length} bid{taskBids.length > 1 ? "s" : ""}
                </span>
              </div>

              <div className="space-y-3">
                {taskBids.map((bid, i) => {
                  const helper = mockUsers.find(u => u.id === bid.helperId);
                  return (
                    <motion.div
                      key={bid.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="glass-card rounded-xl p-4 flex items-center gap-4"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-foreground">{helper?.name}</div>
                        <div className="text-sm text-muted-foreground truncate">{bid.message}</div>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />{bid.amount}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            ⭐ {helper?.rating}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center hover:bg-emerald-500/20 transition-colors">
                          <Check className="w-4 h-4" />
                        </button>
                        <button className="w-9 h-9 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center hover:bg-destructive/20 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </GlassCard>
          );
        })}
      </div>
    </AppLayout>
  );
}
