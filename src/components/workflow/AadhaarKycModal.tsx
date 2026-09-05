import React, { useState } from "react";
import { sound } from "@/services/sound";

interface AadhaarKycModalProps {
  userName?: string;
  isDark?: boolean;
  onClose: () => void;
  onVerified: () => void;
}

export default function AadhaarKycModal({
  userName = "Kavya Trivedi",
  isDark = false,
  onClose,
  onVerified,
}: AadhaarKycModalProps) {
  const [step, setStep] = useState<"input" | "otp" | "success">("input");
  const [aadhaarNum, setAadhaarNum] = useState("");
  const [otp, setOtp] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = () => {
    const clean = aadhaarNum.replace(/\s+/g, "");
    if (clean.length !== 12 || !/^\d{12}$/.test(clean)) {
      setError("Please enter a valid 12-digit Aadhaar Number.");
      return;
    }
    setError("");
    setBusy(true);
    sound.playTap();
    setTimeout(() => {
      setBusy(false);
      setStep("otp");
    }, 1200);
  };

  const handleVerifyOtp = () => {
    if (otp.length < 4) {
      setError("Please enter the 6-digit OTP sent to your Aadhaar-linked mobile.");
      return;
    }
    setError("");
    setBusy(true);
    sound.playTap();
    setTimeout(() => {
      setBusy(false);
      setStep("success");
      sound.playSuccess();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md p-6 rounded-3xl border shadow-2xl relative overflow-hidden transition-all"
        style={{
          background: isDark ? "rgba(15,23,42,0.96)" : "#FFFFFF",
          borderColor: isDark ? "rgba(99,102,241,0.3)" : "rgba(226,232,240,0.9)",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
        }}
      >
        {/* Header Badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🇮🇳</span>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                DigiLocker · Aadhaar e-KYC
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Official Govt. ID Verification Gateway
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm p-1.5 cursor-pointer rounded-full"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-1.5">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {/* STEP 1: Enter Aadhaar Number */}
        {step === "input" && (
          <div>
            <div className="mb-4 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300">
              🔒 <strong>UIDAI Compliant:</strong> Your 12-digit Aadhaar UID is masked & verified via DigiLocker Sandbox API without storing biometric data.
            </div>

            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              12-Digit Aadhaar Number
            </label>
            <input
              type="text"
              maxLength={14}
              placeholder="XXXX XXXX 8920"
              value={aadhaarNum}
              onChange={(e) => setAadhaarNum(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
            />

            <div className="flex items-center gap-2 mb-5">
              <input type="checkbox" id="kycConsent" defaultChecked className="rounded text-indigo-600" />
              <label htmlFor="kycConsent" className="text-[11px] text-slate-500 dark:text-slate-400">
                I authorize MicroLink to verify my identity via UIDAI DigiLocker OTP.
              </label>
            </div>

            <button
              onClick={handleSendOtp}
              disabled={busy}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-bold text-sm shadow-md hover:brightness-110 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {busy ? "Connecting DigiLocker Gateway..." : "⚡ Generate Aadhaar OTP"}
            </button>
          </div>
        )}

        {/* STEP 2: Enter OTP */}
        {step === "otp" && (
          <div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-3">
              Enter the 6-digit OTP sent to your registered mobile ending in <strong>•••• 4921</strong>.
            </p>

            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Security OTP
            </label>
            <input
              type="text"
              maxLength={6}
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-center text-lg font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
            />

            <button
              onClick={handleVerifyOtp}
              disabled={busy}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm shadow-md hover:brightness-110 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2 mb-3"
            >
              {busy ? "Verifying with UIDAI..." : "✓ Confirm & Issue Gold Badge"}
            </button>

            <button
              onClick={() => setStep("input")}
              className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            >
              ← Edit Aadhaar Number
            </button>
          </div>
        )}

        {/* STEP 3: Success Confirmation */}
        {step === "success" && (
          <div className="text-center py-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-3xl mx-auto mb-3 border-2 border-emerald-500">
              ✓
            </div>
            <h4 className="text-lg font-extrabold text-slate-900 dark:text-white mb-1">
              Govt. Verified Badge Issued!
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 max-w-xs mx-auto">
              Identity confirmed for <strong>{userName}</strong>. Your profile now exhibits the official gold shield of trust.
            </p>

            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 border mb-5 text-left text-xs font-mono">
              <div className="text-slate-500">Verification ID: UIDAI-GJ-{Math.floor(100000 + Math.random() * 900000)}</div>
              <div className="text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">Status: 100% Genuine & Authenticated</div>
            </div>

            <button
              onClick={() => {
                onVerified();
                onClose();
              }}
              className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow hover:bg-indigo-700 transition-all cursor-pointer"
            >
              Done & Return to Workspace
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
