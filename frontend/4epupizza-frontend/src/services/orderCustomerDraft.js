const CUSTOMER_DRAFT_KEY = '4epupizza_customer_draft'

const EMPTY_CUSTOMER_DRAFT = {
  customerName: '',
  phone: '',
  address: '',
  comment: '',
}

function getUserKey(user) {
  return String(user?.id || user?.username || 'guest').toLowerCase()
}

function readDrafts() {
  try {
    const stored = localStorage.getItem(CUSTOMER_DRAFT_KEY)
    const parsed = stored ? JSON.parse(stored) : {}
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function normalizeDraft(draft) {
  return {
    customerName: draft?.customerName || '',
    phone: draft?.phone || '',
    address: draft?.address || '',
    comment: draft?.comment || '',
  }
}

export function getCustomerDraft(user) {
  const drafts = readDrafts()
  return normalizeDraft(drafts[getUserKey(user)] || EMPTY_CUSTOMER_DRAFT)
}

export function saveCustomerDraft(user, draft) {
  const drafts = readDrafts()
  drafts[getUserKey(user)] = normalizeDraft(draft)

  try {
    localStorage.setItem(CUSTOMER_DRAFT_KEY, JSON.stringify(drafts))
  } catch {
    // Ignore localStorage write errors.
  }
}
