import type { Metadata } from "next";
import "@/styles/globals.css";
import DashboardLayout from "@/components/layout/DashboardLayout";

export const metadata: Metadata = {
  title: "Trading Dashboard",
  description: "Manage your investments and daily routine",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 text-slate-900 dark:bg-navy-900 dark:text-white">
        <DashboardLayout>{children}</DashboardLayout>
      </body>
    </html>
  );
}
