// ---------------------------------------------------------------------------
// Local storage data layer.
// Everything the app reads/writes goes through this file. When you move to a
// real backend later, you mostly just need to rewrite the functions in this
// file to call your API instead of localStorage - the pages/components won't
// need to change much because they only ever call these functions.
// ---------------------------------------------------------------------------

const KEYS = {
  PATIENTS: 'silvaclinic_patients',
  STOCK: 'silvaclinic_stock',
  STOCK_COUNTS: 'silvaclinic_stock_counts',
  RECEIPTS: 'silvaclinic_receipts',
  LENDING: 'silvaclinic_lending',
  FINANCE: 'silvaclinic_finance',
  SETTINGS: 'silvaclinic_settings',
}

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value))
}

export function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

export function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

// ---------------------------- Patients ------------------------------------
// Patient shape:
// {
//   id, name, phone, openingBalance, createdAt,
//   entries: [
//     {
//       id, date, person,           // e.g. "Father", "Mother", "Child - Junior"
//       items: [{ description, amount }],      // drugs / acts done
//       labTests: [{ description, amount }],    // optional
//       wound: { description, amount } | null,  // optional wound treatment
//       condition: string | '',       // e.g. "Typhoid" - marks this as a dose/course
//       payment: number,              // money paid this visit
//       note: string,
//     }
//   ]
// }

export const patientsApi = {
  getAll: () => load(KEYS.PATIENTS, []),
  saveAll: (list) => save(KEYS.PATIENTS, list),
  getById: (id) => patientsApi.getAll().find((p) => p.id === id),
  add: (patient) => {
    const list = patientsApi.getAll()
    list.push(patient)
    patientsApi.saveAll(list)
    return patient
  },
  update: (id, updaterFn) => {
    const list = patientsApi.getAll()
    const idx = list.findIndex((p) => p.id === id)
    if (idx > -1) {
      list[idx] = updaterFn(list[idx])
      patientsApi.saveAll(list)
      return list[idx]
    }
    return null
  },
  remove: (id) => {
    patientsApi.saveAll(patientsApi.getAll().filter((p) => p.id !== id))
  },
}

// ------------------------------ Stock --------------------------------------
// Stock item: { id, name, unit, quantity, reorderLevel }
export const stockApi = {
  getAll: () => load(KEYS.STOCK, []),
  saveAll: (list) => save(KEYS.STOCK, list),
  add: (item) => {
    const list = stockApi.getAll()
    list.push(item)
    stockApi.saveAll(list)
    return item
  },
  update: (id, updaterFn) => {
    const list = stockApi.getAll()
    const idx = list.findIndex((i) => i.id === id)
    if (idx > -1) {
      list[idx] = updaterFn(list[idx])
      stockApi.saveAll(list)
    }
  },
  remove: (id) => stockApi.saveAll(stockApi.getAll().filter((i) => i.id !== id)),
}

// Stock counts: { id, date, label ('Weekly'|'Annual'|'Custom'), counts: [{ itemId, countedQty }] }
export const stockCountsApi = {
  getAll: () => load(KEYS.STOCK_COUNTS, []),
  saveAll: (list) => save(KEYS.STOCK_COUNTS, list),
  add: (record) => {
    const list = stockCountsApi.getAll()
    list.push(record)
    stockCountsApi.saveAll(list)
    return record
  },
}

// Receipts (orders received): { id, date, supplier, items: [{ itemId, name, qty, cost }], totalCost }
export const receiptsApi = {
  getAll: () => load(KEYS.RECEIPTS, []),
  saveAll: (list) => save(KEYS.RECEIPTS, list),
  add: (record) => {
    const list = receiptsApi.getAll()
    list.push(record)
    receiptsApi.saveAll(list)
    return record
  },
}

// --------------------------- Lending / Borrowing ---------------------------
// { id, date, shopName, direction ('borrowed'|'lent'), drugName, quantity, returned, returnedDate, note }
export const lendingApi = {
  getAll: () => load(KEYS.LENDING, []),
  saveAll: (list) => save(KEYS.LENDING, list),
  add: (record) => {
    const list = lendingApi.getAll()
    list.push(record)
    lendingApi.saveAll(list)
    return record
  },
  update: (id, updaterFn) => {
    const list = lendingApi.getAll()
    const idx = list.findIndex((r) => r.id === id)
    if (idx > -1) {
      list[idx] = updaterFn(list[idx])
      lendingApi.saveAll(list)
    }
  },
  remove: (id) => lendingApi.saveAll(lendingApi.getAll().filter((r) => r.id !== id)),
}

// ------------------------------- Finance -----------------------------------
// { id, date, type ('income'|'expense'), description, amount }
export const financeApi = {
  getAll: () => load(KEYS.FINANCE, []),
  saveAll: (list) => save(KEYS.FINANCE, list),
  add: (record) => {
    const list = financeApi.getAll()
    list.push(record)
    financeApi.saveAll(list)
    return record
  },
  remove: (id) => financeApi.saveAll(financeApi.getAll().filter((r) => r.id !== id)),
}

// ------------------------------- Settings -----------------------------------
// { heroImageUrl: string | null }
export const settingsApi = {
  get: () => load(KEYS.SETTINGS, { heroImageUrl: null }),
  save: (settings) => save(KEYS.SETTINGS, settings),
}

export const PARTNER_SHOPS = ['Trinity', 'Ave Maria', 'Muzizi DS', 'Joshua Clinic']
