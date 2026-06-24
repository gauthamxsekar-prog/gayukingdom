"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  TrendingUp,
  PieChart,
  CheckSquare,
  Zap,
  DollarSign,
  X,
} from "lucide-react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + "/");
  };

  const workItems = [
    { icon: BarChart3, label: "Stock Journal", href: "/work" },
  ];

  const personalItems = [
    { icon: TrendingUp, label: "SIP Tracker", href: "/personal/sip" },
    { icon: DollarSign, label: "Capital Tracker", href: "/personal/capital" },
    { icon: Zap, label: "Small Stocks", href: "/personal/small-stocks" },
    { icon: CheckSquare, label: "Daily Routine", href: "/personal/routine" },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-30"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:static inset-y-0 left-0 z-40 w-64 bg-navy-800 text-white",
          "transform transition-transform duration-300 ease-in-out md:transform-none",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="h-full flex flex-col">
          {/* Close Button for Mobile */}
          <div className="md:hidden flex items-center justify-between p-4">
            <h2 className="font-bold">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-navy-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Work Section */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Work
              </p>
              <ul className="space-y-2">
                {workItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                          isActive(item.href)
                            ? "bg-orange-500 text-white"
                            : "text-gray-300 hover:bg-navy-700",
                        )}
                        onClick={onClose}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Personal Section */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Personal
              </p>
              <ul className="space-y-2">
                {personalItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                          isActive(item.href)
                            ? "bg-orange-500 text-white"
                            : "text-gray-300 hover:bg-navy-700",
                        )}
                        onClick={onClose}
                      >
                        <Icon className="w-5 h-5" />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-navy-700">
            <p className="text-xs text-gray-400">© 2024 Trading Dashboard</p>
          </div>
        </div>
      </aside>
    </>
  );
}
