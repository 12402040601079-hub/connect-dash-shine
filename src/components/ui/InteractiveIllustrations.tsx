import React from "react";

export default function InteractiveIllustrations({ isDark = false }: { isDark?: boolean }) {
  return (
    <div
      className="pointer-events-none fixed inset-0 overflow-hidden z-0"
      style={{ opacity: isDark ? 0.35 : 0.18 }}
    >
      {/* Calm, Soft Ambient Lighting Orbs */}
      <div className="floating-orb orb-1" />
      <div className="floating-orb orb-2" />
      <div className="floating-orb orb-3" />
    </div>
  );
}
