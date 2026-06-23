import { useMemo, useState } from 'react'
import Header from '../header/header'
import {
  BASE_PIZZA_PRICE,
  READY_PIZZA_IMAGE_URL,
  categoryDescriptions,
  categoryLabels,
  categoryOrder,
} from './constructorData'
import { useIngredients } from './useIngredients'
import { useCart } from '../../context/CartContext'
import './PizzaConstructorPage.css'

function formatConstructorPrice(price) {
  return `${Math.round(Number(price) || 0)} грн`
}

function getIngredientCategory(ingredient) {
  if (ingredient.categoryKey) {
    return ingredient.categoryKey
  }

  return ingredient.category
}

function getCategoryLabel(category) {
  if (categoryLabels[category]) {
    return categoryLabels[category]
  }

  return category
}

function getCategoryDescription(category) {
  if (categoryDescriptions[category]) {
    return categoryDescriptions[category]
  }

  return `Інгредієнти категорії ${category}`
}

function getPartClassName(count) {
  if (count > 0) {
    return 'pizza-constructor__part is-selected'
  }

  return 'pizza-constructor__part'
}

function groupIngredientsByCategory(ingredients) {
  return ingredients.reduce((groups, ingredient) => {
    const category = getIngredientCategory(ingredient)

    if (!groups[category]) {
      groups[category] = []
    }

    groups[category].push(ingredient)

    return groups
  }, {})
}

function getSelectedIngredients(ingredients, selectedCounts) {
  return ingredients
    .map((ingredient) => {
      return {
        ...ingredient,
        count: selectedCounts[ingredient.id] || 0,
      }
    })
    .filter((ingredient) => {
      return ingredient.count > 0
    })
}

function getIngredientsPrice(selectedIngredients) {
  return selectedIngredients.reduce((sum, ingredient) => {
    return sum + ingredient.price * ingredient.count
  }, 0)
}

function getSelectedTotal(selectedIngredients) {
  return selectedIngredients.reduce((sum, ingredient) => {
    return sum + ingredient.count
  }, 0)
}

function getIngredientNames(selectedIngredients) {
  return selectedIngredients.map((ingredient) => {
    return ingredient.label
  })
}

function getIngredientIds(selectedIngredients) {
  return selectedIngredients.flatMap((ingredient) => {
    return Array.from({ length: ingredient.count }, () => {
      return Number(ingredient.id)
    })
  })
}

