"use client";

import React, { useEffect, useState } from "react";
import Header from "./Header";
import Tabs from "../Tabs";
import { usePathname } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState<"work" | "personal">("work");

  useEffect(() => {
    if (!pathname) return;
    setActiveTab(pathname.startsWith("/personal") ? "personal" : "work");
  }, [pathname]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-900">
      <Header />
      <Tabs active={activeTab} onChange={(t) => setActiveTab(t)} />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
