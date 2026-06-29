"use client";

import React from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import { generateId } from "@/lib/utils";
import api from "@/lib/api";
import { Trash2 } from "lucide-react";
import type { Stock } from "@/types/trading";

export default function SmallStocks() {
  const [stocks, setStocks] = React.useState<Stock[]>([]);
  const [showForm, setShowForm] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    api
      .getSmallStocks()
      .then((data) => {
        if (mounted && Array.isArray(data)) setStocks(data);
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setIsLoaded(true);
      });

    return () => {
      mounted = false;
    };
  }, []);
  const [formData, setFormData] = React.useState({
    symbol: "",
    quantity: "",
    buyPrice: "",
    currentPrice: "",
  });

  const handleAdd = async () => {
    if (
      !formData.symbol ||
      !formData.quantity ||
      !formData.buyPrice ||
      !formData.currentPrice
    ) {
      alert("Please fill all fields");
      return;
    }

    const stock: Stock = {
      id: generateId(),
      symbol: formData.symbol.toUpperCase(),
      quantity: parseFloat(formData.quantity),
      buyPrice: parseFloat(formData.buyPrice),
      currentPrice: parseFloat(formData.currentPrice),
      date: new Date().toISOString().split("T")[0],
    };

    try {
      const created = await api.createSmallStock(stock);
      setStocks((prev) => [...prev, created ?? stock]);
    } catch {
      setStocks((prev) => [...prev, stock]);
    }
    setFormData({ symbol: "", quantity: "", buyPrice: "", currentPrice: "" });
    setShowForm(false);
  };

  const totalValue = stocks.reduce(
    (sum, s) => sum + s.currentPrice * s.quantity,
    0,
  );
  const totalInvested = stocks.reduce(
    (sum, s) => sum + s.buyPrice * s.quantity,
    0,
  );
  const totalGain = totalValue - totalInvested;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
              Invested
            </p>
            <p className="text-3xl font-bold text-orange-500">
              {formatCurrency(totalInvested)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
              Current Value
            </p>
            <p className="text-3xl font-bold text-green-600">
              {formatCurrency(totalValue)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
              Gains
            </p>
            <p
              className={`text-3xl font-bold ${totalGain >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {formatCurrency(totalGain)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Add Stock */}
      {!showForm && (
        <Button onClick={() => setShowForm(true)} variant="primary">
          Add Small Stock
        </Button>
      )}

      {showForm && (
        <Card>
          <CardHeader>
            <h3>Add Stock</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                placeholder="Symbol"
                value={formData.symbol}
                onChange={(e) =>
                  setFormData({ ...formData, symbol: e.target.value })
                }
              />
              <Input
                type="number"
                placeholder="Quantity"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
              />
              <Input
                type="number"
                placeholder="Buy Price"
                value={formData.buyPrice}
                onChange={(e) =>
                  setFormData({ ...formData, buyPrice: e.target.value })
                }
              />
              <Input
                type="number"
                placeholder="Current Price"
                value={formData.currentPrice}
                onChange={(e) =>
                  setFormData({ ...formData, currentPrice: e.target.value })
                }
              />
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={handleAdd}
                >
                  Add
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stocks List */}
      <Card>
        <CardHeader>
          <h3>Holdings</h3>
        </CardHeader>
        <CardContent>
          {stocks.length === 0 ? (
            <p className="text-gray-500">No stocks yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table-responsive">
                <thead>
                  <tr>
                    <th className="table-header">Symbol</th>
                    <th className="table-header">Qty</th>
                    <th className="table-header">Buy Price</th>
                    <th className="table-header">Current</th>
                    <th className="table-header">Value</th>
                    <th className="table-header">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {stocks.map((stock) => (
                    <tr key={stock.id}>
                      <td className="table-cell font-semibold">
                        {stock.symbol}
                      </td>
                      <td className="table-cell">{stock.quantity}</td>
                      <td className="table-cell">
                        {formatCurrency(stock.buyPrice)}
                      </td>
                      <td className="table-cell">
                        {formatCurrency(stock.currentPrice)}
                      </td>
                      <td className="table-cell font-semibold">
                        {formatCurrency(stock.currentPrice * stock.quantity)}
                      </td>
                      <td className="table-cell">
                        <button
                          onClick={async () => {
                            try {
                              await api.deleteSmallStock(stock.id);
                              setStocks((prev) =>
                                prev.filter((s) => s.id !== stock.id),
                              );
                            } catch {
                              setStocks((prev) =>
                                prev.filter((s) => s.id !== stock.id),
                              );
                            }
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
