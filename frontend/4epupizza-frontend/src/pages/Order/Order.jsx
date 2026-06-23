import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../../components/header/header'
import Footer from '../../components/footer/footer'
import { useAuth } from '../../context/useAuth'
import { useCart } from '../../context/CartContext'
import { buildApiUrl } from '../../services/apiConfig'
import { getCustomerDraft, saveCustomerDraft } from '../../services/orderCustomerDraft'
import { saveOrderToHistory } from '../../services/orderHistory'
import './Order.css'

const ORDER_API_URL = buildApiUrl('/api/order')

function formatPrice(price) {
  return `${Math.round(Number(price) || 0)} грн`
}

function getPizzaId(item) {
  const storedPizzaId = Number(item.pizzaId)

  if (Number.isFinite(storedPizzaId) && storedPizzaId > 0) {
    return storedPizzaId
  }

  const idMatch = String(item.id).match(/^\d+/)

  return idMatch ? Number(idMatch[0]) : null
}

function isLocalPizza(item) {
  return !String(item.id).startsWith('custom-pizza-') && !getPizzaId(item)
}

function getIngredientIds(item) {
  const ingredientIds = (item.ingredientIds || [])
    .map((id) => Number(id))
    .filter((id) => Number.isFinite(id) && id > 0)

  Object.entries(item.extraIngredients || {}).forEach(([id, count]) => {
    const ingredientId = Number(id)
    const ingredientCount = Number(count) || 0

    if (!Number.isFinite(ingredientId) || ingredientId <= 0 || ingredientCount <= 0) {
      return
    }

    for (let index = 0; index < ingredientCount; index += 1) {
      ingredientIds.push(ingredientId)
    }
  })

  return ingredientIds
}

function buildOrderItems(items) {
  return items.map((item) => {
    const ingredientIds = getIngredientIds(item)
    const quantity = Number(item.quantity) || 1

    if (String(item.id).startsWith('custom-pizza-')) {
      return {
        pizzaId: null,
        ingredientIds,
        quantity,
      }
    }

    const orderItem = {
      pizzaId: getPizzaId(item),
      quantity,
    }

    if (ingredientIds.length > 0) {
      orderItem.ingredientIds = ingredientIds
    }

    return orderItem
  })
}

async function getOrderErrorMessage(response) {
  const text = await response.text()

  if (!text) {
    return 'РќРµ РІРґР°Р»РѕСЃСЏ РѕС„РѕСЂРјРёС‚Рё Р·Р°РјРѕРІР»РµРЅРЅСЏ. РџРµСЂРµРІС–СЂС‚Рµ РґР°РЅС– С‚Р° СЃРїСЂРѕР±СѓР№С‚Рµ С‰Рµ СЂР°Р·.'
  }

  try {
    const data = JSON.parse(text)
    return data?.message || data?.title || text
  } catch {
    return text
  }
}

