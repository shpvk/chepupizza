import { buildApiUrl } from '../../services/apiConfig'

export const INGREDIENTS_API_URL = buildApiUrl('/api/ingredients')
export const BASE_PIZZA_PRICE = 149
export const READY_PIZZA_IMAGE_URL = 'https://zcncvckglgttnjwrwuuc.supabase.co/storage/v1/object/public/pizza-images/pizzas/readyPizza.png'

export const categoryLabels = {
  Cheese: 'Сири',
  Sausage: 'Ковбаси',
  Mushroom: 'Гриби',
  Sauce: 'Соуси',
}

export const categoryDescriptions = {
  Cheese: 'Моцарела та чедер',
  Sausage: 'Пепероні, салямі та шинка',
  Mushroom: 'Різні види грибів',
  Sauce: 'Томатний та BBQ соус',
}

export const categoryOrder = ['Cheese', 'Sausage', 'Mushroom', 'Sauce']

export function normalizeIngredient(ingredient) {
  const category = String(ingredient.category || '').trim()

  return {
    id: String(ingredient.id),
    label: ingredient.name || 'Ingredient',
    price: Math.round(Number(ingredient.price) || 0),
    imageUrl: ingredient.imageUrl || '',
    category,
    categoryKey: category,
    categoryLabel: categoryLabels[category] || category,
  }
}
