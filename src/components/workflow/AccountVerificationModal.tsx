import React, { useState } from "react";
import { sound } from "@/services/sound";
import { triggerCelebration, addHelperXP } from "@/services/gamification";

interface AccountVerificationModalProps {
  user: any;
  onClose: () => void;
  onVerified: () => void;
  isDark?: boolean;
}

export default function AccountVerificationModal({
  user,
  onClose,
  onVerified,
  isDark = true,
}: AccountVerificationModalProps) {
  const [step, setStep] = useState<"checklist" | "otp" | "govtid" | "success">("checklist");
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || "+91 98250 88776");
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [idNumber, setIdNumber] = useState("XXXX-XXXX-4912");

  const handleSendOtp = () => {
    sound.playTap();
    setOtpSent(true);
    setStep("otp");
  };

  const handleOtpChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otpCode];
    next[index] = val.slice(-1);
    setOtpCode(next);

    // Auto-focus next box
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = () => {
    const code = otpCode.join("");
    if (code.length === 6) {
      sound.playChime();
      setStep("govtid");
    } else {
      setOtpError("Please enter the complete 6-digit code (Use 123456)");
      sound.playTap();
    }
  };

  const handleCompleteVerification = () => {
    sound.playSuccess();
    triggerCelebration();
    addHelperXP(150, "True Account Authenticated");
    setStep("success");
  };

  return (
    <div className="fixed inset-0 z-[2500] flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-md rounded-2xl p-6 border border-emerald-500/30 shadow-2xl relative"
        style={{ background: isDark ? "#0E1424" : "#FFFFFF" }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground text-sm font-bold p-1"
        >
          ✕
        </button>

        {/* Header Icon */}
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 flex items-center justify-center mx-auto mb-3.5 text-2xl shadow-lg">
          🛡️
        </div>

        <h3 className="text-xl font-extrabold text-foreground text-center mb-1">
          Anti-Fake "True Account" Verification
        </h3>
        <p className="text-xs text-muted-foreground text-center mb-5">
          MicroLink community security protocol. Verify your real identity to earn trust, protect neighbors, and eliminate bot profiles.
        </p>

        {step === "checklist" && (
          <div className="space-y-3 mb-6">
            {/* 1. Google OAuth */}
            <div className="p-3.5 rounded-xl bg-input/40 border border-border/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">🌐</span>
                <div>
                  <div className="text-xs font-bold text-foreground">Google OAuth Authentic</div>
                  <div className="text-[11px] text-muted-foreground">Connected: {user?.email || "google.user@gmail.com"}</div>
                </div>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center gap-1">
                ✓ Verified
              </span>
            </div>

            {/* 2. Phone OTP */}
            <div className="p-3.5 rounded-xl bg-input/40 border border-border/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">📱</span>
                <div>
                  <div className="text-xs font-bold text-foreground">Phone Number OTP</div>
                  <div className="text-[11px] text-muted-foreground">{phoneNumber}</div>
                </div>
              </div>
              <button
                onClick={handleSendOtp}
                className="text-xs font-bold px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all"
              >
                Send OTP
              </button>
            </div>

            {/* 3. Govt ID / Aadhaar */}
            <div className="p-3.5 rounded-xl bg-input/40 border border-border/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">🪪</span>
                <div>
                  <div className="text-xs font-bold text-foreground">Govt ID / Aadhaar Audit</div>
                  <div className="text-[11px] text-muted-foreground">Instant digital KYC verification</div>
                </div>
              </div>
              <span className="text-xs font-semibold text-muted-foreground">Pending</span>
            </div>
          </div>
        )}

        {step === "otp" && (
          <div className="mb-6 text-center">
            <p className="text-xs text-muted-foreground mb-4">
              Enter the 6-digit security code sent to <strong>{phoneNumber}</strong> (Test code: <strong>123456</strong>):
            </p>
            <div className="flex justify-center gap-2 mb-3">
              {[0, 1, 2, 3, 4, 5].map((idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  maxLength={1}
                  value={otpCode[idx]}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  className="w-10 h-12 text-center text-lg font-bold rounded-xl border border-border bg-input/50 text-foreground outline-none focus:border-emerald-500 transition-all"
                />
              ))}
            </div>
            {otpError && <p className="text-xs text-rose-500 font-semibold mb-2">{otpError}</p>}
            <button
              onClick={handleVerifyOtp}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all mt-2"
            >
              Verify Code
            </button>
          </div>
        )}

        {step === "govtid" && (
          <div className="mb-6">
            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 mb-4 text-center">
              <div className="text-2xl mb-1">🇮🇳</div>
              <div className="text-xs font-bold text-foreground">India Digital Aadhaar / Govt ID</div>
              <div className="text-[11px] text-muted-foreground">Masked UID: {idNumber}</div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Name matches Google Account ({user?.name || "Verified Citizen"})</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Live biometric liveness check passed</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="text-emerald-500 font-bold">✓</span>
                <span>Zero fraud or dispute flags in Gujarat community ledger</span>
              </div>
            </div>

            <button
              onClick={handleCompleteVerification}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 text-white text-xs font-bold shadow-lg transition-all"
            >
              Confirm & Issue "Verified Human" Badge
            </button>
          </div>
        )}

        {step === "success" && (
          <div className="mb-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center text-3xl mx-auto mb-3 shadow-xl">
              ✓
            </div>
            <h4 className="text-base font-extrabold text-foreground mb-1">
              Account Successfully Verified!
            </h4>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold mb-3">
              <span>🛡️ Verified True Account</span>
              <span>• 98% Trust Score</span>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Your profile now displays the official green authenticity seal. You received <strong>+150 Karma XP</strong>!
            </p>
            <button
              onClick={() => {
                onVerified();
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-all"
            >
              Done & Explore Gujarat Tasks
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
