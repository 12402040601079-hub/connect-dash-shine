import React from "react";
import { sound } from "@/services/sound";

interface CategoryScrollerProps {
  onSelectCategory?: (category: string) => void;
  isDark?: boolean;
}

const CATEGORIES = [
  { id: "all", name: "⚡ All Gigs", icon: "✨", color: "#6366F1" },
  { id: "tutoring", name: "📚 Math & Coding Tutoring", icon: "💻", color: "#3B82F6" },
  { id: "repair", name: "🔧 AC & Electrician Repair", icon: "⚡", color: "#F59E0B" },
  { id: "delivery", name: "🛵 Ahmedabad Rapid Delivery", icon: "📍", color: "#10B981" },
  { id: "cleaning", name: "🧹 Home & Kitchen Deep Clean", icon: "🧼", color: "#06B6D4" },
  { id: "pets", name: "🐾 Pet Walking & Care", icon: "🐕", color: "#EC4899" },
  { id: "gardening", name: "🌱 Balcony Plant Gardening", icon: "🌿", color: "#84CC16" },
];

export default function CategoryScroller({
  onSelectCategory,
  isDark = false,
}: CategoryScrollerProps) {
  return (
    <div className="w-full mb-6">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Explore Micro-Gig Categories
        </span>
        <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1">
          Scroll ➔
        </span>
      </div>

      {/* Horizontal Momentum Scrolling Strip (Technique 15) */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none no-scrollbar scroll-smooth">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              sound.playTap();
              if (onSelectCategory) onSelectCategory(cat.id);
            }}
            className="hover-bounce shrink-0 px-3.5 py-2 rounded-2xl border text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-sm focus:outline-none"
            style={{
              background: isDark ? "rgba(30,41,59,0.7)" : "#FFFFFF",
              borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(226,232,240,0.9)",
              color: isDark ? "#F1F5F9" : "#1E293B",
            }}
          >
            <span className="text-sm">{cat.icon}</span>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
