"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, User } from "lucide-react";

type TabKey = "work" | "personal";

interface TabsProps {
  active?: TabKey;
  onChange?: (tab: TabKey) => void;
}

export default function Tabs({ active, onChange }: TabsProps) {
  const pathname = usePathname() || "/";

  const inferred: TabKey = pathname.startsWith("/personal")
    ? "personal"
    : "work";
  const activeTab = active ?? inferred;

  const handleClick = (tab: TabKey) => {
    onChange?.(tab);
  };

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex space-x-8 h-14 items-end">
          <Link
            href="/work"
            onClick={() => handleClick("work")}
            className={
              "inline-flex items-center gap-2 pb-2 text-sm font-medium " +
              (activeTab === "work"
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-gray-500")
            }
          >
            <Briefcase
              className={
                activeTab === "work"
                  ? "w-5 h-5 text-orange-500"
                  : "w-5 h-5 text-gray-400"
              }
            />
            Work
          </Link>

          <Link
            href="/personal"
            onClick={() => handleClick("personal")}
            className={
              "inline-flex items-center gap-2 pb-2 text-sm font-medium " +
              (activeTab === "personal"
                ? "text-orange-500 border-b-2 border-orange-500"
                : "text-gray-500")
            }
          >
            <User
              className={
                activeTab === "personal"
                  ? "w-5 h-5 text-orange-500"
                  : "w-5 h-5 text-gray-400"
              }
            />
            Personal
          </Link>
        </nav>
      </div>
    </div>
  );
}
