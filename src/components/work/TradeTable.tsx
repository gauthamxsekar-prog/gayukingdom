"use client";

import { useEffect, useRef, useState } from "react";
import {
  Plus,
  Trash2,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { ColumnHeader, TradeRow } from "@/types/trading";

interface Props {
  columns: ColumnHeader[];
  rows: TradeRow[];
  onAddRow: () => void;
  onAddColumn: () => void;
  onDeleteColumn: (id: string) => void;
  onDeleteRow: (id: string) => void;
  onMoveColumn: (id: string, direction: "left" | "right") => void;
  onUpdateRow: (
    id: string,
    field: string,
    value: string | boolean | number | null,
  ) => void;
  onUpdateColumnLabel: (id: string, label: string) => void;
}

function EditableCell({
  value,
  onChange,
  type,
  className = "",
  readOnly = false,
}: {
  value: string | number | boolean | null;
  onChange: (v: string | number | boolean | null) => void;
  type: string;
  className?: string;
  readOnly?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(value ?? ""));
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  useEffect(() => {
    if (!editing) {
      setDraft(String(value ?? ""));
    }
  }, [value, editing]);

  if (type === "boolean") {
    return (
      <div className="flex justify-center">
        <input
          type="checkbox"
          checked={!!value}
          onChange={(e) => onChange(e.target.checked)}
          className="w-4 h-4 accent-amber-500 cursor-pointer"
          disabled={readOnly}
        />
      </div>
    );
  }

  const commit = () => {
    setEditing(false);
    if (type === "number") {
      const n = parseFloat(draft);
      onChange(isNaN(n) ? null : n);
    } else {
      onChange(draft || null);
    }
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        type={type === "number" ? "number" : type === "date" ? "date" : "text"}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") {
            setDraft(String(value ?? ""));
            setEditing(false);
          }
        }}
        className={`w-full px-1.5 py-0.5 border border-amber-400 rounded text-sm outline-none bg-amber-50 ${className}`}
        readOnly={readOnly}
      />
    );
  }

  const display =
    type === "date" && draft
      ? (() => {
          const [y, m, d] = draft.split("-");
          return d && m && y ? `${d}-${m}-${y}` : draft;
        })()
      : draft || "";

  if (readOnly) {
    return (
      <span
        className={`block w-full px-1.5 py-0.5 rounded text-sm min-h-[24px] ${className}`}
      >
        {display}
      </span>
    );
  }

  return (
    <span
      onClick={() => {
        setDraft(String(value ?? ""));
        setEditing(true);
      }}
      className={`block w-full px-1.5 py-0.5 cursor-pointer hover:bg-slate-50 rounded text-sm min-h-[24px] ${className}`}
    >
      {display}
    </span>
  );
}

function EditableHeader({
  col,
  onSave,
  onDelete,
  onMoveLeft,
  onMoveRight,
}: {
  col: ColumnHeader;
  onSave: (label: string) => void;
  onDelete?: () => void;
  onMoveLeft?: () => void;
  onMoveRight?: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(col.label);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const commit = () => {
    setEditing(false);
    if (draft.trim()) onSave(draft.trim());
    else setDraft(col.label);
  };

  if (editing) {
    return (
      <div className="flex items-center gap-1 min-w-[90px]">
        <input
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") commit();
            if (e.key === "Escape") {
              setDraft(col.label);
              setEditing(false);
            }
          }}
          className="w-full text-xs font-bold uppercase tracking-wide border-b-2 border-amber-400 bg-transparent outline-none text-white placeholder-slate-400 py-0.5"
        />
        <button
          onClick={commit}
          className="text-emerald-400 hover:text-emerald-300"
        >
          <Check size={12} />
        </button>
        <button
          onClick={() => {
            setDraft(col.label);
            setEditing(false);
          }}
          className="text-red-400 hover:text-red-300"
        >
          <X size={12} />
        </button>
      </div>
    );
  }

  return (
    <div className="group flex items-center justify-between gap-2 min-w-[90px]">
      <span
        title="Click to edit column name"
        onClick={() => {
          setDraft(col.label);
          setEditing(true);
        }}
        className="cursor-pointer hover:text-amber-300 transition-colors select-none flex items-center gap-1"
      >
        {col.label}
        <span className="opacity-0 group-hover:opacity-100 text-amber-400 text-[10px]">
          ✎
        </span>
      </span>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {onMoveLeft ? (
          <button
            type="button"
            onClick={onMoveLeft}
            className="text-slate-300 hover:text-amber-300"
            title="Move column left"
          >
            <ChevronLeft size={12} />
          </button>
        ) : null}
        {onMoveRight ? (
          <button
            type="button"
            onClick={onMoveRight}
            className="text-slate-300 hover:text-amber-300"
            title="Move column right"
          >
            <ChevronRight size={12} />
          </button>
        ) : null}
        {onDelete ? (
          <button
            type="button"
            onClick={onDelete}
            className="text-slate-300 hover:text-red-400"
            title="Delete column"
          >
            <Trash2 size={12} />
          </button>
        ) : null}
      </div>
    </div>
  );
}

