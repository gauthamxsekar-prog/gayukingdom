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
  frequency: 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
  endDate?: string;
  investedAmount: number;
  currentValue: number;
  status: 'active' | 'completed' | 'paused';
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

// Dashboard summary types
export interface DashboardSummary {
  totalStockValue: number;
  totalInvestment: number;
  totalSIPAmount: number;
  totalCapital: number;
  completedTasks: number;
  totalTasks: number;
}
