const BASE_URL = "/api/proxy";

async function handleResponse(res: Response) {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API error ${res.status}: ${text}`);
  }
  try {
    return await res.json();
  } catch {
    return null;
  }
}

// SIP
export async function getSIPs() {
  const res = await fetch(`${BASE_URL}/sips`);
  return handleResponse(res);
}

export async function createSIP(payload: any) {
  const res = await fetch(`${BASE_URL}/sips`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function deleteSIP(id: string) {
  const res = await fetch(`${BASE_URL}/sips/${id}`, { method: "DELETE" });
  return handleResponse(res);
}

// Capital
export async function getCapitalEntries() {
  const res = await fetch(`${BASE_URL}/capital`);
  return handleResponse(res);
}

export async function createCapitalEntry(payload: any) {
  const res = await fetch(`${BASE_URL}/capital`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function deleteCapitalEntry(id: string) {
  const res = await fetch(`${BASE_URL}/capital/${id}`, { method: "DELETE" });
  return handleResponse(res);
}

// Daily routine
export async function getTasks() {
  const res = await fetch(`${BASE_URL}/tasks`);
  return handleResponse(res);
}

export async function createTask(payload: any) {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function updateTask(id: string, payload: any) {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function deleteTask(id: string) {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, { method: "DELETE" });
  return handleResponse(res);
}

// Small stocks
export async function getSmallStocks() {
  const res = await fetch(`${BASE_URL}/small-stocks`);
  return handleResponse(res);
}

export async function createSmallStock(payload: any) {
  const res = await fetch(`${BASE_URL}/small-stocks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function deleteSmallStock(id: string) {
  const res = await fetch(`${BASE_URL}/small-stocks/${id}`, {
    method: "DELETE",
  });
  return handleResponse(res);
}

// Work stocks (journal / dashboard)
export async function createStock(payload: any) {
  const normalizedPayload = {
    ...payload,
    symbol: payload.symbol ?? payload.name,
  };

  const res = await fetch(`${BASE_URL}/stocks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(normalizedPayload),
  });
  return handleResponse(res);
}

export async function getStocks() {
  const res = await fetch(`${BASE_URL}/stocks`);
  return handleResponse(res);
}

export async function deleteStock(id: string) {
  const res = await fetch(`${BASE_URL}/stocks/${id}`, { method: "DELETE" });
  return handleResponse(res);
}

export async function getTrades(query?: Record<string, string | number>) {
  const queryString = query
    ? `?${Object.entries(query)
        .map(
          ([key, value]) =>
            `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
        )
        .join("&")}`
    : "";
  const res = await fetch(`${BASE_URL}/trades${queryString}`);
  return handleResponse(res);
}

export async function createTrade(payload: any) {
  const res = await fetch(`${BASE_URL}/trades`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function updateTrade(id: string, payload: any) {
  const res = await fetch(`${BASE_URL}/trades/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function deleteTrade(id: string) {
  const res = await fetch(`${BASE_URL}/trades/${id}`, { method: "DELETE" });
  return handleResponse(res);
}

export async function getColumns() {
  const res = await fetch(`${BASE_URL}/columns`);
  return handleResponse(res);
}

export async function createColumn(payload: any) {
  const res = await fetch(`${BASE_URL}/columns`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function updateColumn(id: string, payload: any) {
  const res = await fetch(`${BASE_URL}/columns/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handleResponse(res);
}

export async function deleteColumn(id: string) {
  const res = await fetch(`${BASE_URL}/columns/${id}`, { method: "DELETE" });
  return handleResponse(res);
}

export default {
  getSIPs,
  createSIP,
  deleteSIP,
  getCapitalEntries,
  createCapitalEntry,
  deleteCapitalEntry,
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getSmallStocks,
  createSmallStock,
  deleteSmallStock,
  createStock,
  getStocks,
  deleteStock,
  getTrades,
  createTrade,
  updateTrade,
  deleteTrade,
  getColumns,
  createColumn,
  updateColumn,
  deleteColumn,
};
