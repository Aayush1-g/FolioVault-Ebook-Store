import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import BookCard from '../components/BookCard'

const GENRES = ['All', 'Mystery', 'Sci-Fi', 'Fantasy', 'Thriller', 'Literary', 'Romance', 'Historical']

export default function StorePage() {
  const [books, setBooks] = useState([]) // From MongoDB
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('rating')
  const activeGenre = searchParams.get('genre') || 'All'

  // 1. FETCH ACTUAL BOOKS FROM YOUR BACKEND
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://127.0.0.1:3001/api/books')
        const data = await response.json()
        setBooks(data)
      } catch (err) {
        console.error("Fetch error:", err)
      }
    }
    fetchBooks()
  }, [])

  const setGenre = (g) => {
    if (g === 'All') {
      searchParams.delete('genre')
      setSearchParams(searchParams)
    } else {
      setSearchParams({ genre: g })
    }
  }

  useEffect(() => { setQuery('') }, [activeGenre])

  // 2. FILTER & SORT LOGIC
  const filtered = useMemo(() => {
    return books.filter((b) => {
      const matchGenre = activeGenre === 'All' || b.genre === activeGenre
      const q = query.toLowerCase()
      const matchQuery =
        !q ||
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.genre.toLowerCase().includes(q)
      return matchGenre && matchQuery
    }).sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price
      if (sort === 'price-desc') return b.price - a.price
      if (sort === 'title') return a.title.localeCompare(b.title)
      return b.rating - a.rating 
    })
  }, [books, activeGenre, query, sort])

  return (
    <div className="page store-page">
      {/* Page header - Matches Image 1 */}
      <div className="store-header">
        <h1>Browse <em>Collection</em></h1>
        <p className="store-count">
          Showing <strong>{filtered.length}</strong> of {books.length} books
          {activeGenre !== 'All' && ` in ${activeGenre}`}
        </p>
      </div>

      {/* Controls - Search & Sort */}
      <div className="store-controls">
        <div className="search-wrap">
          <span className="search-icon" aria-hidden="true">🔍</span>
          <input
            className="search-input"
            type="search"
            placeholder="Search by title or author…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search books"
          />
          {query && (
            <button className="search-clear" onClick={() => setQuery('')}>✕</button>
          )}
        </div>

        <select
          className="sort-select"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="rating">Top Rated</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="title">A → Z</option>
        </select>
      </div>

      {/* Genre tabs - The Pills from Image 1 */}
      <div className="genre-tabs">
        {GENRES.map((g) => (
          <button
            key={g}
            className={`genre-tab ${g === activeGenre ? 'genre-tab-active' : ''}`}
            onClick={() => setGenre(g)}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Results Grid */}
      {filtered.length > 0 ? (
        <div className="books-grid">
          {filtered.map((b) => (
            <div key={b._id || b.id}>
              {/* Pass the real MongoDB book object to your component */}
              <BookCard book={b} />
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-results">
          <span>📭</span>
          <h3>No books found</h3>
          <p>Try a different search term or genre filter.</p>
        </div>
      )}
    </div>
  )
}