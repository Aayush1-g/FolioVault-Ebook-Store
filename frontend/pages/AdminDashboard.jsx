import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/orders')
      setOrders(res.data)
    } catch (err) {
      console.error('Failed to fetch orders', err)
    }
  }

  return (
    <div className="home-page">
      {/* Hero section - Modified with inline styles to reduce space */}
      <section 
        className="hero" 
        style={{ 
          minHeight: 'auto', 
          paddingBottom: '40px', 
          paddingTop: '80px' 
        }}
      >
        <div className="hero-content">
          <p className="hero-eyebrow">Admin Control Panel</p>

          <h1 className="hero-headline">
            Dashboard <br />
            <em>Management Center</em>
          </h1>

          <p className="hero-sub">
            Manage books, monitor orders, and control your digital library.
          </p>

          <div className="hero-actions">
            <button
              className="btn-primary"
              onClick={() => navigate('/admin/add-book')}
            >
              Add New Book
            </button>

            <button
              className="btn-ghost"
              onClick={() => navigate('/admin/manage-books')}
            >
              Manage Books
            </button>
          </div>
        </div>
      </section>

      {/* Orders section - Removed extra top margin/padding if any */}
      <section className="home-section" style={{ paddingTop: '0' }}>
        <div className="section-header">
          <h2>
            Recent <em>Orders</em>
          </h2>
        </div>

        {orders.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center', padding: '40px' }}>
            No orders available
          </p>
        ) : (
          <div className="books-grid">
            {orders.map((order) => (
              <div
                key={order._id}
                style={{
                  padding: '20px',
                  border: '1px solid #eee',
                  borderRadius: '12px',
                  background: '#fff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                }}
              >
                <h3 style={{ marginBottom: '10px', color: '#1a191e' }}>
                  {order.username}
                </h3>
                <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#555' }}>
                  <p>
                    <strong>Items:</strong> {order.items?.join(', ')}
                  </p>
                  <p>
                    <strong>Total:</strong> ₹{order.totalPrice}
                  </p>
                  <p>
                    <strong>City:</strong>{' '}
                    {order.shippingDetails?.city}
                  </p>
                  <p style={{ marginTop: '10px', fontSize: '12px', color: '#999' }}>
                    {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}