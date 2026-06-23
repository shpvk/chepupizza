import { useState } from 'react'
import { Link } from 'react-router-dom'
import Header from '../../components/header/header'
import Footer from '../../components/footer/footer'
import { useAuth } from '../../context/useAuth'
import { getOrderHistory } from '../../services/orderHistory'
import './Profile.css'

function formatPrice(price) {
  return `${Math.round(Number(price) || 0)} UAH`
}

function formatDate(value) {
  try {
    return new Intl.DateTimeFormat('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value))
  } catch {
    return 'Recently'
  }
}

function getInitial(username) {
  return username?.trim()?.charAt(0)?.toUpperCase() || 'U'
}

function Profile() {
  const { user, logout } = useAuth()
  const orders = getOrderHistory(user)
  const totalSpent = orders.reduce((sum, order) => sum + (Number(order.totalPrice) || 0), 0)
  const avatarKey = `avatar_${user?.username}`
  const [avatar, setAvatar] = useState(() => localStorage.getItem(avatarKey))

  function handleAvatarChange(event) {
    const file = event.target.files[0]

    if (!file) {
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result
      setAvatar(result)
      localStorage.setItem(avatarKey, result)
      window.dispatchEvent(new Event('avatar-updated'))
    }
    reader.readAsDataURL(file)
  }

  const favoriteItem = orders
    .flatMap((order) => order.items || [])
    .reduce((favorite, item) => {
      const quantity = Number(item.quantity) || 0

      if (!favorite || quantity > favorite.quantity) {
        return { name: item.name, quantity }
      }

      return favorite
    }, null)

  return (
    <div className="profile-page">
      <Header />
      <main className="profile" aria-labelledby="profile-title">
        <section className="profile-hero">
          <div className="profile-hero__identity">
            <label htmlFor="avatar-upload" title="Change avatar" style={{ cursor: 'pointer' }}>
              <div className="profile-avatar" aria-hidden="true" style={{ overflow: 'hidden' }}>
                {avatar ? <img src={avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : getInitial(user?.username)}
              </div>
            </label>
            <input type="file" id="avatar-upload" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
            <div>
              <span className="profile-hero__eyebrow">Account</span>
              <h1 id="profile-title">{user?.username}</h1>
            </div>
          </div>

          <div className="profile-hero__actions">
            <Link to="/" className="profile-action profile-action--primary">Catalog</Link>
            <button className="profile-action profile-action--ghost" type="button" onClick={logout}>Log out</button>
          </div>
        </section>

        <section className="profile-stats" aria-label="Profile statistics">
          <article className="profile-stat"><span>Orders</span><strong>{orders.length}</strong></article>
          <article className="profile-stat"><span>Total spent</span><strong>{formatPrice(totalSpent)}</strong></article>
          {favoriteItem && <article className="profile-stat"><span>Favorite</span><strong>{favoriteItem.name}</strong></article>}
        </section>

        <section className="profile-layout">
          <aside className="profile-panel" aria-label="Profile details">
            <h2>Your profile</h2>
            <div className="profile-info">
              <div><span>Username</span><strong>{user?.username}</strong></div>
              <div><span>ID</span><strong>{user?.id || 'Local account'}</strong></div>
            </div>
          </aside>

          <section className="profile-history" aria-labelledby="history-title">
            <div className="profile-history__header">
              <div>
                <span className="profile-history__eyebrow">History</span>
                <h2 id="history-title">Your orders</h2>
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="profile-empty">
                <h3>No orders yet</h3>
                <p>After checkout, your order will appear here with its total, address, and items.</p>
                <Link to="/" className="profile-empty__link">Choose pizza</Link>
              </div>
            ) : (
              <div className="profile-orders">
                {orders.map((order, index) => (
                  <article className="profile-order" key={order.id}>
                    <div className="profile-order__top">
                      <div>
                        <span className="profile-order__number">Order #{orders.length - index}</span>
                        <h3>{formatDate(order.createdAt)}</h3>
                      </div>
                      <span className="profile-order__status">{order.status}</span>
                    </div>

                    <div className="profile-order__meta">
                      <span>{order.address}</span>
                      <strong>{formatPrice(order.totalPrice)}</strong>
                    </div>

                    <div className="profile-order__items">
                      {(order.items || []).map((item) => (
                        <div className="profile-order-item" key={`${order.id}-${item.id}`}>
                          <span>{item.name}</span>
                          <strong>{item.quantity} x {formatPrice(item.price)}</strong>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default Profile