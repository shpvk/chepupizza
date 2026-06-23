const UAH_RATE = 40

export function formatPrice(price) {
  return `${Math.round(Number(price) * UAH_RATE)} грн`
}