function Order() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { items, totalItems, totalPrice, clearCart } = useCart()
  const [form, setForm] = useState(() => getCustomerDraft(user))
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const deliveryPrice = totalPrice >= 500 || totalItems === 0 ? 0 : 59
  const finalPrice = totalPrice + deliveryPrice
  const orderItems = useMemo(() => buildOrderItems(items), [items])

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => {
      const nextForm = { ...current, [name]: value }
      saveCustomerDraft(user, nextForm)
      return nextForm
    })
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (items.length === 0) {
      setStatus({ type: 'error', message: 'Кошик порожній. Додайте піцу перед оформленням.' })
      return
    }

    const localPizza = items.find(isLocalPizza)

    if (localPizza) {
      setStatus({ type: 'error', message: `Нельзя оформить заказ: "${localPizza.name}" локальная пицца без id на backend.` })
      return
    }

    setIsSubmitting(true)
    setStatus({ type: '', message: '' })

    try {
      const response = await fetch(ORDER_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
        body: JSON.stringify({
          customerName: form.customerName.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          comment: form.comment.trim() || null,
          items: orderItems,
        }),
      })

      if (!response.ok) {
        throw new Error(await getOrderErrorMessage(response))
      }

      saveCustomerDraft(user, form)
      saveOrderToHistory(user, {
        customerName: form.customerName.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        comment: form.comment.trim(),
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description || '',
          ingredients: item.ingredients || [],
          imageUrl: item.imageUrl || '',
          price: item.price,
          quantity: item.quantity,
        })),
        totalItems,
        subtotal: totalPrice,
        deliveryPrice,
        totalPrice: finalPrice,
      })
      clearCart()
      setStatus({ type: 'success', message: 'Замовлення прийнято. Дякуємо!' })
      setTimeout(() => navigate('/profile'), 1500)
    } catch (error) {
      if (error.message) {
        setStatus({ type: 'error', message: error.message })
        return
      }

      setStatus({
        type: 'error',
        message: 'Не вдалося оформити замовлення. Перевірте дані та спробуйте ще раз.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="order-page">
      <Header />
      <main className="order" aria-labelledby="order-title">
        <section className="order__hero">
          <div>
            <span className="order__eyebrow">Доставка 4epupizza</span>
            <h1 id="order-title">Оформлення замовлення</h1>
            <p>Залиште контакти, адресу та коментар для кур'єра.</p>
          </div>
          <Link to="/cart" className="order__back">
            До кошика
          </Link>
        </section>

        <div className="order__layout">
          <form className="order-form" onSubmit={handleSubmit}>
            <label className="order-field">
              <span>Ім'я</span>
              <input
                type="text"
                name="customerName"
                value={form.customerName}
                onChange={updateField}
                autoComplete="name"
                placeholder="Олександр"
                required
              />
            </label>

            <label className="order-field">
              <span>Телефон</span>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={updateField}
                autoComplete="tel"
                inputMode="tel"
                placeholder="+380 99 123 45 67"
                required
              />
            </label>

            <label className="order-field">
              <span>Адреса</span>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={updateField}
                autoComplete="street-address"
                placeholder="Одеса, вул. Дерибасівська, 12"
                required
              />
            </label>

            <label className="order-field">
              <span>Коментар</span>
              <textarea
                name="comment"
                value={form.comment}
                onChange={updateField}
                placeholder="Під'їзд, поверх, домофон або побажання до замовлення"
                rows="5"
              />
            </label>

            {status.message && (
              <p className={`order-status order-status--${status.type}`} role="status">
                {status.message}
              </p>
            )}

            <button className="order-form__submit" type="submit" disabled={isSubmitting || items.length === 0}>
              {isSubmitting ? 'Оформлюємо...' : 'Підтвердити замовлення'}
            </button>
          </form>

          <aside className="order-summary" aria-label="Підсумок замовлення">
            <h2>Ваше замовлення</h2>

            {items.length === 0 ? (
              <div className="order-summary__empty">
                <p>Кошик порожній.</p>
                <Link to="/">До меню</Link>
              </div>
            ) : (
              <div className="order-summary__items">
                {items.map((item) => (
                  <article className="order-summary__item" key={item.id}>
                    <div>
                      <h3>{item.name}</h3>
                      {item.description && <p>{item.description}</p>}
                    </div>
                    <strong>
                      {item.quantity} × {formatPrice(item.price)}
                    </strong>
                  </article>
                ))}
              </div>
            )}

            <div className="order-summary__rows">
              <div>
                <span>Товари ({totalItems})</span>
                <strong>{formatPrice(totalPrice)}</strong>
              </div>
              <div>
                <span>Доставка</span>
                <strong>{deliveryPrice === 0 ? 'Безкоштовно' : formatPrice(deliveryPrice)}</strong>
              </div>
              <div className="order-summary__total">
                <span>Разом</span>
                <strong>{formatPrice(finalPrice)}</strong>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Order
