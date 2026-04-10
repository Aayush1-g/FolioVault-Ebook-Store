import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BookCard from '../components/BookCard';
import { BOOKS } from '../data/books'; // Backup data
import { GENRES } from '../data/genres';

const STATS = [
  { value: '12K+', label: 'Books' },
  { value: '4.8★', label: 'Avg Rating' },
  { value: '50K+', label: 'Readers' },
  { value: '100%', label: 'Digital' },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [dbBooks, setDbBooks] = useState([]);

  // 1. Fetch from MongoDB with Fallback
  useEffect(() => {
    axios.get('http://localhost:3001/api/books')
      .then(res => {
        if (res.data && res.data.length > 0) {
          setDbBooks(res.data);
        } else {
          setDbBooks(BOOKS); // Fallback if DB is empty
        }
      })
      .catch(err => {
        console.error("Database connection failed. Using local backup.", err);
        setDbBooks(BOOKS); // Fallback if Server is down
      });
  }, []);

  // 2. Filter logic for DB structure (Checking both _id and id)
  const FEATURED = dbBooks.filter(
    (b) => b.badge === 'Bestseller' || b.badge === 'Top Rated'
  ).slice(0, 4);

  // If no badges match in your DB, just show the first 4 books
  const displayFeatured = FEATURED.length > 0 ? FEATURED : dbBooks.slice(0, 4);
  const newArrivals = dbBooks.filter(b => b.badge === 'New').slice(0, 4);

  return (
    <div className="home-page">
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-glow" aria-hidden="true" />
        <div className="hero-content">
          <p className="hero-eyebrow">Your Personal Digital Library</p>
          <h1 className="hero-headline">
            Every Story<br />
            <em>Deserves to be Read</em>
          </h1>
          <p className="hero-sub">
            Thousands of handpicked ebooks across every genre. Read instantly
            on any device, anywhere in the world.
          </p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => navigate('/store')}>
              Browse Collection
            </button>
            <button className="btn-ghost" onClick={() => navigate('/signup')}>
              Free Trial →
            </button>
          </div>
          <div className="hero-stats">
            {STATS.map(({ value, label }) => (
              <div key={label} className="stat-item">
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="book-fan">
            {dbBooks.slice(0, 5).map((b, i) => (
              <img
                key={b._id || b.id}
                src={b.cover}
                alt=""
                className="fan-book"
                style={{
                  transform: `rotate(${(i - 2) * 7}deg) translateY(${Math.abs(i - 2) * 8}px)`,
                  zIndex: 5 - Math.abs(i - 2),
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Books ── */}
      <section className="home-section">
        <div className="section-header">
          <h2>Featured <em>Books</em></h2>
          <button className="btn-text-link" onClick={() => navigate('/store')}>View all →</button>
        </div>
        <div className="books-grid">
          {displayFeatured.map((b) => (
            <BookCard key={b._id || b.id} book={b} />
          ))}
        </div>
      </section>

      {/* ── Genre Explorer ── */}
      <section className="genre-section">
        <h2>Explore by Genre</h2>
        <div className="genre-chip-list">
          {GENRES.filter((g) => g !== 'All').map((g) => (
            <button key={g} className="genre-chip" onClick={() => navigate(`/store?genre=${g}`)}>
              {g}
            </button>
          ))}
        </div>
      </section>

      {/* ── New Arrivals ── */}
      <section className="home-section">
        <div className="section-header">
          <h2>New <em>Arrivals</em></h2>
          <button className="btn-text-link" onClick={() => navigate('/store')}>See more →</button>
        </div>
        <div className="books-grid">
          {newArrivals.length > 0 ? (
            newArrivals.map((b) => <BookCard key={b._id || b.id} book={b} />)
          ) : (
            <p style={{ color: '#888' }}>New arrivals coming soon...</p>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-banner">
        <div className="cta-inner">
          <h2>Start Reading <em>Today</em></h2>
          <p>Get unlimited access to our entire library. Cancel anytime.</p>
          <div className="cta-btns">
            <button className="btn-primary" onClick={() => navigate('/signup')}>Create Free Account</button>
            <button className="btn-ghost-light" onClick={() => navigate('/store')}>Browse First</button>
          </div>
        </div>
      </section>
    </div>
  );
}