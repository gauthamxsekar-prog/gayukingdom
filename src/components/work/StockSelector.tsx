"use client";

import React from "react";
import { formatCurrency, formatPercent, calculateReturn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import type { Stock } from "@/types/trading";
import { Trash2, Edit2 } from "lucide-react";

interface StocksTableProps {
  stocks: Stock[];
  onDelete: (id: string) => void;
  onEdit?: (stock: Stock) => void;
}

export default function StocksTable({
  stocks,
  onDelete,
  onEdit,
}: StocksTableProps) {
  if (stocks.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No stocks added yet
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <h3>Your Holdings</h3>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="table-responsive">
            <thead>
              <tr>
                <th className="table-header">Symbol</th>
                <th className="table-header">Quantity</th>
                <th className="table-header">Buy Price</th>
                <th className="table-header">Current Price</th>
                <th className="table-header">Value</th>
                <th className="table-header">Return</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock) => {
                const returnAmount = stock.currentPrice - stock.buyPrice;
                const returnPercent = calculateReturn(
                  stock.buyPrice,
                  stock.currentPrice,
                );
                const totalValue = stock.currentPrice * stock.quantity;

                return (
                  <tr
                    key={stock.id}
                    className="hover:bg-gray-50 dark:hover:bg-navy-700"
                  >
                    <td className="table-cell font-semibold">{stock.symbol}</td>
                    <td className="table-cell">{stock.quantity}</td>
                    <td className="table-cell">
                      {formatCurrency(stock.buyPrice)}
                    </td>
                    <td className="table-cell">
                      {formatCurrency(stock.currentPrice)}
                    </td>
                    <td className="table-cell font-semibold">
                      {formatCurrency(totalValue)}
                    </td>
                    <td
                      className={`table-cell font-semibold ${
                        returnPercent >= 0
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {formatCurrency(returnAmount)} (
                      {formatPercent(returnPercent)})
                    </td>
                    <td className="table-cell">
                      <div className="flex gap-2">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(stock)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => onDelete(stock.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
