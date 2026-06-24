"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/ui/Button";
import { SummaryCard } from "@/components/ui/SummaryCard";
import StocksTable from "@/components/work/StockSelector";
import AddStockModal from "@/components/work/AddStockModal";
import DateFilters from "@/components/work/TradingCalendar";
import { stockJournalStorage } from "@/lib/db";
import { getCurrentMonthYear, formatCurrency } from "@/lib/utils";
import { BarChart3 } from "lucide-react";
import type { Stock, StockJournal } from "@/types/trading";

export default function WorkPage() {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState(getCurrentMonthYear());

  // Load stocks on mount
  useEffect(() => {
    const journal = stockJournalStorage.getByMonth(filter.month, filter.year);
    setStocks(journal?.stocks || []);
  }, [filter]);

  // Save stocks to storage
  useEffect(() => {
    const journal: StockJournal = {
      id: `${filter.month}-${filter.year}`,
      stocks,
      month: filter.month,
      year: filter.year,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    stockJournalStorage.addOrUpdate(journal);
  }, [stocks, filter]);

  const handleAddStock = (stock: Stock) => {
    setStocks([...stocks, stock]);
  };

  const handleDeleteStock = (id: string) => {
    setStocks(stocks.filter((s) => s.id !== id));
  };

  const totalValue = stocks.reduce(
    (sum, s) => sum + s.currentPrice * s.quantity,
    0,
  );
  const totalInvested = stocks.reduce(
    (sum, s) => sum + s.buyPrice * s.quantity,
    0,
  );
  const totalReturn = totalValue - totalInvested;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Stock Journal</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage and track your stock portfolio
        </p>
      </div>

      {/* Filters */}
      <DateFilters
        month={filter.month}
        year={filter.year}
        onMonthChange={(month) => setFilter({ ...filter, month })}
        onYearChange={(year) => setFilter({ ...filter, year })}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <SummaryCard
          title="Total Invested"
          value={formatCurrency(totalInvested)}
          icon={<BarChart3 className="w-6 h-6 text-orange-500" />}
        />
        <SummaryCard
          title="Current Value"
          value={formatCurrency(totalValue)}
          variant="highlight"
          icon={<BarChart3 className="w-6 h-6" />}
        />
        <SummaryCard
          title="Total Return"
          value={formatCurrency(totalReturn)}
          subtext={`${((totalReturn / totalInvested) * 100).toFixed(2)}% return`}
          icon={<BarChart3 className="w-6 h-6 text-orange-500" />}
        />
      </div>

      {/* Add Stock Button */}
      <div className="mb-6">
        <Button onClick={() => setShowModal(true)} variant="primary">
          + Add Stock
        </Button>
      </div>

      {/* Stocks Table */}
      <StocksTable stocks={stocks} onDelete={handleDeleteStock} />

      {/* Modal */}
      <AddStockModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAdd={handleAddStock}
      />
    </div>
  );
}
