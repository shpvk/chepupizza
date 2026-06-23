import { Link } from 'react-router-dom'
import Header from '../../components/header/header'
import Footer from '../../components/footer/footer'
import './NotFound.css'

function NotFound() {
  return (
    <div className="not-found-page">
      <Header />
      <main className="not-found" aria-labelledby="not-found-title">
        <div className="not-found__mark">404</div>
        <h1 id="not-found-title">Page not found</h1>
        <p>The page you are looking for does not exist or was moved.</p>
        <div className="not-found__actions">
          <Link to="/" className="not-found__btn not-found__btn--primary">Back to home</Link>
          <Link to="/catalog" className="not-found__btn not-found__btn--ghost">Open catalog</Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default NotFound