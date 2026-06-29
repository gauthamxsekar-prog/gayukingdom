"use client";

import { useCallback, useEffect, useState } from "react";
import api from "@/lib/api";
import { Plus, X, ChevronDown } from "lucide-react";
import PnLSummary from "./PnLSummary";
import TradeTable from "./TradeTable";
import type { ColumnHeader, TradeRow, WorkStock } from "@/types/trading";

const today = new Date();

const defaultStocks: WorkStock[] = [];

const defaultColumns: ColumnHeader[] = [
  { id: "col-0", position: 0, label: "Date", col_type: "date", field: "c0" },
  {
    id: "col-1",
    position: 1,
    label: "Entry Price",
    col_type: "number",
    field: "c1",
  },
  {
    id: "col-2",
    position: 2,
    label: "Quantity",
    col_type: "number",
    field: "c2",
  },
  {
    id: "col-3",
    position: 3,
    label: "Sell Price",
    col_type: "number",
    field: "c4",
  },
  {
    id: "col-4",
    position: 4,
    label: "Profit",
    col_type: "number",
    field: "profit",
  },
  {
    id: "col-5",
    position: 5,
    label: "Loss",
    col_type: "number",
    field: "loss",
  },
];

const defaultRows: TradeRow[] = [];

const MONTHS = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "APRIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
];

function generateYears() {
  const y = new Date().getFullYear();
  const years: number[] = [];
  for (let i = y - 3; i <= y + 2; i += 1) years.push(i);
  return years;
}

function calculateProfitLoss(row: TradeRow) {
  const entry = typeof row.c1 === "number" ? row.c1 : 0;
  const quantity = typeof row.c2 === "number" ? row.c2 : 0;
  const sell = typeof row.c4 === "number" ? row.c4 : 0;
  const net = (sell - entry) * quantity;
  return {
    profit: net >= 0 ? net : 0,
    loss: net < 0 ? -net : 0,
  };
}

