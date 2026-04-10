import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/formatters'

function CartItem({ item }) {
  const { removeFromCart, updateQty } = useCart()

  const itemId = item._id || item.id

  return (
    <div className="cart-item">
      <img
        src={item.cover}
        alt={item.title}
        className="cart-item-cover"
      />

      <div className="cart-item-body">
        <div className="cart-item-top">
          <div>
            <h3 className="cart-item-title">{item.title}</h3>
            <p className="cart-item-author">by {item.author}</p>
            <span className="cart-item-genre">{item.genre}</span>
          </div>
          <button
            className="cart-remove-btn"
            onClick={() => removeFromCart(itemId)}
            aria-label={`Remove ${item.title} from cart`}
          >
            ✕
          </button>
        </div>

        <div className="cart-item-bottom">
          <div className="qty-control" role="group" aria-label="Quantity">
            <button
              type="button"
              className="qty-btn"
              onClick={() => updateQty(itemId, (item.qty || 1) - 1)}
              aria-label="Decrease quantity"
            >
              −
            </button>

            <span className="qty-value" aria-live="polite">
              {item.qty || 1}
            </span>

            <button
              type="button"
              className="qty-btn"
              onClick={() => updateQty(itemId, (item.qty || 1) + 1)}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <div className="cart-item-price-col">
            {(item.qty || 1) > 1 && (
              <span className="unit-price">
                {formatPrice(item.price)} each
              </span>
            )}

            <span className="cart-line-total">
              {formatPrice(item.price * (item.qty || 1))}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CartPage() {
  const navigate = useNavigate()
  const { cart, cartTotal, clearCart } = useCart()

  const savings = 0
  const tax = cartTotal * 0.0
  const total = cartTotal + tax - savings

  if (cart.length === 0) {
    return (
      <div className="page empty-cart-page">
        <div className="empty-cart-content">
          <span className="empty-cart-icon">🛒</span>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any books yet.</p>
          <button className="btn-primary" onClick={() => navigate('/store')}>
            Browse Books
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page cart-page">
      <div className="cart-page-header">
        <h1>
          Your <em>Cart</em>
        </h1>
        <button className="btn-clear-cart" onClick={clearCart}>
          Clear all
        </button>
      </div>

      <div className="cart-layout">
        <div className="cart-items-col">
          {cart.map((item) => (
            <CartItem key={item._id || item.id} item={item} />
          ))}

          <button
            className="btn-continue"
            onClick={() => navigate('/store')}
          >
            ← Continue Shopping
          </button>
        </div>

        <aside className="cart-summary-col">
          <div className="cart-summary-card">
            <h3>Order Summary</h3>

            <div className="summary-lines">
              <div className="summary-line">
                <span>
                  Subtotal ({cart.length} item{cart.length !== 1 ? 's' : ''})
                </span>
                <span>{formatPrice(cartTotal)}</span>
              </div>

              <div className="summary-line">
                <span>Discount</span>
                <span className="discount-val">
                  {savings > 0 ? `−${formatPrice(savings)}` : '—'}
                </span>
              </div>

              <div className="summary-line">
                <span>Tax</span>
                <span>{tax > 0 ? formatPrice(tax) : 'Included'}</span>
              </div>
            </div>

            <div className="summary-total">
              <span>Total</span>
              <strong>{formatPrice(total)}</strong>
            </div>

            <button
              className="btn-primary btn-full"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout →
            </button>

            <div className="cart-trust-badges">
              <span>🔒 Secure checkout</span>
              <span>📥 Instant delivery</span>
              <span>↩ Easy returns</span>
            </div>
          </div>

          <div className="promo-card">
            <p className="promo-label">Have a promo code?</p>
            <div className="promo-row">
              <input
                className="promo-input"
                type="text"
                placeholder="Enter code"
                aria-label="Promo code"
              />
              <button className="btn-promo">Apply</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}