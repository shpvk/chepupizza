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
  return `${Math.round(Number(price) || 0)} UAH`
}

function getIngredientCategory(ingredient) {
  return ingredient.categoryKey || ingredient.category
}

function getCategoryLabel(category) {
  return categoryLabels[category] || category
}

function getCategoryDescription(category) {
  return categoryDescriptions[category] || `${category} ingredients`
}

function getPartClassName(count) {
  return count > 0 ? 'pizza-constructor__part is-selected' : 'pizza-constructor__part'
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
    .map((ingredient) => ({ ...ingredient, count: selectedCounts[ingredient.id] || 0 }))
    .filter((ingredient) => ingredient.count > 0)
}

function getIngredientsPrice(selectedIngredients) {
  return selectedIngredients.reduce((sum, ingredient) => sum + ingredient.price * ingredient.count, 0)
}

function getSelectedTotal(selectedIngredients) {
  return selectedIngredients.reduce((sum, ingredient) => sum + ingredient.count, 0)
}

function getIngredientNames(selectedIngredients) {
  return selectedIngredients.map((ingredient) => ingredient.label)
}

function getIngredientIds(selectedIngredients) {
  return selectedIngredients.flatMap((ingredient) => Array.from({ length: ingredient.count }, () => Number(ingredient.id)))
}

function PizzaConstructorPage() {
  const { ingredients, isLoading, loadError } = useIngredients()
  const { addItem } = useCart()
  const [selectedCounts, setSelectedCounts] = useState({})
  const [addedToCart, setAddedToCart] = useState(false)
  const [constructorMessage, setConstructorMessage] = useState('')

  const groupedIngredients = useMemo(() => groupIngredientsByCategory(ingredients), [ingredients])
  const dynamicCategoryOrder = useMemo(() => {
    const apiCategories = Object.keys(groupedIngredients).filter((category) => !categoryOrder.includes(category))
    return [...categoryOrder, ...apiCategories]
  }, [groupedIngredients])
  const selectedIngredients = useMemo(() => getSelectedIngredients(ingredients, selectedCounts), [ingredients, selectedCounts])
  const ingredientsPrice = useMemo(() => getIngredientsPrice(selectedIngredients), [selectedIngredients])
  const totalPrice = BASE_PIZZA_PRICE + ingredientsPrice
  const selectedTotal = getSelectedTotal(selectedIngredients)

  function addIngredient(ingredientId) {
    setConstructorMessage('')
    setSelectedCounts((current) => ({ ...current, [ingredientId]: (current[ingredientId] || 0) + 1 }))
  }

  function removeIngredient(ingredientId) {
    setSelectedCounts((current) => {
      const nextCount = Math.max((current[ingredientId] || 0) - 1, 0)

      if (nextCount === 0) {
        const rest = { ...current }
        delete rest[ingredientId]
        return rest
      }

      return { ...current, [ingredientId]: nextCount }
    })
  }

  function clearPizza() {
    setSelectedCounts({})
    setConstructorMessage('')
  }

  function handleAddToCart() {
    if (selectedTotal === 0) {
      setConstructorMessage('Choose at least one ingredient for your pizza.')
      return
    }

    const ingredientNames = getIngredientNames(selectedIngredients)
    const ingredientIds = getIngredientIds(selectedIngredients)
    const description = ingredientNames.length > 0 ? ingredientNames.join(', ') : 'Classic base'

    addItem({
      id: 'custom-pizza-' + Date.now(),
      name: 'Custom pizza',
      description,
      price: totalPrice,
      quantity: 1,
      ingredients: ingredientNames,
      ingredientIds,
      imageUrl: READY_PIZZA_IMAGE_URL,
    })

    setSelectedCounts({})
    setAddedToCart(true)
    setConstructorMessage('')
    setTimeout(() => setAddedToCart(false), 2500)
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
                <span className="pizza-constructor__eyebrow">Pizza builder</span>
                <h1 id="constructor-title">Build your pizza</h1>
              </div>
              <button className="pizza-constructor__clear" type="button" onClick={clearPizza} disabled={selectedTotal === 0}>Clear</button>
            </div>

            <section className="pizza-constructor__section">
              <div className="pizza-constructor__section-head">
                <h2>Ingredients</h2>
                {isLoading && <span>Loading...</span>}
              </div>

              {loadError && <p className="pizza-constructor__status">{loadError}</p>}

              <div className="pizza-constructor__parts">
                <div className="pizza-constructor__category">
                  <div className="pizza-constructor__category-head">
                    <h3>Base</h3>
                    <p>Base pizza price without extra ingredients</p>
                  </div>
                  <article className="pizza-constructor__base-option"><span>Classic base</span><strong>{formatConstructorPrice(BASE_PIZZA_PRICE)}</strong></article>
                </div>

                {dynamicCategoryOrder.map((category) => {
                  const parts = groupedIngredients[category]

                  if (!parts || parts.length === 0) {
                    return null
                  }

                  return (
                    <div className="pizza-constructor__category" key={category}>
                      <div className="pizza-constructor__category-head"><h3>{getCategoryLabel(category)}</h3><p>{getCategoryDescription(category)}</p></div>
                      <div className="pizza-constructor__category-grid">
                        {parts.map((part) => {
                          const count = selectedCounts[part.id] || 0

                          return (
                            <article className={getPartClassName(count)} key={part.id}>
                              <span className="pizza-constructor__part-image"><img src={part.imageUrl} alt="" onError={handleImageError} /></span>
                              <span className="pizza-constructor__part-name">{part.label}</span>
                              <strong>{formatConstructorPrice(part.price)}</strong>
                              <div className="pizza-constructor__counter" aria-label={`${part.label} quantity`}>
                                <button type="button" onClick={() => removeIngredient(part.id)} disabled={count === 0} aria-label={`Remove ${part.label}`}>-</button>
                                <span>{count}</span>
                                <button type="button" onClick={() => addIngredient(part.id)} aria-label={`Add ${part.label}`}>+</button>
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

          <aside className="pizza-constructor__panel" aria-label="Ingredient selection and summary">
            <section className="pizza-constructor__summary">
              <div><span>Base</span><strong>{formatConstructorPrice(BASE_PIZZA_PRICE)}</strong></div>
              <div><span>Total</span><strong>{formatConstructorPrice(totalPrice)}</strong></div>
            </section>

            <section className="pizza-constructor__composition">
              <h2>Composition</h2>
              <ul>
                <li><span>Classic base</span><strong>{formatConstructorPrice(BASE_PIZZA_PRICE)}</strong></li>
                {selectedIngredients.map((ingredient) => (
                  <li key={ingredient.id}><span>{ingredient.label}</span><strong>{ingredient.count} x {formatConstructorPrice(ingredient.price)}</strong></li>
                ))}
              </ul>
            </section>

            <button type="button" className="pizza-constructor__add-to-cart" onClick={handleAddToCart} disabled={selectedTotal === 0} id="add-custom-pizza-to-cart">Add to cart - {formatConstructorPrice(totalPrice)}</button>

            {(constructorMessage || selectedTotal === 0) && <div className="pizza-constructor__notice" role="status">{constructorMessage || 'Choose at least one ingredient for your pizza.'}</div>}
            {addedToCart && <div className="pizza-constructor__toast">Pizza added to cart!</div>}
          </aside>
        </div>
      </section>
    </div>
  )
}

export default PizzaConstructorPage