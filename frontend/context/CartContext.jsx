import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error("useCart error")
  return context
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    if (user?.id) {
      fetch(`http://127.0.0.1:3001/api/cart/${user.id}`)
        .then(res => res.json())
        .then(data => setCart(Array.isArray(data) ? data : []))
        .catch(err => console.error("Load error", err))
    } else {
      setCart([])
    }
  }, [user])

  const syncToDb = async (newItems) => {
    if (!user?.id) return

    try {
      await fetch('http://127.0.0.1:3001/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          username: user.username,
          items: newItems
        })
      })
    } catch (err) {
      console.error("Sync failed", err)
    }
  }

  const addToCart = (book) => {
    const bookId = String(book._id || book.id)

    const existing = cart.find(
      item => String(item._id || item.id) === bookId
    )

    let updated

    if (existing) {
      updated = cart.map(item =>
        String(item._id || item.id) === bookId
          ? { ...item, qty: (item.qty || 1) + 1 }
          : item
      )
    } else {
      updated = [...cart, { ...book, qty: 1 }]
    }

    setCart(updated)
    syncToDb(updated)
  }

  const updateQty = (id, qty) => {
    const itemId = String(id)

    let updated

    if (qty <= 0) {
      updated = cart.filter(
        item => String(item._id || item.id) !== itemId
      )
    } else {
      updated = cart.map(item =>
        String(item._id || item.id) === itemId
          ? { ...item, qty: Number(qty) }
          : item
      )
    }

    setCart(updated)
    syncToDb(updated)
  }

  const removeFromCart = (id) => {
    const updated = cart.filter(
      item => String(item._id || item.id) !== String(id)
    )

    setCart(updated)
    syncToDb(updated)
  }

  const clearCart = () => {
    setCart([])
    syncToDb([])
  }

  const cartTotal = cart.reduce(
    (sum, i) => sum + i.price * (i.qty || 1),
    0
  )

  const cartCount = cart.reduce(
    (sum, i) => sum + (i.qty || 1),
    0
  )

  const processCheckout = async (formData) => {
    if (!user?.id || cart.length === 0) return false

    const payload = {
      userId: user.id,
      username: user.username,
      items: cart.map(i => i.title),
      totalPrice: cartTotal,
      shippingDetails: formData
    }

    const res = await fetch('http://127.0.0.1:3001/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    if (res.ok) {
      setCart([])
      return true
    }

    return false
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        cartTotal,
        cartCount,
        processCheckout
      }}
    >
      {children}
    </CartContext.Provider>
  )
}