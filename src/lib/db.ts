import { Stock, StockJournal, SIPEntry, CapitalEntry, RoutineTask } from '@/types/trading'

const STORAGE_KEYS = {
  STOCK_JOURNAL: 'trading_stock_journal',
  SIP_TRACKER: 'trading_sip_tracker',
  CAPITAL_TRACKER: 'trading_capital_tracker',
  SMALL_STOCKS: 'trading_small_stocks',
  DAILY_ROUTINE: 'trading_daily_routine',
}

// Stock Journal Storage
export const stockJournalStorage = {
  get: (): StockJournal[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(STORAGE_KEYS.STOCK_JOURNAL)
    return data ? JSON.parse(data) : []
  },

  save: (journals: StockJournal[]): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.STOCK_JOURNAL, JSON.stringify(journals))
  },

  getByMonth: (month: number, year: number): StockJournal | undefined => {
    const journals = stockJournalStorage.get()
    return journals.find(j => j.month === month && j.year === year)
  },

  addOrUpdate: (journal: StockJournal): void => {
    const journals = stockJournalStorage.get()
    const index = journals.findIndex(j => j.month === journal.month && j.year === journal.year)
    if (index > -1) {
      journals[index] = journal
    } else {
      journals.push(journal)
    }
    stockJournalStorage.save(journals)
  },
}

// SIP Tracker Storage
export const sipTrackerStorage = {
  get: (): SIPEntry[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(STORAGE_KEYS.SIP_TRACKER)
    return data ? JSON.parse(data) : []
  },

  save: (entries: SIPEntry[]): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.SIP_TRACKER, JSON.stringify(entries))
  },

  add: (entry: SIPEntry): void => {
    const entries = sipTrackerStorage.get()
    entries.push(entry)
    sipTrackerStorage.save(entries)
  },

  update: (id: string, updates: Partial<SIPEntry>): void => {
    const entries = sipTrackerStorage.get()
    const index = entries.findIndex(e => e.id === id)
    if (index > -1) {
      entries[index] = { ...entries[index], ...updates }
      sipTrackerStorage.save(entries)
    }
  },

  delete: (id: string): void => {
    const entries = sipTrackerStorage.get().filter(e => e.id !== id)
    sipTrackerStorage.save(entries)
  },
}

// Capital Tracker Storage
export const capitalTrackerStorage = {
  get: (): CapitalEntry[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(STORAGE_KEYS.CAPITAL_TRACKER)
    return data ? JSON.parse(data) : []
  },

  save: (entries: CapitalEntry[]): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.CAPITAL_TRACKER, JSON.stringify(entries))
  },

  add: (entry: CapitalEntry): void => {
    const entries = capitalTrackerStorage.get()
    entries.push(entry)
    capitalTrackerStorage.save(entries)
  },

  update: (id: string, updates: Partial<CapitalEntry>): void => {
    const entries = capitalTrackerStorage.get()
    const index = entries.findIndex(e => e.id === id)
    if (index > -1) {
      entries[index] = { ...entries[index], ...updates }
      capitalTrackerStorage.save(entries)
    }
  },

  delete: (id: string): void => {
    const entries = capitalTrackerStorage.get().filter(e => e.id !== id)
    capitalTrackerStorage.save(entries)
  },
}

// Small Stocks Storage
export const smallStocksStorage = {
  get: (): Stock[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(STORAGE_KEYS.SMALL_STOCKS)
    return data ? JSON.parse(data) : []
  },

  save: (stocks: Stock[]): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.SMALL_STOCKS, JSON.stringify(stocks))
  },

  add: (stock: Stock): void => {
    const stocks = smallStocksStorage.get()
    stocks.push(stock)
    smallStocksStorage.save(stocks)
  },

  delete: (id: string): void => {
    const stocks = smallStocksStorage.get().filter(s => s.id !== id)
    smallStocksStorage.save(stocks)
  },
}

// Daily Routine Storage
export const dailyRoutineStorage = {
  get: (): RoutineTask[] => {
    if (typeof window === 'undefined') return []
    const data = localStorage.getItem(STORAGE_KEYS.DAILY_ROUTINE)
    return data ? JSON.parse(data) : []
  },

  save: (tasks: RoutineTask[]): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem(STORAGE_KEYS.DAILY_ROUTINE, JSON.stringify(tasks))
  },

  getByDate: (date: string): RoutineTask[] => {
    return dailyRoutineStorage.get().filter(t => t.date === date)
  },

  add: (task: RoutineTask): void => {
    const tasks = dailyRoutineStorage.get()
    tasks.push(task)
    dailyRoutineStorage.save(tasks)
  },

  update: (id: string, updates: Partial<RoutineTask>): void => {
    const tasks = dailyRoutineStorage.get()
    const index = tasks.findIndex(t => t.id === id)
    if (index > -1) {
      tasks[index] = { ...tasks[index], ...updates }
      dailyRoutineStorage.save(tasks)
    }
  },

  delete: (id: string): void => {
    const tasks = dailyRoutineStorage.get().filter(t => t.id !== id)
    dailyRoutineStorage.save(tasks)
  },

  toggleComplete: (id: string): void => {
    const tasks = dailyRoutineStorage.get()
    const task = tasks.find(t => t.id === id)
    if (task) {
      task.completed = !task.completed
      dailyRoutineStorage.save(tasks)
    }
  },
}
