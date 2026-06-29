// Stock-related types
export interface Stock {
  id: string;
  symbol: string;
  quantity: number;
  buyPrice: number;
  currentPrice: number;
  date: string;
  notes?: string;
}

export interface StockJournal {
  id: string;
  stocks: Stock[];
  month: number;
  year: number;
  createdAt: string;
  updatedAt: string;
}

// SIP Tracker types
export interface SIPEntry {
  id: string;
  name: string;
  amount: number;
  frequency: "monthly" | "quarterly" | "yearly";
  startDate: string;
  endDate?: string;
  investedAmount: number;
  currentValue: number;
  status: "active" | "completed" | "paused";
}

// Capital Tracker types
export interface CapitalEntry {
  id: string;
  name: string;
  initialAmount: number;
  currentAmount: number;
  date: string;
  category: string;
  notes?: string;
}

// Daily Routine types
export interface RoutineTask {
  id: string;
  title: string;
  completed: boolean;
  time?: string;
  category: string;
  date: string;
}

// Filter types
export interface DateFilter {
  month: number;
  year: number;
}

export interface ColumnHeader {
  id: string;
  position: number;
  label: string;
  col_type: "text" | "number" | "boolean" | "date";
  field?: keyof TradeRow;
}

export interface TradeRow {
  id: string;
  stock_id: string;
  month: number;
  year: number;
  c0: string | null;
  c1: number | null;
  c2: number | null;
  c3: boolean;
  c4: number | null;
  c5: string | null;
  c6?: string | null;
  c7?: string | null;
  c8?: string | null;
  c9?: string | null;
  profit: number;
  loss: number;
  sort_order: number;
  created_at: string;
}

export interface WorkStock {
  id: string;
  name: string;
  sort_order: number;
  created_at: string;
}
