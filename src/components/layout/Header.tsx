"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  TrendingUp,
  PieChart,
  CheckSquare,
  Menu,
} from "lucide-react";

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + "/");
  };

  return (
    <header className="bg-navy-900 text-white shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-orange-500" />
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold">GAYUKINGDOM</h1>
              <p className="text-sm text-gray-300">Trading Journal</p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
