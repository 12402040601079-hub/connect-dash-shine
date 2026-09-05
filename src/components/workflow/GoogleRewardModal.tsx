import React from "react";
import { sound } from "@/services/sound";

interface GoogleRewardModalProps {
  onClose: () => void;
  isDark?: boolean;
}

export default function GoogleRewardModal({
  onClose,
  isDark = true,
}: GoogleRewardModalProps) {
  return (
    <div className="fixed inset-0 z-[2600] flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-in zoom-in-95 duration-200">
      <div
        className="w-full max-w-sm rounded-3xl p-6 border border-amber-500/40 shadow-2xl text-center relative overflow-hidden"
        style={{ background: isDark ? "#0E1424" : "#FFFFFF" }}
      >
        {/* Background Sparkle Sheen */}
        <div className="absolute -top-12 -right-12 w-36 h-36 rounded-full bg-amber-500/20 filter blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-36 h-36 rounded-full bg-indigo-500/20 filter blur-2xl pointer-events-none" />

        {/* Animated Gold Coin Badge */}
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-400 to-amber-600 text-white flex items-center justify-center mx-auto mb-3.5 text-3xl shadow-xl shadow-amber-500/30 transform hover:scale-110 transition-transform">
          🎁
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 text-xs font-extrabold mb-2 uppercase tracking-wider">
          Google Sign-In Bonus
        </div>

        <h3 className="text-xl font-extrabold text-foreground mb-1">
          Welcome Reward Claimed!
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          Thank you for signing in with your verified Google account. Your bonuses have been credited instantly!
        </p>

        {/* Rewards Breakdown Cards */}
        <div className="grid grid-cols-2 gap-2.5 mb-5">
          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25">
            <div className="text-xl font-extrabold text-amber-400">₹100</div>
            <div className="text-[10px] font-bold text-muted-foreground uppercase mt-0.5">Wallet Credit</div>
          </div>
          <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/25">
            <div className="text-xl font-extrabold text-indigo-400">+150</div>
            <div className="text-[10px] font-bold text-muted-foreground uppercase mt-0.5">Karma XP</div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-semibold mb-5 flex items-center justify-center gap-2">
          <span>🛡️</span>
          <span>Google Authenticated True Account</span>
        </div>

        <button
          onClick={() => {
            sound.playTap();
            onClose();
          }}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-indigo-600 hover:brightness-110 text-white text-xs font-extrabold shadow-lg shadow-amber-500/25 transition-all"
        >
          Start Exploring Gujarat Gigs 🚀
        </button>
      </div>
    </div>
  );
}
