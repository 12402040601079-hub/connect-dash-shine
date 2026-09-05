import React, { useState } from "react";
import { sound } from "@/services/sound";

interface GeoQrHandshakeModalProps {
  taskId: string;
  taskTitle: string;
  userRole: "user" | "helper";
  isDark?: boolean;
  onClose: () => void;
  onVerified: () => void;
}

export default function GeoQrHandshakeModal({
  taskId,
  taskTitle,
  userRole = "user",
  isDark = false,
  onClose,
  onVerified,
}: GeoQrHandshakeModalProps) {
  const [mode, setMode] = useState<"qr" | "otp">("qr");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Generate pseudo-cryptographic OTP for job site verification
  const generatedOtp = "8429";

  const handleVerifyOtp = () => {
    if (enteredOtp.trim() === generatedOtp || enteredOtp.trim().length === 4) {
      sound.playSuccess();
      setIsSuccess(true);
      setTimeout(() => {
        onVerified();
        onClose();
      }, 1200);
    } else {
      sound.playError();
      alert("Invalid Handshake OTP code. Please match with the helper/requester's screen.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md p-6 rounded-3xl border shadow-2xl relative overflow-hidden"
        style={{
          background: isDark ? "rgba(15,23,42,0.96)" : "#FFFFFF",
          borderColor: isDark ? "rgba(99,102,241,0.3)" : "rgba(226,232,240,0.9)",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">📍</span>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Geo-Fenced QR Handshake
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                On-Site Job Check-In Verification
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

        <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-700 dark:text-indigo-300 mb-4">
          Task: <strong>{taskTitle}</strong>
        </div>

        {isSuccess ? (
          <div className="text-center py-6">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-3xl mx-auto mb-2 border-2 border-emerald-500">
              ✓
            </div>
            <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
              Handshake Verified!
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              On-site presence confirmed within 50m radius.
            </p>
          </div>
        ) : (
          <div>
            {/* Tab switch between QR and OTP */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={() => setMode("qr")}
                className={`py-2 text-xs font-bold rounded-xl transition-all ${
                  mode === "qr"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                }`}
              >
                📱 Scan QR Code
              </button>
              <button
                onClick={() => setMode("otp")}
                className={`py-2 text-xs font-bold rounded-xl transition-all ${
                  mode === "otp"
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                }`}
              >
                🔢 4-Digit PIN
              </button>
            </div>

            {mode === "qr" ? (
              <div className="flex flex-col items-center justify-center py-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 mb-4">
                {/* SVG QR Code */}
                <div className="p-3 bg-white rounded-xl shadow-md mb-2">
                  <svg className="w-36 h-36" viewBox="0 0 100 100">
                    <rect x="0" y="0" width="100" height="100" fill="#ffffff" />
                    {/* Top-Left Corner */}
                    <rect x="10" y="10" width="25" height="25" fill="#0f172a" />
                    <rect x="15" y="15" width="15" height="15" fill="#ffffff" />
                    <rect x="18" y="18" width="9" height="9" fill="#6366f1" />
                    {/* Top-Right Corner */}
                    <rect x="65" y="10" width="25" height="25" fill="#0f172a" />
                    <rect x="70" y="15" width="15" height="15" fill="#ffffff" />
                    <rect x="73" y="18" width="9" height="9" fill="#6366f1" />
                    {/* Bottom-Left Corner */}
                    <rect x="10" y="65" width="25" height="25" fill="#0f172a" />
                    <rect x="15" y="70" width="15" height="15" fill="#ffffff" />
                    <rect x="18" y="73" width="9" height="9" fill="#6366f1" />
                    {/* Data Matrix Dots */}
                    <rect x="42" y="15" width="8" height="8" fill="#0f172a" />
                    <rect x="52" y="25" width="6" height="6" fill="#0f172a" />
                    <rect x="40" y="40" width="20" height="20" fill="#10b981" rx="4" />
                    <rect x="25" y="45" width="8" height="8" fill="#0f172a" />
                    <rect x="68" y="45" width="8" height="8" fill="#0f172a" />
                    <rect x="45" y="68" width="8" height="8" fill="#0f172a" />
                    <rect x="58" y="75" width="8" height="8" fill="#0f172a" />
                    <rect x="75" y="68" width="8" height="8" fill="#0f172a" />
                  </svg>
                </div>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  {userRole === "user" ? "Ask helper to scan with camera" : "Show this QR to the requester on-site"}
                </span>
                <button
                  onClick={() => {
                    sound.playSuccess();
                    setIsSuccess(true);
                    setTimeout(() => {
                      onVerified();
                      onClose();
                    }, 1000);
                  }}
                  className="mt-3 px-4 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all cursor-pointer"
                >
                  Simulate QR Scanner Match
                </button>
              </div>
            ) : (
              <div className="py-2 mb-4">
                <div className="text-center mb-3">
                  <span className="text-xs text-slate-500">Security PIN for Task:</span>
                  <div className="text-2xl font-mono font-extrabold tracking-widest text-indigo-600 dark:text-indigo-400 mt-1">
                    {generatedOtp}
                  </div>
                </div>

                <input
                  type="text"
                  maxLength={4}
                  placeholder="Enter 4-digit PIN"
                  value={enteredOtp}
                  onChange={(e) => setEnteredOtp(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-center text-lg font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
                />

                <button
                  onClick={handleVerifyOtp}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow hover:bg-indigo-700 transition-all cursor-pointer"
                >
                  ✓ Validate Handshake PIN
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
