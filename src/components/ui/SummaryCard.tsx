"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SummaryCardProps {
  title: string;
  value: string;
  subtext?: string;
  icon?: React.ReactNode;
  variant?: "default" | "highlight";
}

export function SummaryCard({
  title,
  value,
  subtext,
  icon,
  variant = "default",
}: SummaryCardProps) {
  return (
    <div
      className={cn(
        "p-6 rounded-lg shadow-md",
        variant === "default"
          ? "bg-white dark:bg-navy-800 border border-gray-200"
          : "bg-gradient-to-br from-orange-500 to-orange-600 text-white",
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p
            className={cn(
              "text-sm font-medium mb-2",
              variant === "default"
                ? "text-gray-500 dark:text-gray-400"
                : "text-orange-100",
            )}
          >
            {title}
          </p>
          <p className="text-2xl font-bold">{value}</p>
          {subtext && (
            <p
              className={cn(
                "text-xs mt-2",
                variant === "default" ? "text-gray-500" : "text-orange-100",
              )}
            >
              {subtext}
            </p>
          )}
        </div>
        {icon && (
          <div
            className={cn(
              "p-2 rounded-lg",
              variant === "default"
                ? "bg-orange-50 dark:bg-navy-700"
                : "bg-orange-400 bg-opacity-30",
            )}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
