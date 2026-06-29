"use client";

import React from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { formatCurrency } from "@/lib/utils";
import { generateId } from "@/lib/utils";
import api from "@/lib/api";
import { Trash2 } from "lucide-react";
import type { SIPEntry } from "@/types/trading";

export default function SIPTracker() {
  const [entries, setEntries] = React.useState<SIPEntry[]>([]);
  const [showForm, setShowForm] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [formData, setFormData] = React.useState<{
    name: string;
    amount: string;
    frequency: "monthly" | "quarterly" | "yearly";
    startDate: string;
  }>({
    name: "",
    amount: "",
    frequency: "monthly",
    startDate: new Date().toISOString().split("T")[0],
  });

  // Load from server on mount
  React.useEffect(() => {
    let mounted = true;
    api
      .getSIPs()
      .then((data) => {
        if (mounted && Array.isArray(data)) {
          setEntries(data);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setIsLoaded(true);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleAdd = () => {
    if (!formData.name || !formData.amount) {
      alert("Please fill all fields");
      return;
    }

    const entry: SIPEntry = {
      id: generateId(),
      name: formData.name,
      amount: parseFloat(formData.amount),
      frequency: formData.frequency,
      startDate: formData.startDate,
      investedAmount: parseFloat(formData.amount),
      currentValue: parseFloat(formData.amount) * 1.05, // Assumed 5% growth
      status: "active",
    };

    // call API to create
    create();

    async function create() {
      try {
        const created = await api.createSIP(entry);
        setEntries((prev) => [...prev, created ?? entry]);
      } catch {
        setEntries((prev) => [...prev, entry]);
      }
    }
    setFormData({
      name: "",
      amount: "",
      frequency: "monthly",
      startDate: new Date().toISOString().split("T")[0],
    });
    setShowForm(false);
  };

  const totalInvested = entries.reduce((sum, e) => sum + e.investedAmount, 0);
  const totalCurrent = entries.reduce((sum, e) => sum + e.currentValue, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
              Total Invested
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
              {formatCurrency(totalCurrent)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
              Gains
            </p>
            <p className="text-3xl font-bold text-blue-600">
              {formatCurrency(totalCurrent - totalInvested)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Add New SIP */}
      {!showForm && (
        <Button onClick={() => setShowForm(true)} variant="primary">
          Add SIP
        </Button>
      )}

      {showForm && (
        <Card>
          <CardHeader>
            <h3>Add New SIP</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                placeholder="Fund Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <Input
                type="number"
                placeholder="Monthly Amount"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
              />
              <Select
                value={formData.frequency}
                onChange={(e) => {
                  const value = e.target.value as
                    | "monthly"
                    | "quarterly"
                    | "yearly";
                  setFormData({
                    ...formData,
                    frequency: value,
                  });
                }}
                options={[
                  { label: "Monthly", value: "monthly" },
                  { label: "Quarterly", value: "quarterly" },
                  { label: "Yearly", value: "yearly" },
                ]}
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
                  Add SIP
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* SIP List */}
      <Card>
        <CardHeader>
          <h3>Active SIPs</h3>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <p className="text-gray-500">No SIPs added yet</p>
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
                      {formatCurrency(entry.amount)}/month • {entry.frequency}
                    </p>
                  </div>
                  <button
                    onClick={async () => {
                      try {
                        await api.deleteSIP(entry.id);
                        setEntries((prev) =>
                          prev.filter((e) => e.id !== entry.id),
                        );
                      } catch {
                        setEntries((prev) =>
                          prev.filter((e) => e.id !== entry.id),
                        );
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
