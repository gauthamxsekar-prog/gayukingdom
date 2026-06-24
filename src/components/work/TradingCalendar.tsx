"use client";

import React from "react";
import Select from "@/components/ui/Select";
import { getMonthName } from "@/lib/utils";

interface DateFiltersProps {
  month: number;
  year: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}

export default function DateFilters({
  month,
  year,
  onMonthChange,
  onYearChange,
}: DateFiltersProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
  const months = Array.from({ length: 12 }, (_, i) => ({
    label: getMonthName(i + 1),
    value: String(i + 1),
  }));

  return (
    <div className="filter-bar">
      <div className="flex-1 min-w-[200px]">
        <label className="block text-sm font-medium mb-2">Month</label>
        <Select
          value={String(month)}
          onChange={(e) => onMonthChange(parseInt(e.target.value))}
          options={months}
        />
      </div>
      <div className="flex-1 min-w-[200px]">
        <label className="block text-sm font-medium mb-2">Year</label>
        <Select
          value={String(year)}
          onChange={(e) => onYearChange(parseInt(e.target.value))}
          options={years.map((y) => ({
            label: String(y),
            value: String(y),
          }))}
        />
      </div>
    </div>
  );
}
