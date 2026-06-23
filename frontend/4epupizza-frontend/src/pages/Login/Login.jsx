import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Header from '../../components/header/header'
import { useAuth } from '../../context/useAuth'
import './Login.css'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()

    if (!username.trim() || !password) {
      setStatus({ type: 'error', message: 'Вкажіть логін і пароль.' })
      return
    }

    setIsSubmitting(true)
    setStatus({ type: '', message: '' })

    try {
      await login({
        username: username.trim(),
        password,
      })
      navigate(location.state?.from || '/', { replace: true })
    } catch {
      setStatus({ type: 'error', message: 'Не вдалося увійти. Перевірте логін і пароль.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="login-page">
      <Header />
      <div className="login-card">
        <div className="login-card__body">
          <h1 className="login-card__title">З поверненням</h1>
          <p className="login-card__subtitle">Увійдіть, щоб продовжити замовлення.</p>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="login-form__group">
              <label className="login-form__label" htmlFor="login-username">
                Логін
              </label>
              <input
                id="login-username"
                className="login-form__input"
                type="text"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
            <div className="login-form__group">
              <div className="login-form__row">
                <label className="login-form__label" htmlFor="login-password">
                  Пароль
                </label>
                <Link className="login-form__forgot" to="/forgot-password">
                  Забули пароль?
                </Link>
              </div>
              <input
                id="login-password"
                className="login-form__input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            {status.message && (
              <p className={`login-form__status login-form__status--${status.type}`} role="status">
                {status.message}
              </p>
            )}

            <button id="login-submit" className="login-form__btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Входимо...' : 'Увійти →'}
            </button>
          </form>
          <p className="login-card__signup">
            Немає акаунта?{' '}
            <Link className="login-card__signup-link" to="/signup">
              Зареєструватися
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
