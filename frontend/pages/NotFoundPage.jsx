import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className="page not-found-page">
      <div className="nf-content">
        <span className="nf-emoji">📕</span>
        <h1 className="nf-code">404</h1>
        <h2>Page Not Found</h2>
        <p>
          The page you're looking for seems to have wandered off the shelf.
        </p>
        <div className="nf-actions">
          <button className="btn-primary" onClick={() => navigate('/')}>
            Go Home
          </button>
          <button className="btn-ghost" onClick={() => navigate('/store')}>
            Browse Books
          </button>
        </div>
      </div>
    </div>
  )
}