const FIELD_MAP: Record<number, keyof TradeRow> = {
  0: "c0",
  1: "c1",
  2: "c2",
  3: "c4",
  4: "profit",
  5: "loss",
  6: "c6",
  7: "c7",
  8: "c8",
  9: "c9",
};

function deriveProfitLoss(row: TradeRow) {
  const entry =
    typeof row.c1 === "number" ? row.c1 : parseFloat(String(row.c1 ?? ""));
  const quantity =
    typeof row.c2 === "number" ? row.c2 : parseFloat(String(row.c2 ?? ""));
  const sell =
    typeof row.c4 === "number" ? row.c4 : parseFloat(String(row.c4 ?? ""));
  const net = (sell - entry) * quantity;
  const round = (n: number) => Number(n.toFixed(2));

  return {
    profit: Number.isFinite(net) && net > 0 ? round(net) : 0,
    loss: Number.isFinite(net) && net < 0 ? round(-net) : 0,
  };
}

export default function TradeTable({
  columns,
  rows,
  onAddRow,
  onAddColumn,
  onDeleteColumn,
  onDeleteRow,
  onMoveColumn,
  onUpdateRow,
  onUpdateColumnLabel,
}: Props) {
  const visibleColumns = columns.filter(
    (col) => !["notes", "action"].includes(col.label.toLowerCase()),
  );

  return (
    <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-slate-800 text-white">
              {visibleColumns.map((col, idx) => (
                <th
                  key={col.id}
                  className="px-3 py-3 text-left text-xs font-bold uppercase tracking-wider whitespace-nowrap border-r border-slate-700 last:border-r-0"
                >
                  <EditableHeader
                    col={col}
                    onSave={(label) => onUpdateColumnLabel(col.id, label)}
                    onDelete={() => onDeleteColumn(col.id)}
                    onMoveLeft={
                      idx > 0 ? () => onMoveColumn(col.id, "left") : undefined
                    }
                    onMoveRight={
                      idx < visibleColumns.length - 1
                        ? () => onMoveColumn(col.id, "right")
                        : undefined
                    }
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={row.id}
                className={`border-t border-slate-100 hover:bg-slate-50 transition-colors ${
                  idx % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                }`}
              >
                {visibleColumns.map((col) => {
                  const defaultField =
                    FIELD_MAP[col.position] ??
                    (`c${col.position}` as keyof TradeRow);
                  const field = col.field ?? defaultField;
                  const value = row[field] as string | number | boolean | null;
                  const cellValue =
                    field === "profit" || field === "loss"
                      ? deriveProfitLoss(row)[field]
                      : value;
                  return (
                    <td
                      key={col.id}
                      className="px-2 py-1.5 border-r border-slate-100 last:border-r-0"
                    >
                      <EditableCell
                        type={col.col_type}
                        value={cellValue}
                        onChange={(v) => onUpdateRow(row.id, field, v)}
                        readOnly={field === "profit" || field === "loss"}
                        className={
                          field === "profit"
                            ? typeof cellValue === "number" && cellValue > 0
                              ? "text-emerald-600 font-semibold"
                              : "text-slate-500"
                            : field === "loss"
                              ? typeof cellValue === "number" && cellValue > 0
                                ? "text-red-500 font-semibold"
                                : "text-slate-500"
                              : ""
                        }
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="px-4 py-8 text-center text-slate-400 text-sm"
                >
                  No trades yet. Click "+ Add Row" to begin.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className="border-t border-slate-100 bg-slate-50 px-4 py-3 flex flex-wrap gap-3 items-center">
        <button
          type="button"
          onClick={onAddRow}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-amber-600 font-medium transition-colors"
        >
          <Plus size={16} /> Add Row
        </button>
        <button
          type="button"
          onClick={onAddColumn}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-amber-600 font-medium transition-colors"
        >
          <Plus size={16} /> Add Column
        </button>
      </div>
    </div>
  );
}