function PizzaConstructorPage() {
  const { ingredients, isLoading, loadError } = useIngredients()
  const { addItem } = useCart()

  const [selectedCounts, setSelectedCounts] = useState({})
  const [addedToCart, setAddedToCart] = useState(false)
  const [constructorMessage, setConstructorMessage] = useState('')

  const groupedIngredients = useMemo(() => {
    return groupIngredientsByCategory(ingredients)
  }, [ingredients])

  const dynamicCategoryOrder = useMemo(() => {
    const apiCategories = Object.keys(groupedIngredients).filter((category) => {
      return !categoryOrder.includes(category)
    })

    return [...categoryOrder, ...apiCategories]
  }, [groupedIngredients])

  const selectedIngredients = useMemo(() => {
    return getSelectedIngredients(ingredients, selectedCounts)
  }, [ingredients, selectedCounts])

  const ingredientsPrice = useMemo(() => {
    return getIngredientsPrice(selectedIngredients)
  }, [selectedIngredients])

  const totalPrice = BASE_PIZZA_PRICE + ingredientsPrice
  const selectedTotal = getSelectedTotal(selectedIngredients)

  function addIngredient(ingredientId) {
    setConstructorMessage('')

    setSelectedCounts((current) => {
      return {
        ...current,
        [ingredientId]: (current[ingredientId] || 0) + 1,
      }
    })
  }

  function removeIngredient(ingredientId) {
    setSelectedCounts((current) => {
      const nextCount = Math.max((current[ingredientId] || 0) - 1, 0)

      if (nextCount === 0) {
        const rest = { ...current }
        delete rest[ingredientId]
        return rest
      }

      return {
        ...current,
        [ingredientId]: nextCount,
      }
    })
  }

  function clearPizza() {
    setSelectedCounts({})
    setConstructorMessage('')
  }

  function handleAddToCart() {
    if (selectedTotal === 0) {
      setConstructorMessage('Оберіть хоча б один продукт для піци.')
      return
    }

    const ingredientNames = getIngredientNames(selectedIngredients)
    const ingredientIds = getIngredientIds(selectedIngredients)

    let description = 'Класична основа'

    if (ingredientNames.length > 0) {
      description = ingredientNames.join(', ')
    }

    addItem({
      id: 'custom-pizza-' + Date.now(),
      name: 'Піца з конструктора',
      description: description,
      price: totalPrice,
      quantity: 1,
      ingredients: ingredientNames,
      ingredientIds: ingredientIds,
      imageUrl: READY_PIZZA_IMAGE_URL,
    })

    setSelectedCounts({})
    setAddedToCart(true)
    setConstructorMessage('')

    setTimeout(() => {
      setAddedToCart(false)
    }, 2500)
  }

  function handleImageError(event) {
    event.currentTarget.classList.add('is-hidden')
  }

  return (
    <div className="pizza-constructor-page">
      <Header />

      <section className="pizza-constructor" aria-labelledby="constructor-title">
        <div className="pizza-constructor__inner">
          <div className="pizza-constructor__content">
            <div className="pizza-constructor__topline">
              <div>
                <span className="pizza-constructor__eyebrow">Конструктор піци</span>
                <h1 id="constructor-title">Зберіть свою піцу</h1>
              </div>

              <button
                className="pizza-constructor__clear"
                type="button"
                onClick={clearPizza}
                disabled={selectedTotal === 0}
              >
                Очистити
              </button>
            </div>

            <section className="pizza-constructor__section">
              <div className="pizza-constructor__section-head">
                <h2>Інгредієнти</h2>
                {isLoading && <span>Завантаження...</span>}
              </div>

              {loadError && <p className="pizza-constructor__status">{loadError}</p>}

              <div className="pizza-constructor__parts">
                <div className="pizza-constructor__category">
                  <div className="pizza-constructor__category-head">
                    <h3>Основа</h3>
                    <p>Базова ціна піци без додаткових інгредієнтів</p>
                  </div>

                  <article className="pizza-constructor__base-option">
                    <span>Класична основа</span>
                    <strong>{formatConstructorPrice(BASE_PIZZA_PRICE)}</strong>
                  </article>
                </div>

                {dynamicCategoryOrder.map((category) => {
                  const parts = groupedIngredients[category]

                  if (!parts || parts.length === 0) {
                    return null
                  }

                  return (
                    <div className="pizza-constructor__category" key={category}>
                      <div className="pizza-constructor__category-head">
                        <h3>{getCategoryLabel(category)}</h3>
                        <p>{getCategoryDescription(category)}</p>
                      </div>

                      <div className="pizza-constructor__category-grid">
                        {parts.map((part) => {
                          const count = selectedCounts[part.id] || 0

                          return (
                            <article className={getPartClassName(count)} key={part.id}>
                              <span className="pizza-constructor__part-image">
                                <img src={part.imageUrl} alt="" onError={handleImageError} />
                              </span>

                              <span className="pizza-constructor__part-name">{part.label}</span>

                              <strong>{formatConstructorPrice(part.price)}</strong>

                              <div
                                className="pizza-constructor__counter"
                                aria-label={`Кількість ${part.label}`}
                              >
                                <button
                                  type="button"
                                  onClick={() => removeIngredient(part.id)}
                                  disabled={count === 0}
                                  aria-label={`Прибрати ${part.label}`}
                                >
                                  −
                                </button>

                                <span>{count}</span>

                                <button
                                  type="button"
                                  onClick={() => addIngredient(part.id)}
                                  aria-label={`Додати ${part.label}`}
                                >
                                  +
                                </button>
                              </div>
                            </article>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          </div>

          <aside className="pizza-constructor__panel" aria-label="Вибір інгредієнтів і підсумок">
            <section className="pizza-constructor__summary">
              <div>
                <span>Основа</span>
                <strong>{formatConstructorPrice(BASE_PIZZA_PRICE)}</strong>
              </div>

              <div>
                <span>Разом</span>
                <strong>{formatConstructorPrice(totalPrice)}</strong>
              </div>
            </section>

            <section className="pizza-constructor__composition">
              <h2>Склад</h2>

              <ul>
                <li>
                  <span>Класична основа</span>
                  <strong>{formatConstructorPrice(BASE_PIZZA_PRICE)}</strong>
                </li>

                {selectedIngredients.map((ingredient) => (
                  <li key={ingredient.id}>
                    <span>{ingredient.label}</span>
                    <strong>
                      {ingredient.count} × {formatConstructorPrice(ingredient.price)}
                    </strong>
                  </li>
                ))}
              </ul>
            </section>

            <button
              type="button"
              className="pizza-constructor__add-to-cart"
              onClick={handleAddToCart}
              disabled={selectedTotal === 0}
              id="add-custom-pizza-to-cart"
            >
              Додати до кошика — {formatConstructorPrice(totalPrice)}
            </button>

            {(constructorMessage || selectedTotal === 0) && (
              <div className="pizza-constructor__notice" role="status">
                {constructorMessage || 'Оберіть хоча б один продукт для піци.'}
              </div>
            )}

            {addedToCart && (
              <div className="pizza-constructor__toast">
                ✓ Піцу додано до кошика!
              </div>
            )}
          </aside>
        </div>
      </section>
    </div>
  )
}

export default PizzaConstructorPage