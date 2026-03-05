import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, X, MessageCircle } from "lucide-react";

export function VoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 md:bottom-8 md:right-8">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="glass-card rounded-2xl p-5 mb-4 w-72"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-semibold text-foreground">AI Assistant</h3>
              <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Hi! I can help you find tasks, post jobs, or navigate MicroLink. Tap the mic to talk.
            </p>
            <div className="flex items-center gap-3">
              <button className="flex-1 glass-card rounded-xl py-2.5 flex items-center justify-center gap-2 text-sm font-medium text-foreground hover:bg-primary/10 transition-colors">
                <Mic className="w-4 h-4 text-primary" />
                Tap to speak
              </button>
              <button className="glass-card rounded-xl p-2.5 hover:bg-primary/10 transition-colors">
                <MessageCircle className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full gradient-btn flex items-center justify-center shadow-lg animate-pulse-glow"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
      </motion.button>
    </div>
  );
}
