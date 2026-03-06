import { NavLink as RouterNavLink } from "react-router-dom";
import { Home, MessageSquare, User, Briefcase, Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { motion } from "framer-motion";

const navItems = [
  { to: "/dashboard", icon: Home, label: "Home" },
  { to: "/marketplace", icon: Briefcase, label: "Requests" },
  { to: "/chat", icon: MessageSquare, label: "Chat" },
  { to: "/profile", icon: User, label: "Profile" },
];

export function AppSidebar() {
  const { theme, toggle } = useTheme();

  return (
    <aside className="hidden md:flex flex-col w-64 glass-card border-r border-border/50 min-h-screen p-4 gap-2">
      <div className="flex items-center gap-2 px-3 py-4 mb-4">
        <div className="w-8 h-8 rounded-lg gradient-btn flex items-center justify-center font-display font-bold text-sm">
          M
        </div>
        <span className="font-display font-bold text-lg gradient-text">MicroLink</span>
      </div>

      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map((item) => (
          <RouterNavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </RouterNavLink>
        ))}
      </nav>

      <button
        onClick={toggle}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all"
      >
        {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        {theme === "dark" ? "Light Mode" : "Dark Mode"}
      </button>
    </aside>
  );
}

export function MobileBottomNav() {
  const { theme, toggle } = useTheme();

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="md:hidden fixed bottom-0 left-0 right-0 glass-card border-t border-border/50 z-40"
    >
      <div className="flex items-center justify-around py-2 px-4">
        {navItems.map((item) => (
          <RouterNavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-xs transition-all ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </RouterNavLink>
        ))}
      </div>
    </motion.nav>
  );
}
