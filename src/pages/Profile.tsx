import { AppLayout } from "@/components/AppLayout";
import { GlassCard } from "@/components/GlassCard";
import { mockUsers, mockTasks } from "@/data/mockData";
import { motion } from "framer-motion";
import { Star, MapPin, Calendar, Edit, Award, Briefcase, TrendingUp } from "lucide-react";

export default function Profile() {
  const user = mockUsers[0];
  const completedTasks = mockTasks.filter(t => t.status === "completed").length;

  return (
    <AppLayout>
      <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6">
        {/* Profile Header */}
        <GlassCard delay={0} hover={false} className="text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[var(--gradient-primary)] opacity-5" />
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-primary/10 mx-auto mb-4 flex items-center justify-center border-2 border-primary/20">
              <span className="font-display text-3xl font-bold text-primary">{user.name[0]}</span>
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">{user.name}</h1>
            <p className="text-muted-foreground capitalize">{user.role}</p>
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="flex items-center gap-1 text-yellow-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-semibold">{user.rating}</span>
              </div>
              <div className="text-muted-foreground text-sm flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Joined {new Date(user.joinedDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
              </div>
            </div>
            <button className="mt-4 glass-card rounded-xl px-5 py-2 text-sm font-medium text-foreground inline-flex items-center gap-2 hover:bg-primary/10 transition-colors">
              <Edit className="w-4 h-4" /> Edit Profile
            </button>
          </div>
        </GlassCard>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Briefcase, label: "Tasks", value: mockTasks.length },
            { icon: TrendingUp, label: "Completed", value: completedTasks },
            { icon: Award, label: "Reviews", value: 23 },
          ].map((stat, i) => (
            <GlassCard key={stat.label} delay={0.1 + i * 0.1} className="text-center py-4">
              <stat.icon className="w-5 h-5 mx-auto mb-1.5 text-primary" />
              <div className="font-display text-xl font-bold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </GlassCard>
          ))}
        </div>

        {/* Skills */}
        <GlassCard delay={0.3} hover={false}>
          <h3 className="font-display font-semibold text-foreground mb-3">Skills & Interests</h3>
          <div className="flex flex-wrap gap-2">
            {user.interests.map((interest) => (
              <span key={interest} className="px-3 py-1.5 rounded-full text-sm bg-primary/10 text-primary font-medium">
                {interest}
              </span>
            ))}
          </div>
        </GlassCard>

        {/* Reviews */}
        <GlassCard delay={0.4} hover={false}>
          <h3 className="font-display font-semibold text-foreground mb-4">Recent Reviews</h3>
          <div className="space-y-4">
            {[
              { name: "Jordan Chen", rating: 5, text: "Alex was great to work with! Task was completed quickly and professionally.", date: "2 days ago" },
              { name: "Sam Patel", rating: 4, text: "Good communication and on time. Would recommend!", date: "1 week ago" },
            ].map((review, i) => (
              <div key={i} className="glass-card rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-foreground">{review.name}</div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: review.rating }).map((_, j) => (
                      <Star key={j} className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{review.text}</p>
                <p className="text-xs text-muted-foreground/60 mt-2">{review.date}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </AppLayout>
  );
}
