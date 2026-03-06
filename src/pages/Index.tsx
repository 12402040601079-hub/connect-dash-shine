import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Briefcase, HandHelping, Mail, Lock, User, Phone, ChevronRight } from "lucide-react";

type Step = "landing" | "role" | "register" | "profile";

const Index = () => {
  const [step, setStep] = useState<Step>("landing");
  const [role, setRole] = useState<"user" | "helper" | null>(null);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <AnimatedBackground />
      <div className="w-full max-w-md px-6 z-10">
        <AnimatePresence mode="wait">
          {step === "landing" && (
            <motion.div key="landing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-20 h-20 rounded-2xl gradient-btn flex items-center justify-center mx-auto mb-8 shadow-lg"
              >
                <span className="font-display font-bold text-3xl">M</span>
              </motion.div>
              <h1 className="font-display text-4xl font-bold mb-3">
                <span className="gradient-text">MicroLink</span>
              </h1>
              <p className="text-muted-foreground text-lg mb-10">
                Your community micro‑job marketplace
              </p>
              <button
                onClick={() => setStep("role")}
                className="w-full gradient-btn rounded-2xl py-4 font-semibold text-lg flex items-center justify-center gap-2 transition-all hover:brightness-110"
              >
                Get Started <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full glass-card-hover rounded-2xl py-4 mt-3 font-medium text-foreground"
              >
                Already have an account? Sign in
              </button>
            </motion.div>
          )}

          {step === "role" && (
            <motion.div key="role" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <h2 className="font-display text-2xl font-bold mb-2 text-center">How will you use MicroLink?</h2>
              <p className="text-muted-foreground text-center mb-8">Choose your role to get started</p>
              <div className="space-y-3">
                {[
                  { value: "user" as const, icon: Briefcase, title: "User", desc: "Post tasks and find reliable help" },
                  { value: "helper" as const, icon: HandHelping, title: "Helper", desc: "Find jobs and earn money" },
                ].map((r) => (
                  <motion.button
                    key={r.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setRole(r.value); setStep("register"); }}
                    className={`w-full glass-card rounded-2xl p-5 flex items-center gap-4 text-left transition-all ${
                      role === r.value ? "ring-2 ring-primary" : ""
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <r.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-foreground">{r.title}</div>
                      <div className="text-sm text-muted-foreground">{r.desc}</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {step === "register" && (
            <motion.div key="register" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <h2 className="font-display text-2xl font-bold mb-2 text-center">Create your account</h2>
              <p className="text-muted-foreground text-center mb-8">Join thousands of users on MicroLink</p>
              <div className="space-y-4">
                {[
                  { icon: User, placeholder: "Full name", type: "text" },
                  { icon: Mail, placeholder: "Email address", type: "email" },
                  { icon: Phone, placeholder: "Phone number", type: "tel" },
                  { icon: Lock, placeholder: "Password", type: "password" },
                ].map((field, i) => (
                  <div key={i} className="relative">
                    <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type={field.type}
                      placeholder={field.placeholder}
                      className="w-full glass-card rounded-xl py-3.5 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                ))}
                <button
                  onClick={() => setStep("profile")}
                  className="w-full gradient-btn rounded-2xl py-4 font-semibold text-lg mt-2"
                >
                  Continue
                </button>
                <button onClick={() => setStep("role")} className="w-full text-center text-sm text-muted-foreground hover:text-foreground">
                  ← Back
                </button>
              </div>
            </motion.div>
          )}

          {step === "profile" && (
            <motion.div key="profile" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <h2 className="font-display text-2xl font-bold mb-2 text-center">Complete your profile</h2>
              <p className="text-muted-foreground text-center mb-8">Tell us about your skills and interests</p>
              <div className="space-y-4">
                <div className="flex justify-center mb-4">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-2 border-dashed border-primary/30">
                    <User className="w-10 h-10 text-primary/50" />
                  </div>
                </div>
                <div className="glass-card rounded-xl p-4">
                  <p className="text-sm font-medium text-foreground mb-3">Select your interests</p>
                  <div className="flex flex-wrap gap-2">
                    {["Delivery", "Handyman", "Cleaning", "Tech", "Writing", "Design", "Moving", "Pet Care", "Tutoring"].map((skill) => (
                      <button
                        key={skill}
                        className="px-3 py-1.5 rounded-full text-sm glass-card text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="w-full gradient-btn rounded-2xl py-4 font-semibold text-lg"
                >
                  Start Exploring
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Index;
