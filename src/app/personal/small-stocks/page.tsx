import React from "react";
import SmallStocks from "@/components/personal/SmallStocks";

export default function SmallStocksPage() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Small Stocks</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your small stock investments
        </p>
      </div>
      <SmallStocks />
    </div>
  );
}
