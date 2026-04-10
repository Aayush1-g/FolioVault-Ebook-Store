import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Field from '../components/Field'
import { useCart } from '../context/CartContext'
import { validators, runValidation, hasErrors } from '../utils/validators'
import { formatCardNumber, formatExpiry, formatPrice } from '../utils/formatters'

const STEPS = ['Shipping', 'Payment', 'Confirm']

function StepIndicator({ current }) {
  return (
    <ol className="step-list" aria-label="Checkout steps">
      {STEPS.map((label, i) => {
        const state = i + 1 < current ? 'done' : i + 1 === current ? 'active' : 'pending'
        return (
          <li key={label} className={`step-item step-${state}`}>
            <span className="step-bubble" aria-hidden="true">
              {state === 'done' ? '✓' : i + 1}
            </span>
            <span className="step-label">{label}</span>
            {i < STEPS.length - 1 && <span className="step-connector" aria-hidden="true" />}
          </li>
        )
      })}
    </ol>
  )
}

function ShippingStep({ form, setField, errors }) {
  return (
    <div className="checkout-step-body">
      <h3>Shipping Information</h3>
      <div className="field-row-2">
        <Field
          label="First Name"
          value={form.firstName}
          onChange={setField('firstName')}
          error={errors.firstName}
          placeholder="Alex"
          autoComplete="given-name"
        />
        <Field
          label="Last Name"
          value={form.lastName}
          onChange={setField('lastName')}
          error={errors.lastName}
          placeholder="Reader"
          autoComplete="family-name"
        />
      </div>
      <Field
        label="Email Address"
        type="email"
        value={form.email}
        onChange={setField('email')}
        error={errors.email}
        placeholder="you@example.com"
        autoComplete="email"
      />
      <Field
        label="Street Address"
        value={form.address}
        onChange={setField('address')}
        error={errors.address}
        placeholder="123 Book Lane"
        autoComplete="street-address"
      />
      <div className="field-row-2">
        <Field
          label="City"
          value={form.city}
          onChange={setField('city')}
          error={errors.city}
          placeholder="Mumbai"
          autoComplete="address-level2"
        />
        <Field
          label="ZIP / PIN Code"
          value={form.zip}
          onChange={setField('zip')}
          error={errors.zip}
          placeholder="400001"
          autoComplete="postal-code"
        />
      </div>
      <Field
        label="Country"
        value={form.country}
        onChange={setField('country')}
        error={errors.country}
        placeholder="India"
        autoComplete="country-name"
      />
    </div>
  )
}

function PaymentStep({ form, setField, errors }) {
  return (
    <div className="checkout-step-body">
      <h3>Payment Details</h3>
      <div className="secure-notice">
        <span>🔒</span>
        <span>Your payment information is encrypted with 256-bit SSL</span>
      </div>
      <Field
        label="Name on Card"
        value={form.cardName}
        onChange={setField('cardName')}
        error={errors.cardName}
        placeholder="Alex Reader"
        autoComplete="cc-name"
      />
      <Field
        label="Card Number"
        value={form.cardNumber}
        onChange={(v) => setField('cardNumber')(formatCardNumber(v))}
        error={errors.cardNumber}
        placeholder="1234 5678 9012 3456"
        maxLength={19}
        autoComplete="cc-number"
        hint="Visa, Mastercard, Amex accepted"
      />
      <div className="field-row-2">
        <Field
          label="Expiry (MM/YY)"
          value={form.expiry}
          onChange={(v) => setField('expiry')(formatExpiry(v))}
          error={errors.expiry}
          placeholder="08/27"
          maxLength={5}
          autoComplete="cc-exp"
        />
        <Field
          label="CVV"
          type="password"
          value={form.cvv}
          onChange={setField('cvv')}
          error={errors.cvv}
          placeholder="•••"
          maxLength={4}
          autoComplete="cc-csc"
          hint="3–4 digits on the back of your card"
        />
      </div>

      <div className="card-logos" aria-label="Accepted cards">
        {['VISA', 'MC', 'AMEX', 'RUPAY'].map((c) => (
          <span key={c} className="card-logo-badge">{c}</span>
        ))}
      </div>
    </div>
  )
}

