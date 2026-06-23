import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Header from '../../components/header/header'
import { useAuth } from '../../context/useAuth'
import './Login.css'

function SignUp() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    if (!username.trim() || !password) {
      setStatus({ type: 'error', message: 'Вкажіть логін і пароль.' })
      return
    }

    setIsSubmitting(true)
    setStatus({ type: '', message: '' })

    try {
      await register({
        username: username.trim(),
        password,
      })
      navigate('/', { replace: true })
    } catch {
      setStatus({ type: 'error', message: 'Не вдалося створити акаунт. Спробуйте інший логін.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="login-page">
      <Header />
      <div className="login-card">
        <div className="login-card__body">
          <h1 className="login-card__title">Створити акаунт</h1>
          <p className="login-card__subtitle">Зареєструйтеся, щоб швидше оформлювати замовлення.</p>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="login-form__group">
              <label className="login-form__label" htmlFor="signup-username">
                Логін
              </label>
              <input
                id="signup-username"
                className="login-form__input"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                autoComplete="username"
                required
              />
            </div>
            <div className="login-form__group">
              <label className="login-form__label" htmlFor="signup-password">
                Пароль
              </label>
              <input
                id="signup-password"
                className="login-form__input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="new-password"
                required
              />
            </div>

            {status.message && (
              <p className={`login-form__status login-form__status--${status.type}`} role="status">
                {status.message}
              </p>
            )}

            <button className="login-form__btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Створюємо...' : 'Зареєструватися →'}
            </button>
          </form>

          <p className="login-card__signup">
            Вже маєте акаунт?{' '}
            <Link className="login-card__signup-link" to="/login">
              Увійти
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUp
