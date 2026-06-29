"use client";

import React from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import { generateId } from "@/lib/utils";
import api from "@/lib/api";
import { Trash2 } from "lucide-react";
import type { CapitalEntry } from "@/types/trading";

export default function CapitalTracker() {
  const [entries, setEntries] = React.useState<CapitalEntry[]>([]);
  const [showForm, setShowForm] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    api
      .getCapitalEntries()
      .then((data) => {
        if (mounted && Array.isArray(data)) setEntries(data);
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
    name: "",
    initialAmount: "",
    currentAmount: "",
    category: "investment",
  });

  const handleAdd = async () => {
    if (!formData.name || !formData.initialAmount || !formData.currentAmount) {
      alert("Please fill all fields");
      return;
    }

    const entry: CapitalEntry = {
      id: generateId(),
      name: formData.name,
      initialAmount: parseFloat(formData.initialAmount),
      currentAmount: parseFloat(formData.currentAmount),
      date: new Date().toISOString().split("T")[0],
      category: formData.category,
    };

    try {
      const created = await api.createCapitalEntry(entry);
      setEntries((prev) => [...prev, created ?? entry]);
    } catch {
      setEntries((prev) => [...prev, entry]);
    }
    setFormData({
      name: "",
      initialAmount: "",
      currentAmount: "",
      category: "investment",
    });
    setShowForm(false);
  };

  const totalInitial = entries.reduce((sum, e) => sum + e.initialAmount, 0);
  const totalCurrent = entries.reduce((sum, e) => sum + e.currentAmount, 0);
  const totalGains = totalCurrent - totalInitial;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
              Initial Capital
            </p>
            <p className="text-3xl font-bold text-orange-500">
              {formatCurrency(totalInitial)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
              Current Value
            </p>
            <p className="text-3xl font-bold text-green-600">
              {formatCurrency(totalCurrent)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
              Gains/Losses
            </p>
            <p
              className={`text-3xl font-bold ${totalGains >= 0 ? "text-green-600" : "text-red-600"}`}
            >
              {formatCurrency(totalGains)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Add Form */}
      {!showForm && (
        <Button onClick={() => setShowForm(true)} variant="primary">
          Add Capital Entry
        </Button>
      )}

      {showForm && (
        <Card>
          <CardHeader>
            <h3>Add Capital Entry</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                placeholder="Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <Input
                type="number"
                placeholder="Initial Amount"
                value={formData.initialAmount}
                onChange={(e) =>
                  setFormData({ ...formData, initialAmount: e.target.value })
                }
              />
              <Input
                type="number"
                placeholder="Current Amount"
                value={formData.currentAmount}
                onChange={(e) =>
                  setFormData({ ...formData, currentAmount: e.target.value })
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

      {/* List */}
      <Card>
        <CardHeader>
          <h3>Capital Entries</h3>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <p className="text-gray-500">No entries yet</p>
          ) : (
            <div className="space-y-4">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 border border-gray-200 dark:border-navy-700 rounded-lg flex items-center justify-between"
                >
                  <div>
                    <h4 className="font-semibold">{entry.name}</h4>
                    <p className="text-sm text-gray-500">
                      {formatCurrency(entry.initialAmount)} →{" "}
                      {formatCurrency(entry.currentAmount)}
                    </p>
                  </div>
                  <button
                    onClick={async () => {
                      try {
                        await api.deleteCapitalEntry(entry.id);
                        setEntries((prev) => prev.filter((e) => e.id !== entry.id));
                      } catch {
                        setEntries((prev) => prev.filter((e) => e.id !== entry.id));
                      }
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
