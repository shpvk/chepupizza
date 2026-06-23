import { Link } from 'react-router-dom'
import Header from '../../components/header/header'
import Footer from '../../components/footer/footer'
import { promotions } from '../../data/promotions'
import './Promotions.css'

function Promotions() {
  return (
    <div className="promotions-page">
      <Header />
      <main className="promotions" aria-labelledby="promotions-title">
        <section className="promotions__hero">
          <div>
            <span className="promotions__eyebrow">Промокоди 4epupizza</span>
            <h1 id="promotions-title">Акції для смачних приводів</h1>
            <p>
              Обирайте промокод, додавайте піцу в замовлення та отримуйте знижку
              на день народження, самовивіз або студентський сет.
            </p>
          </div>
          <Link to="/constructor" className="promotions__cta">
            Замовити піцу
          </Link>
        </section>

        <section className="promotions__grid" aria-label="Список акцій">
          {promotions.map((promotion) => (
            <article className="promotion-card" key={promotion.code}>
              <div className="promotion-card__topline">
                <span>{promotion.accent}</span>
                <strong>{promotion.discount}</strong>
              </div>
              <h2>{promotion.title}</h2>
              <p>{promotion.description}</p>
              <div className="promotion-card__code">
                <span>Промокод</span>
                <strong>{promotion.code}</strong>
              </div>
            </article>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default Promotions
