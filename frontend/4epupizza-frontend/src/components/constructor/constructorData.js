import { buildApiUrl } from '../../services/apiConfig'

export const INGREDIENTS_API_URL = buildApiUrl('/api/ingredients')
export const BASE_PIZZA_PRICE = 100
export const READY_PIZZA_IMAGE_URL = 'https://zcncvckglgttnjwrwuuc.supabase.co/storage/v1/object/public/pizza-images/pizzas/readyPizza.png'

export const categoryLabels = {
  Cheese: 'Cheese',
  Sausage: 'Sausage',
  Mushroom: 'Mushrooms',
  Mushrooms: 'Mushrooms',
  Sauce: 'Sauces',
  Sauces: 'Sauces',
}

export const categoryDescriptions = {
  Cheese: 'Mozzarella, cheddar, and other cheeses',
  Sausage: 'Pepperoni, salami, ham, and meat toppings',
  Mushroom: 'Fresh mushroom varieties',
  Mushrooms: 'Fresh mushroom varieties',
  Sauce: 'Tomato, BBQ, and signature sauces',
  Sauces: 'Tomato, BBQ, and signature sauces',
}

export const categoryOrder = ['Cheese', 'Sausage', 'Mushroom', 'Mushrooms', 'Sauce', 'Sauces']

export function normalizeIngredient(ingredient) {
  const category = ingredient.category || ingredient.categoryName || 'Other'

  return {
    ...ingredient,
    id: ingredient.id,
    label: ingredient.label || ingredient.name || 'Ingredient',
    price: Number(ingredient.price) || 0,
    imageUrl: ingredient.imageUrl || ingredient.imageURL || ingredient.image || '',
    category,
    categoryKey: category,
    isAvailable: ingredient.isAvailable !== false,
  }
}