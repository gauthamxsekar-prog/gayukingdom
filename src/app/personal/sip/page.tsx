import React from "react";
import SIPTracker from "@/components/personal/SIPTracker";

export default function SIPPage() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">SIP Tracker</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track and manage your Systematic Investment Plans
        </p>
      </div>
      <SIPTracker />
    </div>
  );
}
