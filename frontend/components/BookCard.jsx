import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Stars from './Stars'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../utils/formatters'

export default function BookCard({ book }) {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)

  const handleAddToCart = (e) => {
    e.stopPropagation()
    addToCart(book)
    setAdded(true)
    setTimeout(() => setAdded(false), 1600)
  }

  return (
    <article
      className="book-card"
      /* CHANGE 1: book.id -> book._id */
      onClick={() => navigate(`/book/${book._id}`)} 
      role="button"
      tabIndex={0}
      /* CHANGE 2: book.id -> book._id */
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/book/${book._id}`)}
      aria-label={`${book.title} by ${book.author}`}
    >
      <div className="book-cover-wrap">
        {book.badge && <span className="badge">{book.badge}</span>}
        <img
          src={book.cover}
          alt={`Cover of ${book.title}`}
          className="book-cover"
          loading="lazy"
        />
        <div className="card-overlay" aria-hidden="true">
          <span className="overlay-label">View Details</span>
        </div>
      </div>

      <div className="card-body">
        <span className="genre-tag">{book.genre}</span>
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">by {book.author}</p>

        <div className="card-rating">
          <Stars rating={book.rating} />
          <span className="review-count">({book.reviews?.toLocaleString()})</span>
        </div>

        <div className="card-footer">
          <span className="book-price">{formatPrice(book.price)}</span>
          <button
            className={`btn-add-cart ${added ? 'btn-added' : ''}`}
            onClick={handleAddToCart}
            aria-label={added ? 'Added to cart' : `Add ${book.title} to cart`}
          >
            {added ? '✓ Added' : '+ Cart'}
          </button>
        </div>
      </div>
    </article>
  )
}