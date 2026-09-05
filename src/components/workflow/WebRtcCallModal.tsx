import React, { useState, useEffect } from "react";
import { sound } from "@/services/sound";

interface WebRtcCallModalProps {
  callerName: string;
  callerRole: string;
  isDark?: boolean;
  onClose: () => void;
}

export default function WebRtcCallModal({
  callerName = "Kishan Patel (Helper)",
  callerRole = "Verified Electrician",
  isDark = false,
  onClose,
}: WebRtcCallModalProps) {
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);

  useEffect(() => {
    sound.playTap();
    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-sm p-8 rounded-3xl border shadow-2xl relative overflow-hidden flex flex-col items-center text-center"
        style={{
          background: isDark ? "rgba(15,23,42,0.98)" : "#FFFFFF",
          borderColor: isDark ? "rgba(99,102,241,0.3)" : "rgba(226,232,240,0.9)",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.35)",
        }}
      >
        <span className="text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 mb-6 border border-emerald-500/30">
          🔒 Encrypted Masked Call
        </span>

        {/* Avatar Ring */}
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-600 to-emerald-500 text-white flex items-center justify-center text-4xl shadow-xl">
            👤
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold">
            ✓
          </div>
        </div>

        <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-0.5">
          {callerName}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          {callerRole} · Phone Mask Protected
        </p>

        {/* Live Audio Waveform Simulation */}
        <div className="flex items-center gap-1.5 h-8 mb-6">
          {[40, 70, 30, 90, 60, 100, 45, 80, 55, 30].map((h, i) => (
            <div
              key={i}
              className="w-1 rounded-full bg-indigo-500 transition-all duration-300"
              style={{
                height: isMuted ? "6px" : `${h}%`,
                opacity: isMuted ? 0.3 : 0.85,
              }}
            />
          ))}
        </div>

        <div className="text-sm font-mono font-bold text-slate-700 dark:text-slate-200 mb-8">
          {formatTime(callDuration)}
        </div>

        {/* Call Controls */}
        <div className="flex items-center gap-4">
          {/* Mute Button */}
          <button
            onClick={() => {
              sound.playTap();
              setIsMuted(!isMuted);
            }}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all cursor-pointer ${
              isMuted
                ? "bg-amber-500 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            }`}
            title="Mute"
          >
            {isMuted ? "🔇" : "🎙️"}
          </button>

          {/* End Call Button */}
          <button
            onClick={() => {
              sound.playTap();
              onClose();
            }}
            className="w-14 h-14 rounded-full bg-rose-600 text-white flex items-center justify-center text-2xl shadow-lg hover:bg-rose-700 active:scale-95 transition-all cursor-pointer"
            title="End Call"
          >
            📞
          </button>

          {/* Speaker Button */}
          <button
            onClick={() => {
              sound.playTap();
              setIsSpeaker(!isSpeaker);
            }}
            className={`w-12 h-12 rounded-full flex items-center justify-center text-lg transition-all cursor-pointer ${
              isSpeaker
                ? "bg-indigo-600 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
            }`}
            title="Speaker"
          >
            🔊
          </button>
        </div>
      </div>
    </div>
  );
}
