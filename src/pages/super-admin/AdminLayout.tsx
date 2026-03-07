import React, { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { AT } from "./adminTheme";

type Props = {
  children: ReactNode;
  onNav?: (id: string) => void;
  active?: string;
  onSignOut?: () => void;
};

export default function AdminLayout({ children, onNav, active, onSignOut }: Props) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", background: AT.bgGrad, fontFamily: "'Inter','Segoe UI',sans-serif", color: AT.text }}>
      <Sidebar onNavigate={onNav} active={active} onSignOut={onSignOut} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Header active={active} onSignOut={onSignOut} />
        <main style={{ flex: 1, padding: "24px 28px", overflowY: "auto" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
