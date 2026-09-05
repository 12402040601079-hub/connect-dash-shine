import React, { useState, useEffect } from "react";
import { sound } from "@/services/sound";

interface Step {
  id: number;
  title: string;
  subtitle: string;
  tag: string;
  color: string;
  badge: string;
}

const STEPS: Step[] = [
  {
    id: 1,
    title: "Speak or Type Your Gig",
    subtitle: "AI speech-to-task dictation parses title, category & budget in under 3 seconds.",
    tag: "Voice AI & Smart Parsing",
    color: "#6366F1",
    badge: "Step 01 · Instant Post",
  },
  {
    id: 2,
    title: "Gujarat Proximity Matching",
    subtitle: "Real-time radar pinpoints verified helpers within 2km, 5km & 10km concentric rings.",
    tag: "Radar Dispatch",
    color: "#10B981",
    badge: "Step 02 · Live Matching",
  },
  {
    id: 3,
    title: "Google Map Tracking & Escrow",
    subtitle: "Track live vehicle telemetry across Ahmedabad with 100% protected escrow payout.",
    tag: "Google Map Telemetry",
    color: "#06B6D4",
    badge: "Step 03 · Secure Delivery",
  },
];

export default function InteractiveScrollytelling({ isDark = false }: { isDark?: boolean }) {
  const [activeStep, setActiveStep] = useState<number>(0);

  const current = STEPS[activeStep];

  return (
    <div
      className="relative w-full rounded-3xl p-6 sm:p-8 overflow-hidden mb-8 border transition-all duration-300 shadow-lg"
      style={{
        background: isDark
          ? "linear-gradient(135deg, rgba(19,27,46,0.92) 0%, rgba(15,23,42,0.95) 100%)"
          : "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)",
        borderColor: isDark ? "rgba(99,102,241,0.2)" : "rgba(226,232,240,0.9)",
        boxShadow: isDark
          ? "0 10px 30px -10px rgba(0,0,0,0.5)"
          : "0 10px 30px -10px rgba(99,102,241,0.08)",
      }}
    >
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
        {/* Left Narrative Column */}
        <div className="flex-1 max-w-xl">
          <div className="flex items-center gap-2 mb-3">
            <span
              className="text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider transition-all duration-200 shadow-sm"
              style={{
                background: `${current.color}15`,
                color: current.color,
                border: `1px solid ${current.color}35`,
              }}
            >
              {current.badge}
            </span>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
              Interactive Workflow
            </span>
          </div>

          <h2
            className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-3"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            {current.title}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            {current.subtitle}
          </p>

          {/* Step Selector Buttons */}
          <div className="grid grid-cols-3 gap-3">
            {STEPS.map((step, idx) => {
              const isActive = idx === activeStep;
              return (
                <button
                  key={step.id}
                  onClick={() => {
                    sound.playTap();
                    setActiveStep(idx);
                  }}
                  className="relative p-3 rounded-2xl text-left border transition-all duration-200 group focus:outline-none cursor-pointer"
                  style={{
                    background: isActive
                      ? isDark
                        ? "rgba(99,102,241,0.18)"
                        : "rgba(99,102,241,0.08)"
                      : "transparent",
                    borderColor: isActive ? step.color : isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
                    boxShadow: isActive ? `0 4px 14px ${step.color}20` : "none",
                  }}
                >
                  <div className="h-1 w-full bg-slate-200 dark:bg-slate-700 rounded-full mb-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-200"
                      style={{
                        width: isActive ? "100%" : "0%",
                        background: step.color,
                      }}
                    />
                  </div>
                  <div className="text-[11px] font-bold text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300">
                    0{step.id}
                  </div>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate mt-0.5">
                    {step.tag}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Graphic Preview */}
        <div className="relative w-full lg:w-80 h-52 sm:h-60 flex items-center justify-center">
          <div
            className="w-full h-full rounded-2xl border p-6 flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-md transition-all duration-300"
            style={{
              background: isDark ? "rgba(15,23,42,0.6)" : "rgba(255,255,255,0.9)",
              borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)",
              boxShadow: "0 10px 25px -10px rgba(0,0,0,0.06)",
            }}
          >
            {/* Illustration 1: Voice AI */}
            {activeStep === 0 && (
              <div className="flex flex-col items-center justify-center text-center">
                <div className="relative mb-3">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-3xl shadow-inner">
                    🎙️
                  </div>
                </div>
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  Native Web Speech AI
                </span>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 mt-1">
                  "AC repair at Vastrapur for ₹450"
                </span>
              </div>
            )}

            {/* Illustration 2: Radar Pulse & Nearby Helpers */}
            {activeStep === 1 && (
              <div className="flex flex-col items-center justify-center text-center">
                <div className="relative w-20 h-20 flex items-center justify-center mb-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-2xl shadow-lg">
                    📡
                  </div>
                  <span className="absolute -top-1 -right-1 text-base">⚡</span>
                  <span className="absolute -bottom-1 -left-1 text-base">🛵</span>
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  3 Verified Helpers Found
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Within 1.8 km in Ahmedabad
                </span>
              </div>
            )}

            {/* Illustration 3: Google Maps Live Telemetry Route */}
            {activeStep === 2 && (
              <div className="flex flex-col items-center justify-center text-center">
                <div className="relative mb-3">
                  <div className="w-16 h-16 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-3xl shadow-inner">
                    🛵
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold border-2 border-white shadow">
                    ✓
                  </span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-bold">
                  <span>SG Highway ➔ Satellite</span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 mt-2">
                  ETA: 4 mins · Speed: 32 km/h
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
