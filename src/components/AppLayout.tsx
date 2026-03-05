import { ReactNode } from "react";
import { AnimatedBackground } from "./AnimatedBackground";
import { AppSidebar, MobileBottomNav } from "./AppNavigation";
import { VoiceAssistant } from "./VoiceAssistant";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full">
      <AnimatedBackground />
      <AppSidebar />
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        {children}
      </main>
      <MobileBottomNav />
      <VoiceAssistant />
    </div>
  );
}