function ConfirmStep({ form, cart, cartTotal }) {
  return (
    <div className="checkout-step-body">
      <h3>Review Your Order</h3>

      <div className="confirm-section">
        <div className="confirm-section-head">
          <span>📦</span> Shipping To
        </div>
        <p>{form.firstName} {form.lastName}</p>
        <p>{form.email}</p>
        <p>{form.address}</p>
        <p>{form.city}, {form.zip}</p>
        <p>{form.country}</p>
      </div>

      <div className="confirm-section">
        <div className="confirm-section-head">
          <span>💳</span> Payment
        </div>
        <p>Card ending in <strong>···· {form.cardNumber.slice(-4)}</strong></p>
        <p>Name: {form.cardName}</p>
      </div>

      <div className="confirm-section">
        <div className="confirm-section-head">
          <span>📚</span> Books ({cart.length})
        </div>
        {cart.map((item) => (
          <div key={item._id || item.id} className="confirm-item">
            <img src={item.cover} alt={item.title} className="confirm-item-cover" />
            <div>
              <p className="confirm-item-title">{item.title}</p>
              <p className="confirm-item-meta">×{item.qty || 1}</p>
            </div>
            <span className="confirm-item-price">
              {formatPrice(item.price * (item.qty || 1))}
            </span>
          </div>
        ))}
        <div className="confirm-total">
          <span>Total</span>
          <strong>{formatPrice(cartTotal)}</strong>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  const navigate = useNavigate()
  // FIX: Destructure processCheckout from context
  const { cart, cartTotal, processCheckout } = useCart()
  const [step, setStep] = useState(1)
  const [placing, setPlacing] = useState(false)
  const [done, setDone] = useState(false)
  const [orderId, setOrderId] = useState('')

  const [form, setFormState] = useState({
    firstName: '', lastName: '', email: '', address: '',
    city: '', zip: '', country: '',
    cardName: '', cardNumber: '', expiry: '', cvv: '',
  })
  const [errors, setErrors] = useState({})

  const setField = (key) => (val) =>
    setFormState((f) => ({ ...f, [key]: val }))

  const validateStep1 = () => {
    const e = runValidation(form, {
      firstName: validators.name,
      lastName: validators.name,
      email: validators.email,
      address: validators.required,
      city: validators.required,
      zip: validators.zip,
      country: validators.required,
    })
    setErrors(e)
    return !hasErrors(e)
  }

  const validateStep2 = () => {
    const e = runValidation(form, {
      cardName: validators.name,
      cardNumber: validators.cardNumber,
      expiry: validators.expiry,
      cvv: validators.cvv,
    })
    setErrors(e)
    return !hasErrors(e)
  }

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return
    if (step === 2 && !validateStep2()) return
    setErrors({})
    setStep((s) => s + 1)
  }

  const handleBack = () => {
    setErrors({})
    setStep((s) => s - 1)
  }

  // FIX: Updated placeOrder to sync with MongoDB
  const placeOrder = async () => {
    setPlacing(true)
    
    // Call the processCheckout function from our CartContext
    // This sends all 'form' data (shipping) to the backend orders collection
    const success = await processCheckout(form)

    if (success) {
      setOrderId(`FV${Date.now().toString().slice(-7)}`)
      setPlacing(false)
      setDone(true)
    } else {
      setPlacing(false)
      alert("Order failed to save. Please check your internet connection.")
    }
  }

  /* ── Success screen ── */
  if (done) {
    return (
      <div className="page checkout-success-page">
        <div className="success-card">
          <div className="success-check">✓</div>
          <h2>Order Confirmed!</h2>
          <p>
            Thank you, <strong>{form.firstName}</strong>! Your books are ready
            to download.
          </p>
          <p className="order-ref">Order Reference: <code>{orderId}</code></p>
          <p className="success-email-note">
            A receipt has been sent to <strong>{form.email}</strong>
          </p>
          <div className="success-actions">
            <button className="btn-primary" onClick={() => navigate('/')}>
              Back to Home
            </button>
            <button className="btn-ghost" onClick={() => navigate('/store')}>
              Keep Shopping
            </button>
          </div>
        </div>
      </div>
    )
  }

  /* ── Empty cart guard ── */
  if (cart.length === 0) {
    return (
      <div className="page checkout-success-page">
        <div className="success-card">
          <span style={{ fontSize: 48 }}>🛒</span>
          <h2>Your cart is empty</h2>
          <button className="btn-primary" onClick={() => navigate('/store')}>
            Browse Books
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page checkout-page">
      <h1>
        Check<em>out</em>
      </h1>

      <StepIndicator current={step} />

      <div className="checkout-layout">
        <div className="checkout-form-col">
          <div className="checkout-card">
            {step === 1 && (
              <ShippingStep form={form} setField={setField} errors={errors} />
            )}
            {step === 2 && (
              <PaymentStep form={form} setField={setField} errors={errors} />
            )}
            {step === 3 && (
              <ConfirmStep form={form} cart={cart} cartTotal={cartTotal} />
            )}

            <div className="checkout-nav">
              {step > 1 && (
                <button className="btn-ghost" onClick={handleBack}>
                  ← Back
                </button>
              )}
              {step < 3 ? (
                <button className="btn-primary" onClick={handleNext}>
                  Continue →
                </button>
              ) : (
                <button
                  className="btn-primary btn-place-order"
                  onClick={placeOrder}
                  disabled={placing}
                  aria-busy={placing}
                >
                  {placing ? (
                    <span className="spinner-row">
                      <span className="spinner" /> Processing…
                    </span>
                  ) : (
                    `Place Order · ${formatPrice(cartTotal)}`
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        <aside className="checkout-summary-col">
          <div className="checkout-summary-card">
            <h3>Order Summary</h3>
            <div className="checkout-items-list">
              {cart.map((item) => (
                <div key={item._id || item.id} className="co-summary-item">
                  <img
                    src={item.cover}
                    alt={item.title}
                    className="co-summary-cover"
                  />
                  <div className="co-summary-info">
                    <p className="co-summary-title">{item.title}</p>
                    <p className="co-summary-qty">Qty: {item.qty || 1}</p>
                  </div>
                  <span className="co-summary-price">
                    {formatPrice(item.price * (item.qty || 1))}
                  </span>
                </div>
              ))}
            </div>
            <div className="co-summary-divider" />
            <div className="co-summary-total">
              <span>Total</span>
              <strong>{formatPrice(cartTotal)}</strong>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}