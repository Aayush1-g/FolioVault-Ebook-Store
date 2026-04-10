import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Stars from '../components/Stars'
import BookCard from '../components/BookCard'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/formatters'

export default function BookDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [book, setBook] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [added, setAdded] = useState(false)
  const [activeTab, setActiveTab] = useState('description')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // 1. Fetch the main book
        const res = await fetch(`http://127.0.0.1:3001/api/books/${id}`)
        const bookData = await res.json()
        setBook(bookData)

        // 2. Fetch all books to find related ones in the same genre
        const allRes = await fetch(`http://127.0.0.1:3001/api/books`)
        const allBooks = await allRes.json()
        const relatedBooks = allBooks
          .filter((b) => b.genre === bookData.genre && b._id !== bookData._id)
          .slice(0, 4)
        setRelated(relatedBooks)
      } catch (err) {
        console.error("Error loading book:", err)
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchData()
  }, [id])

  const handleAddToCart = () => {
    addToCart(book)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) return <div className="page loader-container">Loading...</div>

  if (!book) {
    return (
      <div className="page not-found-page">
        <div className="nf-content">
          <span className="nf-emoji">📕</span>
          <h2>Book Not Found</h2>
          <p>We couldn't find that book in our catalog.</p>
          <button className="btn-primary" onClick={() => navigate('/store')}>Back to Store</button>
        </div>
      </div>
    )
  }

  return (
    <div className="page book-detail-page">
      {/* Breadcrumb - Restored CSS */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <button className="crumb-link" onClick={() => navigate('/')}>Home</button>
        <span className="crumb-sep">›</span>
        <button className="crumb-link" onClick={() => navigate('/store')}>Store</button>
        <span className="crumb-sep">›</span>
        <span className="crumb-link" onClick={() => navigate(`/store?genre=${book.genre}`)}>{book.genre}</span>
        <span className="crumb-sep">›</span>
        <span className="crumb-current">{book.title}</span>
      </nav>

      <div className="detail-layout">
        {/* Left: Sidebar - Restored CSS */}
        <aside className="detail-aside">
          <div className="detail-cover-wrap">
            {book.badge && <span className="badge badge-lg">{book.badge}</span>}
            <img src={book.cover} alt={book.title} className="detail-cover-img" />
          </div>

          <div className="detail-price-block">
            <span className="detail-price">{formatPrice(book.price)}</span>
            <span className="detail-format-label">EPUB · PDF · MOBI</span>
          </div>

          <div className="detail-actions">
            <button className={`btn-primary btn-full ${added ? 'btn-added' : ''}`} onClick={handleAddToCart}>
              {added ? '✓ Added to Cart!' : 'Add to Cart'}
            </button>
            <button className="btn-ghost btn-full" onClick={() => navigate('/checkout')}>Buy Now</button>
          </div>

          <div className="detail-meta-list">
            {[
              ['Pages', `${book.pages}`],
              ['Language', book.language],
              ['Publisher', book.publisher],
              ['Format', 'Digital Download'],
            ].map(([k, v]) => (
              <div key={k} className="meta-row">
                <span className="meta-key">{k}</span>
                <span className="meta-val">{v}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Right: Info - Restored CSS */}
        <div className="detail-info">
          <span className="genre-tag genre-tag-lg">{book.genre}</span>
          <h1 className="detail-title">{book.title}</h1>
          <p className="detail-author">by <strong>{book.author}</strong></p>

          <div className="detail-rating-row">
            <Stars rating={book.rating} size={18} />
            <span className="rating-value">{book.rating}</span>
            <span className="rating-count">· {book.reviews?.toLocaleString()} reviews</span>
          </div>

          <p className="detail-blurb">{book.description}</p>

          {/* Tabs - Restored CSS */}
          <div className="detail-tabs">
            {['description', 'details', 'reviews'].map((tab) => (
              <button
                key={tab}
                className={`detail-tab ${activeTab === tab ? 'detail-tab-active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="detail-tab-panel">
            {activeTab === 'description' && <p className="detail-long-desc">{book.description}</p>}
            {activeTab === 'details' && (
              <table className="detail-table">
                <tbody>
                  {[
                    ['Title', book.title], ['Author', book.author], ['Genre', book.genre],
                    ['Pages', book.pages], ['Publisher', book.publisher], ['Language', book.language],
                  ].map(([k, v]) => (
                    <tr key={k}>
                      <td className="table-key">{k}</td>
                      <td className="table-val">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {activeTab === 'reviews' && (
               <div className="reviews-panel">
                 <p>User reviews are loading from the vault...</p>
                 {/* You can map your sample reviews here as you had them before */}
               </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Section - Restored CSS */}
      {related.length > 0 && (
        <section className="related-section">
          <div className="section-header">
            <h2>More in <em>{book.genre}</em></h2>
          </div>
          <div className="books-grid">
            {related.map((b) => (
              <BookCard key={b._id} book={b} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}