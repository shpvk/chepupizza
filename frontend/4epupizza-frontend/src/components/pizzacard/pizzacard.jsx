import { useState } from "react";
import "./Pizzacard.css";
import { useCart } from "../../context/CartContext";
import IngredientsDrawer from "./IngredientsDrawer";

function PizzaCard({ pizza }) {
  const [selectedSize, setSelectedSize] = useState(28);
  const [quantity, setQuantity] = useState(1);
  const [isIngredientsMenuOpen, setIsIngredientsMenuOpen] = useState(false);
  const [extraIngredients, setExtraIngredients] = useState({});
  const [extraPrice, setExtraPrice] = useState(0);
  const [extraNames, setExtraNames] = useState([]);
  const { addItem } = useCart();

  const basePrice = pizza.price;
  const sizePrices = {
    22: Number((basePrice - (basePrice / 100) * 20).toFixed(2)),
    28: basePrice,
    33: Number((basePrice + (basePrice / 100) * 20).toFixed(2)),
  };
  const currentPrice = Number(
    (sizePrices[selectedSize] + extraPrice).toFixed(2),
  );

  let ingredientsText =
    pizza.ingredients && pizza.ingredients.length > 0
      ? "Состав: " + pizza.ingredients.map((ing) => ing.name).join(", ")
      : "Состав классический";

  if (extraNames.length > 0) {
    ingredientsText += " + " + extraNames.join(", ");
  }

  const handleOrder = () => {
    const pizzaId = Number(pizza.id);
    const extrasId = Object.entries(extraIngredients)
      .filter(([id, count]) => count > 0)
      .map(([id, count]) => `${id}x${count}`)
      .sort()
      .join("-");

    let finalDescription =
      pizza.ingredients && pizza.ingredients.length > 0
        ? pizza.ingredients.map((ing) => ing.name).join(", ")
        : "Классическая";

    if (extraNames.length > 0) {
      finalDescription += " | Добавки: " + extraNames.join(", ");
    }

    addItem({
      id: `${pizza.id || pizza.name}-${selectedSize}${extrasId ? `-${extrasId}` : ""}`,
      pizzaId: Number.isFinite(pizzaId) ? pizzaId : null,
      name: pizza.name,
      description: finalDescription,
      price: currentPrice,
      size: selectedSize,
      imageUrl: pizza.imageUrl || "/img/pizza-italian.png",
      quantity: quantity,
      extraIngredients: extraIngredients,
    });
  };

  const handleSaveIngredients = (counts, price, names) => {
    setExtraIngredients(counts);
    setExtraPrice(price);
    setExtraNames(names);
  };

  return (
    <div className="cart-cont">
      <div className="pizza-image-container">
        <img
          src={pizza.imageUrl || "/img/pizza-italian.png"}
          alt={pizza.name}
          className="pizza-image"
        />
      </div>
      <h3 className="pizza-title">{pizza.name}</h3>
      <p className="pizza-ingredients">{ingredientsText}</p>
      <div className="pizza-sizes">
        {[22, 28, 33].map((size) => (
          <button
            key={size}
            className={`size-btn ${selectedSize === size ? "active" : ""}`}
            onClick={() => setSelectedSize(size)}
          >
            {size}
          </button>
        ))}
      </div>
      <button
        className="ingredients-btn"
        onClick={() => setIsIngredientsMenuOpen(true)}
      >
        + Ingredients
      </button>
      <div className="pizza-footer">
        <div className="pizza-price">
          {currentPrice} <span className="currency">₴</span>
        </div>
        <div className="pizza-counter">
          <button
            className="counter-btn"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            −
          </button>
          <span className="counter-value">{quantity}</span>
          <button
            className="counter-btn plus"
            onClick={() => setQuantity(quantity + 1)}
          >
            +
          </button>
        </div>
      </div>
      <button className="order-btn" onClick={handleOrder}>
        Order Now
      </button>

      <IngredientsDrawer
        isOpen={isIngredientsMenuOpen}
        onClose={() => setIsIngredientsMenuOpen(false)}
        onSave={handleSaveIngredients}
        extraIngredients={extraIngredients}
        pizzaName={pizza.name}
      />
    </div>
  );
}
export default PizzaCard;
