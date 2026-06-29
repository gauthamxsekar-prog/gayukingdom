import { useEffect, useState } from "react";
import api from "@/lib/api";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { ColumnHeader, TradeRow, WorkStock } from "@/types/trading";

interface Props {
  stocks: WorkStock[];
  rows: TradeRow[];
  allRows: TradeRow[];
  selectedStockId: string;
  selectedMonth: number;
  selectedYear: number;
}

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

function calcPnL(rows: TradeRow[]) {
  let profit = 0;
  let loss = 0;
  let invested = 0;

  rows.forEach((row) => {
    const entry = typeof row.c1 === "number" ? row.c1 : 0;
    const quantity = typeof row.c2 === "number" ? row.c2 : 0;
    const sell = typeof row.c4 === "number" ? row.c4 : null;

    invested += entry * quantity;

    if (sell === null) {
      return;
    }

    const net = (sell - entry) * quantity;
    if (!Number.isFinite(net)) {
      return;
    }

    if (net > 0) {
      profit += net;
    } else if (net < 0) {
      loss += -net;
    }
  });

  const currentNet = profit - loss;
  return { profit, loss, invested, net: invested + currentNet };
}

function fmt(n: number) {
  return n.toLocaleString("en-IN", { maximumFractionDigits: 2 });
}