export default function WorkDashboard() {
  const [stocks, setStocks] = useState<WorkStock[]>([]);
  const [columns, setColumns] = useState<ColumnHeader[]>([]);
  const [allRows, setAllRows] = useState<TradeRow[]>([]);
  const [selectedStockId, setSelectedStockId] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [loading, setLoading] = useState(true);
  const [addingStock, setAddingStock] = useState(false);
  const [newStockName, setNewStockName] = useState("");
  const [stockDropdownOpen, setStockDropdownOpen] = useState(false);

  const loadStocks = async (selectedId?: string) => {
    try {
      const serverStocks = await api.getStocks();
      if (
        serverStocks &&
        Array.isArray(serverStocks) &&
        serverStocks.length > 0
      ) {
        const validStocks = serverStocks.filter((stock): stock is WorkStock =>
          Boolean(stock && typeof stock === "object" && "id" in stock),
        );

        if (validStocks.length > 0) {
          setStocks(validStocks);
          setColumns(defaultColumns);

          const firstValidId = validStocks[0]?.id ?? "";
          if (
            selectedId &&
            validStocks.some((stock) => stock.id === selectedId)
          ) {
            setSelectedStockId(selectedId);
          } else {
            setSelectedStockId(firstValidId);
          }
          return;
        }
      }
    } catch {
      // fallback to default stock list below
    }

    setStocks(defaultStocks);
    setColumns(defaultColumns);
    setSelectedStockId(defaultStocks[0]?.id ?? "");
  };

  const loadColumns = async () => {
    try {
      const serverColumns = await api.getColumns();
      if (
        serverColumns &&
        Array.isArray(serverColumns) &&
        serverColumns.length > 0
      ) {
        const merged = new Map<string, ColumnHeader>(
          defaultColumns.map((col) => [col.id, col]),
        );

        (serverColumns as ColumnHeader[]).forEach((col) => {
          merged.set(col.id, col);
        });

        setColumns(
          Array.from(merged.values()).sort((a, b) => a.position - b.position),
        );
        return;
      }
    } catch {
      // fallback to defaults
    }
    setColumns(defaultColumns);
  };

  const loadTrades = async () => {
    try {
      const serverRows = await api.getTrades();
      if (serverRows && Array.isArray(serverRows)) {
        setAllRows(
          serverRows.map((row: TradeRow) => ({
            ...row,
            ...calculateProfitLoss(row),
          })),
        );
      }
    } catch {
      // keep local state on API error
    }
  };

  useEffect(() => {
    const init = async () => {
      await Promise.all([loadStocks(), loadColumns(), loadTrades()]);
      setLoading(false);
    };

    init();
  }, []);

  const filteredRows = allRows
    .filter(
      (r) =>
        r.stock_id === selectedStockId &&
        r.month === selectedMonth &&
        r.year === selectedYear,
    )
    .sort((a, b) => a.sort_order - b.sort_order);

  const allFilteredRows = allRows.filter(
    (r) => r.month === selectedMonth && r.year === selectedYear,
  );

  const selectedStock = stocks.find((s) => s.id === selectedStockId);

  const handleAddStock = () => {
    const name = newStockName.trim().toUpperCase();
    if (!name) return;

    const newStock: WorkStock = {
      id: `stock-${Date.now()}`,
      name,
      sort_order: stocks.length,
      created_at: new Date().toISOString(),
    };

    (async () => {
      try {
        const created = await api.createStock({ name, symbol: name });
        await loadStocks(created?.id);
      } catch (err) {
        setStocks((prev) => [...prev, newStock]);
        setSelectedStockId(newStock.id);
      } finally {
        setNewStockName("");
        setAddingStock(false);
      }
    })();
  };

  const isLocalStockId = (id: string) => id.startsWith("stock-");

  const handleRemoveStock = (id: string) => {
    if (!window.confirm("Remove this stock and all its data?")) return;
    (async () => {
      let deleted = false;
      if (!isLocalStockId(id)) {
        try {
          await api.deleteStock(id);
          deleted = true;
        } catch {
          // ignore API errors and proceed with local removal
        }
      }

      if (deleted) {
        await loadStocks();
        setAllRows((prev) => prev.filter((r) => r.stock_id !== id));
        if (selectedStockId === id) {
          setSelectedStockId("");
        }
        return;
      }

      const remaining = stocks.filter((s) => s.id !== id);
      setStocks(remaining);
      setAllRows((prev) => prev.filter((r) => r.stock_id !== id));
      if (selectedStockId === id) {
        setSelectedStockId(remaining[0]?.id ?? "");
      }
    })();
  };

  const handleAddRow = async () => {
    if (!selectedStockId) return;
    const maxOrder = filteredRows.reduce(
      (m, r) => Math.max(m, r.sort_order),
      -1,
    );
    const nextRow: TradeRow = {
      id: `row-${Date.now()}`,
      stock_id: selectedStockId,
      month: selectedMonth,
      year: selectedYear,
      c0: new Date().toISOString().split("T")[0],
      c1: null,
      c2: null,
      c3: false,
      c4: null,
      c5: null,
      profit: 0,
      loss: 0,
      sort_order: maxOrder + 1,
      created_at: new Date().toISOString(),
    };

    const newRow = { ...nextRow, ...calculateProfitLoss(nextRow) };
    setAllRows((prev) => [...prev, newRow]);

    try {
      const createdRow = await api.createTrade(newRow);
      if (createdRow && createdRow.id) {
        setAllRows((prev) =>
          prev.map((row) => (row.id === newRow.id ? createdRow : row)),
        );
      }
    } catch {
      // keep optimistic row if API fails
    }
  };

  const handleDeleteRow = async (id: string) => {
    setAllRows((prev) => prev.filter((row) => row.id !== id));
    try {
      await api.deleteTrade(id);
    } catch {
      // ignore delete errors
    }
  };

  const handleUpdateRow = useCallback(
    async (
      id: string,
      field: string,
      value: string | boolean | number | null,
    ) => {
      let updatedRow: TradeRow | null = null;

      setAllRows((prev) =>
        prev.map((row) => {
          if (row.id !== id) return row;
          const next = { ...row, [field]: value };
          if (field === "c1" || field === "c2" || field === "c4") {
            const recalculated = calculateProfitLoss(next);
            updatedRow = { ...next, ...recalculated };
            return updatedRow;
          }
          updatedRow = next;
          return next;
        }),
      );

      try {
        const payload: Record<string, unknown> = { [field]: value };
        if (
          updatedRow &&
          (field === "c1" || field === "c2" || field === "c4")
        ) {
          const { profit, loss } = calculateProfitLoss(updatedRow);
          payload.profit = profit;
          payload.loss = loss;
        }
        await api.updateTrade(id, payload);
      } catch {
        // ignore update errors
      }
    },
    [],
  );

  const handleAddColumn = async () => {
    const nextPosition =
      columns.reduce((max, col) => Math.max(max, col.position), -1) + 1;
    const fieldMap: Record<number, keyof TradeRow> = {
      6: "c6",
      7: "c7",
      8: "c8",
      9: "c9",
    };
    const newColumn: ColumnHeader = {
      id: `col-${Date.now()}`,
      position: nextPosition,
      label: `Column ${nextPosition + 1}`,
      col_type: "text",
      field: fieldMap[nextPosition],
    };

    setColumns((prev) => [...prev, newColumn]);

    try {
      const created = await api.createColumn({
        position: newColumn.position,
        label: newColumn.label,
        col_type: newColumn.col_type,
        field: newColumn.field,
      });
      if (created && created.id) {
        setColumns((prev) =>
          prev.map((col) =>
            col.id === newColumn.id
              ? { ...created, field: created.field ?? newColumn.field }
              : col,
          ),
        );
      }
    } catch {
      // keep optimistic state if API fails
    }
  };

  const handleDeleteColumn = async (colId: string) => {
    if (defaultColumns.some((col) => col.id === colId)) return;
    setColumns((prev) => prev.filter((col) => col.id !== colId));
    try {
      await api.deleteColumn(colId);
    } catch {
      // ignore column delete errors
    }
  };

  const handleMoveColumn = async (
    colId: string,
    direction: "left" | "right",
  ) => {
    const updated = [...columns];
    const index = updated.findIndex((col) => col.id === colId);
    if (index === -1) return;
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= updated.length) return;
    [updated[index], updated[targetIndex]] = [
      updated[targetIndex],
      updated[index],
    ];
    const reordered = updated.map((col, idx) => ({ ...col, position: idx }));
    setColumns(reordered);

    try {
      await Promise.all(
        reordered.map((col) =>
          api.updateColumn(col.id, { position: col.position }),
        ),
      );
    } catch {
      // ignore reorder API errors
    }
  };

  const handleUpdateColumnLabel = useCallback(
    async (colId: string, label: string) => {
      setColumns((prev) =>
        prev.map((col) => (col.id === colId ? { ...col, label } : col)),
      );
      try {
        await api.updateColumn(colId, { label });
      } catch {
        // ignore label update errors
      }
    },
    [],
  );

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-20">
        <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-4 py-6 max-w-7xl mx-auto w-full space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <button
            type="button"
            onClick={() => setStockDropdownOpen((open) => !open)}
            className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 hover:border-amber-400 transition-colors shadow-sm min-w-[160px]"
          >
            <span className="flex-1 text-left">
              {selectedStock?.name ?? "Select Stock"}
            </span>
            <ChevronDown
              size={14}
              className={`transition-transform ${stockDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {stockDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-2xl shadow-lg z-20 min-w-[220px] py-1">
              {stocks.map((stock) => (
                <div
                  key={stock.id}
                  onClick={() => {
                    setSelectedStockId(stock.id);
                    setStockDropdownOpen(false);
                  }}
                  className={`flex items-center justify-between px-4 py-2 cursor-pointer hover:bg-amber-50 text-sm ${
                    stock.id === selectedStockId
                      ? "font-bold text-amber-600"
                      : "text-slate-700"
                  }`}
                >
                  <span>{stock.name}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveStock(stock.id);
                    }}
                    className="text-slate-300 hover:text-red-500 transition-colors ml-3"
                  >
                    <X size={13} />
                  </button>
                </div>
              ))}

              <div className="border-t border-slate-100 mt-1 pt-1">
                {addingStock ? (
                  <div className="px-3 py-1.5 flex items-center gap-2">
                    <input
                      autoFocus
                      value={newStockName}
                      onChange={(e) => setNewStockName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddStock();
                        if (e.key === "Escape") {
                          setAddingStock(false);
                          setNewStockName("");
                        }
                      }}
                      placeholder="Stock name…"
                      className="flex-1 text-sm border-b border-amber-400 outline-none bg-transparent py-0.5 text-slate-700 placeholder-slate-400"
                    />
                    <button
                      type="button"
                      onClick={handleAddStock}
                      className="text-emerald-500 hover:text-emerald-600"
                    >
                      <Plus size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setAddingStock(false);
                        setNewStockName("");
                      }}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setAddingStock(true);
                      setStockDropdownOpen(true);
                    }}
                    className="w-full px-4 py-2 text-sm text-amber-600 hover:bg-amber-50 flex items-center gap-2 font-medium transition-colors"
                  >
                    <Plus size={14} /> Add Stock
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:border-amber-400 outline-none cursor-pointer transition-colors"
        >
          {MONTHS.map((month, index) => (
            <option key={month} value={index + 1}>
              {month}
            </option>
          ))}
        </select>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:border-amber-400 outline-none cursor-pointer transition-colors"
        >
          {generateYears().map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <div className="ml-auto hidden sm:block">
          <h2 className="text-base font-extrabold text-slate-700 tracking-wide uppercase">
            {selectedStock?.name}{" "}
            <span className="text-amber-500">{MONTHS[selectedMonth - 1]}</span>{" "}
            {selectedYear}
          </h2>
        </div>
      </div>

      {stocks.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <PnLSummary
            stocks={stocks}
            rows={allFilteredRows}
            allRows={allRows}
            selectedStockId={selectedStockId}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
          />
        </div>
      )}

      {selectedStockId ? (
        <TradeTable
          columns={columns}
          rows={filteredRows}
          onAddRow={handleAddRow}
          onAddColumn={handleAddColumn}
          onDeleteColumn={handleDeleteColumn}
          onDeleteRow={handleDeleteRow}
          onMoveColumn={handleMoveColumn}
          onUpdateRow={handleUpdateRow}
          onUpdateColumnLabel={handleUpdateColumnLabel}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center text-slate-400">
          <p className="text-sm">Add a stock to get started.</p>
        </div>
      )}

      {stockDropdownOpen && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setStockDropdownOpen(false)}
        />
      )}
    </div>
  );
}
