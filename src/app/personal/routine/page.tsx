import React from "react";
import DailyRoutine from "@/components/personal/DailyRoutine";

export default function RoutinePage() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Daily Routine</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Organize and track your daily tasks and goals
        </p>
      </div>
      <DailyRoutine />
    </div>
  );
}
