const ORDER_HISTORY_KEY = '4epupizza_order_history'

function getUserKey(user) {
  return String(user?.id || user?.username || 'guest').toLowerCase()
}

function readHistory() {
  try {
    const stored = localStorage.getItem(ORDER_HISTORY_KEY)
    const parsed = stored ? JSON.parse(stored) : {}
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function writeHistory(history) {
  try {
    localStorage.setItem(ORDER_HISTORY_KEY, JSON.stringify(history))
  } catch {
    // Ignore localStorage write errors.
  }
}

export function getOrderHistory(user) {
  const history = readHistory()
  const userOrders = history[getUserKey(user)]
  return Array.isArray(userOrders) ? userOrders : []
}

export function saveOrderToHistory(user, order) {
  const history = readHistory()
  const userKey = getUserKey(user)
  const currentOrders = Array.isArray(history[userKey]) ? history[userKey] : []
  const nextOrder = {
    id: order.id || `local-${Date.now()}`,
    createdAt: order.createdAt || new Date().toISOString(),
    status: order.status || 'Принято',
    ...order,
  }

  history[userKey] = [nextOrder, ...currentOrders].slice(0, 20)
  writeHistory(history)
  return nextOrder
}
