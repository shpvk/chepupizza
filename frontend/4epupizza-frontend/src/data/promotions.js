export const promotions = [
  {
    title: 'День народження',
    discount: '-20%',
    code: 'BDAY20',
    description: 'Святкуйте з піцою: промокод діє за 3 дні до та після дня народження.',
    accent: 'Свято',
    type: 'percent',
    value: 20,
  },
  {
    title: 'Самовивіз',
    discount: '-10%',
    code: 'PICKUP10',
    description: 'Забирайте замовлення самостійно з піцерії та отримуйте знижку на всю піцу.',
    accent: 'Швидко',
    type: 'percent',
    value: 10,
  },
  {
    title: 'Студентський сет',
    discount: '-12%',
    code: 'STUDENT12',
    description: 'Покажіть студентський квиток курʼєру або на касі та їжте смачніше.',
    accent: 'Навчання',
    type: 'percent',
    value: 12,
  },
]

export function findPromotionByCode(code) {
  const normalizedCode = String(code || '').trim().toUpperCase()

  return promotions.find((promotion) => promotion.code === normalizedCode) || null
}

function getCheapestUnitPrice(items) {
  return items.reduce((cheapest, item) => {
    if (!item.quantity) return cheapest

    const price = Number(item.price) || 0
    return cheapest === 0 ? price : Math.min(cheapest, price)
  }, 0)
}

export function calculatePromotionDiscount(promotion, items, totalPrice) {
  if (!promotion || totalPrice <= 0) {
    return {
      amount: 0,
      isApplicable: false,
      message: '',
    }
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  if (promotion.minItems && totalItems < promotion.minItems) {
    return {
      amount: 0,
      isApplicable: false,
      message: `Промокод ${promotion.code} діє від ${promotion.minItems} піц у кошику.`,
    }
  }

  if (promotion.type === 'cheapest-free') {
    return {
      amount: Math.min(getCheapestUnitPrice(items), totalPrice),
      isApplicable: true,
      message: `Промокод ${promotion.code} застосовано.`,
    }
  }

  return {
    amount: Math.round((totalPrice * promotion.value) / 100),
    isApplicable: true,
    message: `Промокод ${promotion.code} застосовано.`,
  }
}
