import { motion } from "framer-motion";

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[var(--gradient-bg)]" />
      <motion.div
        className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-primary/10 blur-3xl"
        animate={{ x: [0, 60, -30, 0], y: [0, -80, 40, 0], scale: [1, 1.2, 0.9, 1] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/3 right-0 w-96 h-96 rounded-full bg-accent/8 blur-3xl"
        animate={{ x: [0, -50, 30, 0], y: [0, 50, -30, 0], scale: [1, 0.9, 1.1, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-1/3 w-72 h-72 rounded-full bg-primary/5 blur-3xl"
        animate={{ x: [0, 40, -60, 0], y: [0, -40, 20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