export default function PnLSummary({
  stocks,
  rows,
  allRows,
  selectedStockId,
  selectedMonth,
  selectedYear,
}: Props) {
  const [overallVisible, setOverallVisible] = useState(true);
  const [selectedStockVisible, setSelectedStockVisible] = useState(false);
  const [monthlyVisible, setMonthlyVisible] = useState(false);
  const [overallRows, setOverallRows] = useState<TradeRow[]>(allRows);
  const [selectedStockOverallRows, setSelectedStockOverallRows] = useState<
    TradeRow[]
  >([]);
  const [selectedStockMonthlyRows, setSelectedStockMonthlyRows] =
    useState<TradeRow[]>(rows);
  const [selectedMonthRows, setSelectedMonthRows] = useState<TradeRow[]>(rows);

  useEffect(() => {
    setSelectedStockVisible(false);
    setMonthlyVisible(false);
  }, [selectedStockId, selectedMonth, selectedYear]);

  const selectedMonthLabel = MONTHS[selectedMonth - 1] ?? "MONTH";

  useEffect(() => {
    const loadOverallRows = async () => {
      try {
        const serverRows = await api.getTrades();
        if (Array.isArray(serverRows)) {
          setOverallRows(serverRows);
          return;
        }
      } catch {
        // fallback to client rows
      }
      setOverallRows(allRows);
    };

    loadOverallRows();
  }, [allRows]);

  useEffect(() => {
    const loadMonthlyRows = async () => {
      try {
        const serverRows = await api.getTrades({
          month: selectedMonth,
          year: selectedYear,
        });
        if (Array.isArray(serverRows)) {
          setSelectedMonthRows(serverRows);
          return;
        }
      } catch {
        // fallback to client rows
      }
      setSelectedMonthRows(rows);
    };

    loadMonthlyRows();
  }, [rows, selectedMonth, selectedYear]);

  useEffect(() => {
    const loadSelectedStockOverallRows = async () => {
      if (!selectedStockId) {
        setSelectedStockOverallRows([]);
        return;
      }

      try {
        const stockRows = await api.getTrades({ stock_id: selectedStockId });
        if (Array.isArray(stockRows)) {
          const filteredRows = stockRows.filter(
            (row) => row.stock_id === selectedStockId,
          );
          setSelectedStockOverallRows(filteredRows);
          return;
        }
      } catch {
        // fallback to client rows
      }

      setSelectedStockOverallRows(
        allRows.filter((row) => row.stock_id === selectedStockId),
      );
    };

    loadSelectedStockOverallRows();
  }, [selectedStockId, allRows]);

  useEffect(() => {
    const loadSelectedStockMonthlyRows = async () => {
      if (!selectedStockId) {
        setSelectedStockMonthlyRows([]);
        return;
      }

      const stock = stocks.find(
        (stockItem) => stockItem.id === selectedStockId,
      );
      const query: Record<string, string | number> = {
        stock_id: selectedStockId,
        month: selectedMonth,
        year: selectedYear,
      };
      if (stock?.name) {
        query.stock_name = stock.name;
      }

      try {
        const stockRows = await api.getTrades(query);
        if (Array.isArray(stockRows)) {
          const filteredRows = stockRows.filter(
            (row) =>
              row.stock_id === selectedStockId &&
              row.month === selectedMonth &&
              row.year === selectedYear,
          );
          setSelectedStockMonthlyRows(filteredRows);
          return;
        }
      } catch {
        // fallback to client rows
      }

      setSelectedStockMonthlyRows(
        allRows.filter(
          (row) =>
            row.stock_id === selectedStockId &&
            row.month === selectedMonth &&
            row.year === selectedYear,
        ),
      );
    };

    loadSelectedStockMonthlyRows();
  }, [selectedStockId, selectedMonth, selectedYear, allRows, stocks]);

  const overall = calcPnL(overallRows);
  const monthOverview = calcPnL(selectedMonthRows);
  const selectedStock = stocks.find((stock) => stock.id === selectedStockId);
  const selectedStockOverall = calcPnL(selectedStockOverallRows);
  const selectedStockMonthly = calcPnL(selectedStockMonthlyRows);

  const monthlyBreakdown = MONTHS.map((monthName, index) => {
    const monthNumber = index + 1;
    const monthRows = selectedStockOverallRows.filter(
      (row) => row.month === monthNumber && row.year === selectedYear,
    );
    const monthStats = calcPnL(monthRows);
    return {
      month: monthNumber,
      label: monthName,
      ...monthStats,
    };
  }).filter(
    ({ profit, loss, month }) =>
      profit !== 0 || loss !== 0 || month === selectedMonth,
  );

  const StatCard = ({
    label,
    value,
    color,
  }: {
    label: string;
    value: number;
    color: "green" | "red" | "blue" | "grey";
  }) => {
    const colors = {
      green: "bg-emerald-50 border-emerald-200 text-emerald-700",
      red: "bg-red-50 border-red-200 text-red-600",
      blue: "bg-blue-50 border-blue-200 text-blue-700",
      grey: "bg-slate-100 border-slate-300 text-slate-700",
    };
    return (
      <div className={`flex-1 rounded-xl border px-5 py-3 ${colors[color]}`}>
        <p className="text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">
          {label}
        </p>
        <p className="text-2xl font-bold">{fmt(value)}</p>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <button
          type="button"
          onClick={() => setOverallVisible((visible) => !visible)}
          className="flex w-full items-center justify-between"
        >
          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-slate-400">
            {overallVisible ? (
              <ChevronDown size={13} />
            ) : (
              <ChevronRight size={13} />
            )}
            Overall P&L for All Stocks
          </span>
        </button>

        {overallVisible && (
          <div className="mt-3 flex gap-3 flex-col md:flex-row">
            <StatCard
              label="Total Invested"
              value={overall.invested}
              color="blue"
            />
            <StatCard
              label="Total Profit"
              value={overall.profit}
              color="green"
            />
            <StatCard label="Total Loss" value={overall.loss} color="red" />
            <StatCard label="Net" value={overall.net} color="grey" />
          </div>
        )}
      </div>

      {selectedStock && (
        <>
          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <button
              type="button"
              onClick={() => setSelectedStockVisible((visible) => !visible)}
              className="flex w-full items-center justify-between"
            >
              <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-slate-400">
                {selectedStockVisible ? (
                  <ChevronDown size={13} />
                ) : (
                  <ChevronRight size={13} />
                )}
                Overall P&L for {selectedStock.name}
              </span>
            </button>
            {selectedStockVisible && (
              <div className="mt-3 flex gap-3 flex-col md:flex-row">
                <StatCard
                  label="Total Invested"
                  value={selectedStockOverall.invested}
                  color="blue"
                />
                <StatCard
                  label="Total Profit"
                  value={selectedStockOverall.profit}
                  color="green"
                />
                <StatCard
                  label="Total Loss"
                  value={selectedStockOverall.loss}
                  color="red"
                />
                <StatCard
                  label="Net"
                  value={selectedStockOverall.net}
                  color="grey"
                />
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <button
              type="button"
              onClick={() => setMonthlyVisible((visible) => !visible)}
              className="flex w-full items-center justify-between"
            >
              <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-slate-400">
                {monthlyVisible ? (
                  <ChevronDown size={13} />
                ) : (
                  <ChevronRight size={13} />
                )}
                Monthly P&L for {selectedStock.name}
              </span>
              <span className="text-sm font-semibold text-slate-600">
                {selectedMonthLabel}
              </span>
            </button>

            {monthlyVisible && (
              <div className="mt-3">
                <div className="flex gap-3 flex-col md:flex-row">
                  <div className="flex-1 rounded-xl border border-blue-200 bg-blue-50 px-5 py-3 text-blue-700">
                    <p className="text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">
                      Total Invested
                    </p>
                    <p className="text-2xl font-bold">
                      {fmt(
                        monthlyBreakdown.find(
                          (item) => item.month === selectedMonth,
                        )?.invested ?? 0,
                      )}
                    </p>
                  </div>
                  <div className="flex-1 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3 text-emerald-700">
                    <p className="text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">
                      Total Profit
                    </p>
                    <p className="text-2xl font-bold">
                      {fmt(
                        monthlyBreakdown.find(
                          (item) => item.month === selectedMonth,
                        )?.profit ?? 0,
                      )}
                    </p>
                  </div>
                  <div className="flex-1 rounded-xl border border-red-200 bg-red-50 px-5 py-3 text-red-600">
                    <p className="text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">
                      Total Loss
                    </p>
                    <p className="text-2xl font-bold">
                      {fmt(
                        monthlyBreakdown.find(
                          (item) => item.month === selectedMonth,
                        )?.loss ?? 0,
                      )}
                    </p>
                  </div>
                  <div className="flex-1 rounded-xl border border-slate-300 bg-slate-100 px-5 py-3 text-slate-700">
                    <p className="text-xs font-semibold uppercase tracking-wider opacity-70 mb-1">
                      Net
                    </p>
                    <p className="text-2xl font-bold">
                      {fmt(
                        monthlyBreakdown.find(
                          (item) => item.month === selectedMonth,
                        )?.net ?? 0,
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
