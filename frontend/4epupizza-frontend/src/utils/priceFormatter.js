export function formatPrice(price) {
  return `${Math.round(Number(price) || 0)} UAH`
}