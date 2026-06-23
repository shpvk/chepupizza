import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../../components/header/header'
import Footer from '../../components/footer/footer'
import { useCart } from '../../context/CartContext'
import { READY_PIZZA_IMAGE_URL } from '../../components/constructor/constructorData'
import { calculatePromotionDiscount, findPromotionByCode } from '../../data/promotions'
import './Cart.css'

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

function EmptyCart() {
  return (
    <div className="cart-empty">
      <div className="cart-empty__icon">
        <svg width="96" height="96" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
      </div>
      <h2>Кошик порожній</h2>
      <p>Додайте піцу з меню або створіть свою в конструкторі</p>
      <div className="cart-empty__actions">
        <Link to="/" className="cart-empty__btn cart-empty__btn--primary">
          До меню
        </Link>
        <Link to="/constructor" className="cart-empty__btn cart-empty__btn--secondary">
          Конструктор
        </Link>
      </div>
    </div>
  )
}

function CartItem({ item, onIncrement, onDecrement, onRemove }) {
  const imageUrl = item.imageUrl || (String(item.id).startsWith('custom-pizza-') ? READY_PIZZA_IMAGE_URL : '')

  return (
    <article className="cart-item" id={`cart-item-${item.id}`}>
      <div className="cart-item__image">
        {imageUrl ? (
          <img src={imageUrl} alt={item.name} />
        ) : (
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12s1.5 2 4 2 4-2 4-2" />
            <line x1="9" y1="9" x2="9.01" y2="9" />
            <line x1="15" y1="9" x2="15.01" y2="9" />
          </svg>
        )}
      </div>

      <div className="cart-item__info">
        <h3 className="cart-item__name">{item.name}</h3>
        {item.description && <p className="cart-item__desc">{item.description}</p>}
        {item.ingredients && item.ingredients.length > 0 && (
          <p className="cart-item__ingredients">
            {item.ingredients.join(', ')}
          </p>
        )}
      </div>

      <div className="cart-item__controls">
        <div className="cart-item__counter">
          <button
            type="button"
            onClick={() => onDecrement(item.id)}
            aria-label="Зменшити кількість"
            className="cart-item__counter-btn"
          >
            -
          </button>
          <span className="cart-item__count">{item.quantity}</span>
          <button
            type="button"
            onClick={() => onIncrement(item.id)}
            aria-label="Збільшити кількість"
            className="cart-item__counter-btn"
          >
            +
          </button>
        </div>

        <strong className="cart-item__price">
          {formatPrice(item.price * item.quantity)}
        </strong>

        <button
          type="button"
          className="cart-item__remove"
          onClick={() => onRemove(item.id)}
          aria-label={`Видалити ${item.name}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>
    </article>
  )
}

function Cart() {
  const { items, totalItems, totalPrice, incrementItem, decrementItem, removeItem, clearCart } = useCart()
  const [promoCode, setPromoCode] = useState('')
  const [activePromotion, setActivePromotion] = useState(null)
  const [promoMessage, setPromoMessage] = useState('')
  const [checkoutMessage, setCheckoutMessage] = useState('')

  const promotionDiscount = useMemo(
    () => calculatePromotionDiscount(activePromotion, items, totalPrice),
    [activePromotion, items, totalPrice],
  )

  const deliveryPrice = totalPrice >= 500 ? 0 : 59
  const discountAmount = promotionDiscount.isApplicable ? promotionDiscount.amount : 0
  const discountedPrice = Math.max(totalPrice - discountAmount, 0)
  const finalPrice = discountedPrice + deliveryPrice

  function handleApplyPromo() {
    const promotion = findPromotionByCode(promoCode)

    if (!promotion) {
      setActivePromotion(null)
      setPromoMessage('Промокод не знайдено.')
      return
    }

    const discount = calculatePromotionDiscount(promotion, items, totalPrice)

    setActivePromotion(promotion)
    setPromoCode(promotion.code)
    setPromoMessage(discount.message)
  }

  function handleRemovePromo() {
    setActivePromotion(null)
    setPromoCode('')
    setPromoMessage('')
  }

  function handleCheckout(event) {
    const localPizza = items.find(isLocalPizza)

    if (!localPizza) {
      setCheckoutMessage('')
      return
    }

    event.preventDefault()
    setCheckoutMessage(`Нельзя оформить заказ: "${localPizza.name}" локальная пицца без id на backend.`)
  }

  return (
    <div className="cart-page">
      <Header />
      <main className="cart" aria-labelledby="cart-title">
        <section className="cart__hero">
          <div>
            <span className="cart__eyebrow">Ваше замовлення</span>
            <h1 id="cart-title">Кошик</h1>
            {totalItems > 0 && (
              <p className="cart__subtitle">
                {totalItems} {totalItems === 1 ? 'товар' : totalItems < 5 ? 'товари' : 'товарів'} у кошику
              </p>
            )}
          </div>
          {totalItems > 0 && (
            <button
              type="button"
              className="cart__clear"
              onClick={clearCart}
            >
              Очистити кошик
            </button>
          )}
        </section>

        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="cart__content">
            <section className="cart__items" aria-label="Товари в кошику">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onIncrement={incrementItem}
                  onDecrement={decrementItem}
                  onRemove={removeItem}
                />
              ))}
            </section>

            <aside className="cart__sidebar" aria-label="Підсумок замовлення">
              <div className="cart-summary">
                <h2>Підсумок</h2>

                <div className="cart-summary__rows">
                  <div className="cart-summary__row">
                    <span>Товари ({totalItems})</span>
                    <strong>{formatPrice(totalPrice)}</strong>
                  </div>
                  <div className="cart-summary__row">
                    <span>Доставка</span>
                    <strong className={deliveryPrice === 0 ? 'cart-summary__free' : ''}>
                      {deliveryPrice === 0 ? 'Безкоштовно' : formatPrice(deliveryPrice)}
                    </strong>
                  </div>
                  {activePromotion && (
                    <div className="cart-summary__row">
                      <span>Промокод {activePromotion.code}</span>
                      <strong className={discountAmount > 0 ? 'cart-summary__discount' : ''}>
                        {discountAmount > 0 ? `-${formatPrice(discountAmount)}` : formatPrice(0)}
                      </strong>
                    </div>
                  )}
                  {deliveryPrice > 0 && (
                    <p className="cart-summary__hint">
                      Безкоштовна доставка від 500 грн
                    </p>
                  )}
                </div>

                <div className="cart-summary__total">
                  <span>Разом</span>
                  <strong>{formatPrice(finalPrice)}</strong>
                </div>

                <Link
                  to="/order"
                  className="cart-summary__checkout"
                  id="checkout-button"
                  onClick={handleCheckout}
                >
                  Оформити замовлення
                </Link>

                {checkoutMessage && (
                  <p className="cart-promo__message">
                    {checkoutMessage}
                  </p>
                )}

                <Link to="/" className="cart-summary__continue">
                  Продовжити покупки
                </Link>
              </div>

              <div className="cart-promo">
                <h3>Є промокод?</h3>
                <div className="cart-promo__field">
                  <input
                    type="text"
                    placeholder="Введіть промокод"
                    className="cart-promo__input"
                    id="promo-input"
                    value={promoCode}
                    onChange={(event) => {
                      setPromoCode(event.target.value.toUpperCase())
                      setPromoMessage('')
                    }}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault()
                        handleApplyPromo()
                      }
                    }}
                  />
                  <button type="button" className="cart-promo__apply" id="promo-apply" onClick={handleApplyPromo}>
                    Застосувати
                  </button>
                </div>
                {activePromotion && (
                  <button type="button" className="cart-promo__remove" onClick={handleRemovePromo}>
                    Скасувати {activePromotion.code}
                  </button>
                )}
                {(promoMessage || (activePromotion && promotionDiscount.message)) && (
                  <p className={discountAmount > 0 ? 'cart-promo__message is-success' : 'cart-promo__message'}>
                    {promoMessage || promotionDiscount.message}
                  </p>
                )}
              </div>
            </aside>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default Cart
