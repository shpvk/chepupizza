import { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext(null)

const STORAGE_KEY = '4epupizza_cart'

function loadCartFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) return parsed
    }
  } catch {
    // ignore
  }
  return []
}

function saveCartToStorage(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // ignore
  }
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { item } = action.payload
      const existing = state.find((i) => i.id === item.id)
      if (existing) {
        return state.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i,
        )
      }
      return [...state, { ...item, quantity: item.quantity || 1 }]
    }

    case 'REMOVE_ITEM':
      return state.filter((i) => i.id !== action.payload.id)

    case 'UPDATE_QUANTITY':
      return state.map((i) =>
        i.id === action.payload.id
          ? { ...i, quantity: Math.max(1, action.payload.quantity) }
          : i,
      )

    case 'DECREMENT_ITEM': {
      const item = state.find((i) => i.id === action.payload.id)
      if (!item) return state
      if (item.quantity <= 1) {
        return state.filter((i) => i.id !== action.payload.id)
      }
      return state.map((i) =>
        i.id === action.payload.id ? { ...i, quantity: i.quantity - 1 } : i,
      )
    }

    case 'INCREMENT_ITEM':
      return state.map((i) =>
        i.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i,
      )

    case 'CLEAR_CART':
      return []

    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [], loadCartFromStorage)

  useEffect(() => {
    saveCartToStorage(items)
  }, [items])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const addItem = (item) => dispatch({ type: 'ADD_ITEM', payload: { item } })
  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', payload: { id } })
  const updateQuantity = (id, quantity) =>
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
  const incrementItem = (id) => dispatch({ type: 'INCREMENT_ITEM', payload: { id } })
  const decrementItem = (id) => dispatch({ type: 'DECREMENT_ITEM', payload: { id } })
  const clearCart = () => dispatch({ type: 'CLEAR_CART' })

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        totalPrice,
        addItem,
        removeItem,
        updateQuantity,
        incrementItem,
        decrementItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
