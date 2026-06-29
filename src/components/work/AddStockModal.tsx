"use client";

import React from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { generateId } from "@/lib/utils";
import api from "@/lib/api";
import { X } from "lucide-react";
import type { Stock } from "@/types/trading";

interface AddStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (stock: Stock) => void;
}

export default function AddStockModal({
  isOpen,
  onClose,
  onAdd,
}: AddStockModalProps) {
  const [formData, setFormData] = React.useState({
    symbol: "",
    quantity: "",
    buyPrice: "",
    currentPrice: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.symbol ||
      !formData.quantity ||
      !formData.buyPrice ||
      !formData.currentPrice
    ) {
      alert("Please fill all required fields");
      return;
    }

    const stock: Stock = {
      id: generateId(),
      symbol: formData.symbol.toUpperCase(),
      quantity: parseFloat(formData.quantity),
      buyPrice: parseFloat(formData.buyPrice),
      currentPrice: parseFloat(formData.currentPrice),
      date: formData.date,
      notes: formData.notes,
    };

    try {
      const created = await api.createStock({
        name: stock.symbol,
        symbol: stock.symbol,
      });
      onAdd(created ?? stock);
    } catch (err) {
      // fallback to local add if API fails
      onAdd(stock);
    }
    setFormData({
      symbol: "",
      quantity: "",
      buyPrice: "",
      currentPrice: "",
      date: new Date().toISOString().split("T")[0],
      notes: "",
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Add Stock</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Symbol *</label>
              <Input
                value={formData.symbol}
                onChange={(e) =>
                  setFormData({ ...formData, symbol: e.target.value })
                }
                placeholder="e.g., TCS, INFY"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Quantity *
              </label>
              <Input
                type="number"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData({ ...formData, quantity: e.target.value })
                }
                placeholder="Number of shares"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Buy Price *
                </label>
                <Input
                  type="number"
                  value={formData.buyPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, buyPrice: e.target.value })
                  }
                  placeholder="Purchase price"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Current Price *
                </label>
                <Input
                  type="number"
                  value={formData.currentPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, currentPrice: e.target.value })
                  }
                  placeholder="Current price"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Date</label>
              <Input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Add any notes..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="flex-1">
                Add Stock
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
