"use client";

import WorkDashboard from "@/components/work/WorkDashboard";

export default function WorkPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-6 dark:bg-slate-950">
      <div className="px-4 sm:px-6 lg:px-8">
        <WorkDashboard />
      </div>
    </main>
  );
}
