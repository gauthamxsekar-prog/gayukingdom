import React from "react";
import CapitalTracker from "@/components/personal/CapitalTracker";

export default function CapitalPage() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Capital Tracker</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor and track your overall investment capital
        </p>
      </div>
      <CapitalTracker />
    </div>
  );
}
