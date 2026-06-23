import { Link } from 'react-router-dom'
import Header from '../../components/header/header'
import './Login.css'

function ForgotPassword() {
  return (
    <div className="login-page">
      <Header />
      <div className="login-card">
        <div className="login-card__body">
          <h1 className="login-card__title">Відновлення пароля</h1>
          <p className="login-card__subtitle">Вкажіть пошту, і ми надішлемо посилання для відновлення.</p>

          <form className="login-form" noValidate>
            <div className="login-form__group">
              <label className="login-form__label" htmlFor="forgot-email">
                Електронна пошта
              </label>
              <input
                id="forgot-email"
                className="login-form__input"
                type="email"
                placeholder="your@email.com"
                autoComplete="email"
                required
              />
            </div>
            <button className="login-form__btn" type="submit">
              Надіслати →
            </button>
          </form>

          <p className="login-card__signup">
            Згадали пароль?{' '}
            <Link className="login-card__signup-link" to="/login">
              Увійти
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
