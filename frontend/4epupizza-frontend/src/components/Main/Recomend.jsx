import "./Recomend.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import Card from "../pizzacard/pizzacard";
import { dummyPizzas } from "../../data/dummyPizzas";

function Recomend() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const filteredPizzas = selectedCategory
    ? dummyPizzas.filter((pizza) => pizza.categoryId === selectedCategory)
    : dummyPizzas;

  return (
    <main>
      <div className="rec-container">
        <div className="main-text">Рекомендации</div>
        <nav className="buttons-cont">
          <a
            href="#"
            className={selectedCategory === null ? "active-cat" : ""}
            onClick={(e) => {
              e.preventDefault();
              setSelectedCategory(null);
            }}
          >
            Все
          </a>
          <a
            href="#"
            className={selectedCategory === 1 ? "active-cat" : ""}
            onClick={(e) => {
              e.preventDefault();
              setSelectedCategory(1);
            }}
          >
            Мясо
          </a>
          <a
            href="#"
            className={selectedCategory === 2 ? "active-cat" : ""}
            onClick={(e) => {
              e.preventDefault();
              setSelectedCategory(2);
            }}
          >
            Вегетарианские
          </a>
          <a
            href="#"
            className={selectedCategory === 3 ? "active-cat" : ""}
            onClick={(e) => {
              e.preventDefault();
              setSelectedCategory(3);
            }}
          >
            Морепродукты
          </a>
          <a
            href="#"
            className={selectedCategory === 4 ? "active-cat" : ""}
            onClick={(e) => {
              e.preventDefault();
              setSelectedCategory(4);
            }}
          >
            Грибы
          </a>
        </nav>
        <div className="pizza-grid">
          {filteredPizzas.slice(0, 4).map((pizza, index) => (
            <Card key={pizza.id || index} pizza={pizza} />
          ))}
        </div>
        <div className="moore-btn">
          <Link to="/catalog">
            {selectedCategory === 1 && "Больше мясных пицц"}
            {selectedCategory === 2 && "Больше вегетарианских пицц"}
            {selectedCategory === 3 && "Больше пицц с морепродуктами"}
            {selectedCategory === 4 && "Больше грибных пицц"}
            {selectedCategory === null && "Каталог пицц"}
          </Link>
        </div>
        <div className="main-text">Популярные</div>
        <div className="pizza-grid">
          {filteredPizzas.slice(0, 4).map((pizza, index) => (
            <Card key={pizza.id || index} pizza={pizza} />
          ))}
        </div>
      </div>
    </main>
  );
}

export default Recomend;
