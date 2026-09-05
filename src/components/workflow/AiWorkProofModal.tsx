import React, { useState } from "react";
import { sound } from "@/services/sound";

interface AiWorkProofModalProps {
  taskId: string;
  taskTitle: string;
  isDark?: boolean;
  onClose: () => void;
  onProofApproved: () => void;
}

export default function AiWorkProofModal({
  taskId,
  taskTitle,
  isDark = false,
  onClose,
  onProofApproved,
}: AiWorkProofModalProps) {
  const [beforeUploaded, setBeforeUploaded] = useState(false);
  const [afterUploaded, setAfterUploaded] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysisComplete, setAiAnalysisComplete] = useState(false);

  const handleSimulateAiInspection = () => {
    if (!beforeUploaded || !afterUploaded) {
      alert("Please upload both Before and After work photos.");
      return;
    }
    sound.playTap();
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setAiAnalysisComplete(true);
      sound.playSuccess();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-lg p-6 rounded-3xl border shadow-2xl relative overflow-hidden"
        style={{
          background: isDark ? "rgba(15,23,42,0.96)" : "#FFFFFF",
          borderColor: isDark ? "rgba(99,102,241,0.3)" : "rgba(226,232,240,0.9)",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🤖</span>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                AI Work Proof & Quality Inspection
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Automated Escrow Milestone Clearance
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

        <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border text-xs text-slate-700 dark:text-slate-300 mb-4">
          Task: <strong>{taskTitle}</strong>
        </div>

        {/* Before / After photo grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Before Photo Box */}
          <div
            onClick={() => setBeforeUploaded(true)}
            className={`p-4 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
              beforeUploaded
                ? "bg-indigo-500/10 border-indigo-500"
                : "border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <div className="text-2xl mb-1">{beforeUploaded ? "📸" : "➕"}</div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {beforeUploaded ? "Before Photo Attached" : "Upload Before Photo"}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">
              {beforeUploaded ? "Size: 1.8 MB · JPG" : "Initial Condition"}
            </span>
          </div>

          {/* After Photo Box */}
          <div
            onClick={() => setAfterUploaded(true)}
            className={`p-4 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
              afterUploaded
                ? "bg-emerald-500/10 border-emerald-500"
                : "border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            <div className="text-2xl mb-1">{afterUploaded ? "✨" : "➕"}</div>
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
              {afterUploaded ? "After Photo Attached" : "Upload After Photo"}
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5">
              {afterUploaded ? "Size: 2.1 MB · JPG" : "Finished Service"}
            </span>
          </div>
        </div>

        {/* AI Inspection Status */}
        {isAnalyzing ? (
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-center mb-4">
            <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin mx-auto mb-2" />
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
              AI Vision Model inspecting service clarity & completion metrics...
            </span>
          </div>
        ) : aiAnalysisComplete ? (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 mb-4">
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold mb-1">
              <span>✓</span>
              <span>AI Verification Passed (Confidence: 97.4%)</span>
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              Service completion criteria met. Cleanliness/repairs matched original scope. 100% Escrow release approved.
            </p>
          </div>
        ) : null}

        {/* Action Button */}
        {!aiAnalysisComplete ? (
          <button
            onClick={handleSimulateAiInspection}
            disabled={isAnalyzing}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 text-white font-bold text-xs shadow hover:brightness-110 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            🤖 Run AI Quality Verification
          </button>
        ) : (
          <button
            onClick={() => {
              onProofApproved();
              onClose();
            }}
            className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow hover:bg-emerald-700 transition-all cursor-pointer"
          >
            ✓ Release Escrow Payout to Helper
          </button>
        )}
      </div>
    </div>
  );
}
