import { AppLayout } from "@/components/AppLayout";
import { GlassCard } from "@/components/GlassCard";
import { mockTasks } from "@/data/mockData";
import { motion } from "framer-motion";
import { useState } from "react";
import { MapPin, Search, Filter, DollarSign, Clock } from "lucide-react";

const categories = ["All", "Delivery", "Handyman", "Cleaning", "Moving", "Pet Care", "Assembly", "Tech"];

export default function Discover() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [view, setView] = useState<"list" | "map">("list");

  const filtered = activeCategory === "All"
    ? mockTasks
    : mockTasks.filter((t) => t.category === activeCategory);

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold text-foreground">Discover Tasks</h1>
          <p className="text-muted-foreground mt-1">Find micro-jobs near you</p>
        </motion.div>

        {/* Search Bar */}
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              placeholder="Search tasks..."
              className="w-full glass-card rounded-xl py-3 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <button className="glass-card rounded-xl px-4 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? "gradient-btn"
                  : "glass-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* View Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setView("list")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              view === "list" ? "bg-primary/10 text-primary" : "text-muted-foreground"
            }`}
          >
            List
          </button>
          <button
            onClick={() => setView("map")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              view === "map" ? "bg-primary/10 text-primary" : "text-muted-foreground"
            }`}
          >
            Map
          </button>
        </div>

        {view === "map" ? (
          <GlassCard className="h-80 flex items-center justify-center" hover={false}>
            <div className="text-center">
              <MapPin className="w-12 h-12 text-primary/30 mx-auto mb-3" />
              <p className="text-muted-foreground">Interactive map view</p>
              <p className="text-sm text-muted-foreground/60 mt-1">{filtered.length} tasks in your area</p>
              {/* Simulated pins */}
              <div className="flex justify-center gap-8 mt-6">
                {filtered.slice(0, 3).map((task, i) => (
                  <motion.div
                    key={task.id}
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity }}
                    className="flex flex-col items-center"
                  >
                    <div className="w-8 h-8 rounded-full gradient-btn flex items-center justify-center text-xs font-bold shadow-lg">
                      ${task.price}
                    </div>
                    <div className="w-1 h-3 bg-primary/40 rounded-b-full" />
                  </motion.div>
                ))}
              </div>
            </div>
          </GlassCard>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filtered.map((task, i) => (
              <GlassCard key={task.id} delay={i * 0.08} className="cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    task.status === "open" ? "bg-emerald-500/10 text-emerald-500" :
                    task.status === "in_progress" ? "bg-primary/10 text-primary" :
                    "bg-muted text-muted-foreground"
                  }`}>
                    {task.status === "open" ? "Open" : task.status === "in_progress" ? "In Progress" : "Completed"}
                  </span>
                  <span className="text-xs glass-card rounded-full px-2.5 py-1 text-muted-foreground">{task.category}</span>
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">{task.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{task.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="truncate max-w-[150px]">{task.location.address}</span>
                  </div>
                  <div className="flex items-center gap-1 font-display font-bold text-foreground">
                    <DollarSign className="w-4 h-4 text-accent" />
                    {task.price}
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
