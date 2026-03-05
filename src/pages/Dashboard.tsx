import { AppLayout } from "@/components/AppLayout";
import { GlassCard } from "@/components/GlassCard";
import { mockTasks } from "@/data/mockData";
import { motion } from "framer-motion";
import { Briefcase, DollarSign, Star, TrendingUp, Plus, Search, Bell, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

const stats = [
  { label: "Active Tasks", value: "12", icon: Briefcase, color: "text-primary" },
  { label: "Earnings", value: "$840", icon: DollarSign, color: "text-accent" },
  { label: "Rating", value: "4.8", icon: Star, color: "text-yellow-500" },
  { label: "Completed", value: "47", icon: TrendingUp, color: "text-emerald-500" },
];

const quickActions = [
  { label: "Post a Task", icon: Plus, gradient: "gradient-btn" },
  { label: "Find Tasks", icon: Search, gradient: "bg-accent text-accent-foreground" },
  { label: "Notifications", icon: Bell, gradient: "bg-secondary text-secondary-foreground" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const recentTasks = mockTasks.slice(0, 3);

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold">
            Welcome back, <span className="gradient-text">Alex</span>
          </h1>
          <p className="text-muted-foreground mt-1">Here's what's happening today</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <GlassCard key={stat.label} delay={i * 0.1} className="text-center">
              <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
              <div className="font-display text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </GlassCard>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="font-display text-lg font-semibold mb-4 text-foreground">Quick Actions</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {quickActions.map((action, i) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => action.label === "Find Tasks" ? navigate("/discover") : undefined}
                className={`${action.gradient} rounded-2xl px-6 py-3 font-medium text-sm flex items-center gap-2 whitespace-nowrap`}
              >
                <action.icon className="w-4 h-4" />
                {action.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Recent Tasks */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-lg font-semibold text-foreground">Recent Tasks</h2>
            <button onClick={() => navigate("/discover")} className="text-sm text-primary hover:underline">
              View all
            </button>
          </div>
          <div className="space-y-3">
            {recentTasks.map((task, i) => (
              <GlassCard key={task.id} delay={i * 0.1} className="flex items-center gap-4 cursor-pointer" hover>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  task.status === "open" ? "bg-emerald-500/10 text-emerald-500" :
                  task.status === "in_progress" ? "bg-primary/10 text-primary" :
                  "bg-muted text-muted-foreground"
                }`}>
                  <Briefcase className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-foreground truncate">{task.title}</div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{task.location.address}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-display font-bold text-foreground">${task.price}</div>
                  <div className={`text-xs capitalize px-2 py-0.5 rounded-full ${
                    task.status === "open" ? "bg-emerald-500/10 text-emerald-500" :
                    task.status === "in_progress" ? "bg-primary/10 text-primary" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {task.status.replace("_", " ")}
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
