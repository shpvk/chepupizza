import React from "react";
import { Link } from "react-router-dom";
import "./Promotions.css";

const promotionsData = [
  {
    id: 1,
    title: "Счастливые часы",
    description: "Скидка 20% на все пиццы по будням с 12:00 до 16:00!",
    imageUrl:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800",
    color: "#ff6b6b",
  },
  {
    id: 2,
    title: "Комбо для компании",
    description: "3 большие пиццы + 2 литра колы по специальной цене.",
    imageUrl:
      "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&q=80&w=800",
    color: "#4ecdc4",
  },
  {
    id: 3,
    title: "Новинка сезона",
    description: "Попробуйте нашу новую пиццу с трюфельным соусом.",
    imageUrl:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800",
    color: "#ffe66d",
  },
];

const Promotions = () => {
  return (
    <section className="events-section">
      <h2 className="events-title">Акции и события</h2>
      <div className="events-container">
        {promotionsData.map((promotion) => (
          <div key={promotion.id} className="event-card">
            <div className="event-image-wrapper">
              <img
                src={promotion.imageUrl}
                alt={promotion.title}
                className="event-image"
              />
              <div
                className="event-overlay"
                style={{ backgroundColor: promotion.color }}
              ></div>
            </div>
            <div className="event-content">
              <h3 className="event-card-title">{promotion.title}</h3>
              <p className="event-card-description">{promotion.description}</p>
              <Link to="/promotions" className="event-button">
                Подробнее
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Promotions;
