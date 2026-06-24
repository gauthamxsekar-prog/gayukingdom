"use client";

import React from "react";
import Header from "./Header";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-900">
      <Header />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
