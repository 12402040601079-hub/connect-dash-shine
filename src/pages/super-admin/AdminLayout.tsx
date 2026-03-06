import React, { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

type Props = {
  children: ReactNode;
  onNav?: (id: string) => void;
  active?: string;
};

export default function AdminLayout({ children, onNav, active }: Props) {
  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900">
      <Sidebar onNavigate={onNav} active={active} />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6 md:p-8 lg:p-10 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
