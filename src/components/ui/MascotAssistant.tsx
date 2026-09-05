import React, { useState } from "react";
import { sound } from "@/services/sound";

interface MascotAssistantProps {
  isDark?: boolean;
  onPostTaskClick?: () => void;
}

export default function MascotAssistant({
  isDark = false,
  onPostTaskClick,
}: MascotAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mood, setMood] = useState<"happy" | "waving" | "wink">("happy");

  const handleInteraction = () => {
    sound.playTap();
    setIsOpen((prev) => !prev);
    setMood("waving");
    setTimeout(() => setMood("happy"), 1500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Speech Bubble / Dialog Popup */}
      {isOpen && (
        <div
          className="mb-3 p-4 rounded-2xl border shadow-2xl backdrop-blur-xl animate-fade-in relative transition-all"
          style={{
            maxWidth: 280,
            background: isDark ? "rgba(15,23,42,0.95)" : "rgba(255,255,255,0.96)",
            borderColor: isDark ? "rgba(99,102,241,0.3)" : "rgba(203,213,225,0.8)",
            boxShadow: "0 15px 35px -10px rgba(99,102,241,0.25)",
          }}
        >
          {/* Doodle Arrow Indicator */}
          <div
            className="absolute -bottom-2 right-6 w-4 h-4 rotate-45 border-r border-b"
            style={{
              background: isDark ? "rgba(15,23,42,0.95)" : "#FFFFFF",
              borderColor: isDark ? "rgba(99,102,241,0.3)" : "rgba(203,213,225,0.8)",
            }}
          />

          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Nova AI · MicroLink Companion
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>

          <p className="text-xs text-slate-700 dark:text-slate-200 mb-3 leading-relaxed">
            Need quick home services or technical tutoring in Gujarat? Try posting with voice!
          </p>

          <button
            onClick={() => {
              sound.playSuccess();
              if (onPostTaskClick) onPostTaskClick();
              setIsOpen(false);
            }}
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-500 text-white text-xs font-bold shadow hover:brightness-110 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            ⚡ Post a Gig Now
          </button>
        </div>
      )}

      {/* Interactive Mascot Character Avatar */}
      <button
        onClick={handleInteraction}
        className="relative p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-500/30 shadow-lg hover:scale-105 transition-transform cursor-pointer focus:outline-none group flex items-center gap-2"
        style={{
          boxShadow: "0 8px 20px -5px rgba(99,102,241,0.25)",
        }}
        title="Say hello to Nova AI!"
      >
        <div className="relative w-11 h-11">
          {/* Mascot Head SVG */}
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm">
            {/* Mascot Antenna with Light */}
            <line x1="50" y1="20" x2="50" y2="8" stroke="#6366F1" strokeWidth="4" strokeLinecap="round" />
            <circle cx="50" cy="8" r="6" fill="#10B981" />

            {/* Robot Head Body */}
            <rect x="15" y="20" width="70" height="60" rx="20" fill="url(#mascotGrad)" stroke="#4F46E5" strokeWidth="3" />

            {/* Face Screen Visor */}
            <rect x="25" y="32" width="50" height="34" rx="12" fill="#0F172A" />

            {/* Expressive Eyes */}
            {mood === "wink" ? (
              <>
                <line x1="34" y1="48" x2="44" y2="48" stroke="#34D399" strokeWidth="4" strokeLinecap="round" />
                <circle cx="62" cy="48" r="5" fill="#34D399" />
              </>
            ) : mood === "waving" ? (
              <>
                <path d="M34 50 Q40 40 46 50" stroke="#38BDF8" strokeWidth="4" fill="none" strokeLinecap="round" />
                <path d="M54 50 Q60 40 66 50" stroke="#38BDF8" strokeWidth="4" fill="none" strokeLinecap="round" />
              </>
            ) : (
              <>
                <circle cx="40" cy="48" r="5" fill="#38BDF8" />
                <circle cx="60" cy="48" r="5" fill="#38BDF8" />
                {/* Pupil Sparkles */}
                <circle cx="42" cy="46" r="1.5" fill="#FFFFFF" />
                <circle cx="62" cy="46" r="1.5" fill="#FFFFFF" />
              </>
            )}

            {/* Rosy Cheeks */}
            <circle cx="30" cy="56" r="3" fill="#F43F5E" opacity="0.6" />
            <circle cx="70" cy="56" r="3" fill="#F43F5E" opacity="0.6" />

            {/* Gradients */}
            <defs>
              <linearGradient id="mascotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#EEF2FF" />
                <stop offset="100%" stopColor="#C7D2FE" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Mascot Name Pill */}
        <div className="hidden sm:flex flex-col text-left pr-2">
          <span className="text-[11px] font-bold text-slate-800 dark:text-slate-100 leading-tight">
            Nova AI
          </span>
          <span className="text-[9px] font-semibold text-emerald-600 dark:text-emerald-400">
            Tap to Chat
          </span>
        </div>
      </button>
    </div>
  );
}
