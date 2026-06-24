"use client";

import React from "react";
import Link from "next/link";
import { SummaryCard } from "@/components/ui/SummaryCard";
import { BarChart3, TrendingUp, PieChart, CheckSquare } from "lucide-react";

export default function Home() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome to your Trading Dashboard
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <SummaryCard
          title="Stock Journal"
          value="Manage"
          subtext="Track your trades"
          icon={<BarChart3 className="w-6 h-6 text-orange-500" />}
        />
        <SummaryCard
          title="SIP Tracker"
          value="Invest"
          subtext="Monitor SIPs"
          icon={<TrendingUp className="w-6 h-6 text-orange-500" />}
        />
        <SummaryCard
          title="Capital"
          value="Track"
          subtext="Monitor capital"
          icon={<PieChart className="w-6 h-6 text-orange-500" />}
        />
        <SummaryCard
          title="Routine"
          value="Organize"
          subtext="Daily tasks"
          icon={<CheckSquare className="w-6 h-6 text-orange-500" />}
        />
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/work">
          <div className="p-8 bg-gradient-to-br from-navy-800 to-navy-900 text-white rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <BarChart3 className="w-12 h-12 mb-4 text-orange-500" />
            <h2 className="text-2xl font-bold mb-2">Work</h2>
            <p className="text-gray-300">
              Manage stock journal and track your trading portfolio
            </p>
          </div>
        </Link>

        <Link href="/personal/sip">
          <div className="p-8 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
            <TrendingUp className="w-12 h-12 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Personal</h2>
            <p className="text-orange-100">
              Explore SIPs, capital tracking, and daily routines
            </p>
          </div>
        </Link>
      </div>

      {/* Features Section */}
      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-navy-700">
        <h2 className="text-2xl font-bold mb-6">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Stock Tracking",
              desc: "Monitor your stock portfolio with real-time data",
            },
            {
              title: "SIP Management",
              desc: "Track and manage your systematic investment plans",
            },
            {
              title: "Capital Tracking",
              desc: "Keep tabs on your overall investment capital",
            },
            {
              title: "Daily Routine",
              desc: "Organize and track your daily tasks and goals",
            },
            {
              title: "Local Storage",
              desc: "All data is saved locally on your device",
            },
            {
              title: "Responsive Design",
              desc: "Works seamlessly on all devices",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="p-4 bg-white dark:bg-navy-800 rounded-lg border border-gray-200 dark:border-navy-700"
            >
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
