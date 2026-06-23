import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useIngredients } from "../constructor/useIngredients";
import "./IngredientsDrawer.css";

function IngredientsDrawer({
  isOpen,
  onClose,
  onSave,
  extraIngredients,
  pizzaName,
}) {
  const { ingredients, isLoading, loadError } = useIngredients();

  // Local state to keep track of added extra ingredients inside the drawer
  // before the user clicks "Save". It's an object { ingredientId: count }
  const [localExtraCounts, setLocalExtraCounts] = useState({});

  useEffect(() => {
    if (isOpen) {
      setLocalExtraCounts({ ...extraIngredients });
      // Disable scrolling on body
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen, extraIngredients]);

  if (!isOpen) return null;

  const handleAdd = (id) => {
    setLocalExtraCounts((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const handleRemove = (id) => {
    setLocalExtraCounts((prev) => {
      const current = prev[id] || 0;
      if (current <= 1) {
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: current - 1 };
    });
  };

  const handleSave = () => {
    const extraPrice = calculateExtraTotal();
    const extraNames = [];
    Object.entries(localExtraCounts).forEach(([id, count]) => {
      const ingredient = ingredients.find(
        (ing) => String(ing.id) === String(id),
      );
      if (ingredient && count > 0) {
        extraNames.push(`${ingredient.label} x${count}`);
      }
    });

    onSave(localExtraCounts, extraPrice, extraNames);
    onClose();
  };

  const calculateExtraTotal = () => {
    return Object.entries(localExtraCounts).reduce((sum, [id, count]) => {
      const ingredient = ingredients.find(
        (ing) => String(ing.id) === String(id),
      );
      if (ingredient) {
        return sum + ingredient.price * count;
      }
      return sum;
    }, 0);
  };

  const content = (
    <div
      className={`drawer-overlay ${isOpen ? "open" : ""}`}
      onClick={onClose}
    >
      <div className={`ingredients-drawer ${isOpen ? "open" : ""}`} onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <h2 className="drawer-title">
            Добавки к пицце
            <br />
            {pizzaName}
          </h2>
          <button className="drawer-close" onClick={onClose}>
            &times;
          </button>
        </div>

        <div className="drawer-content">
          {isLoading && <p>Загрузка ингредиентов...</p>}
          {loadError && <p>{loadError}</p>}

          {ingredients &&
            ingredients.map((ing) => {
              const count = localExtraCounts[ing.id] || 0;
              return (
                <div key={ing.id} className="ingredient-item">
                  <div className="ingredient-info">
                    {ing.imageUrl && (
                      <img
                        src={ing.imageUrl}
                        alt={ing.label}
                        className="ingredient-img"
                      />
                    )}
                    <div className="ingredient-details">
                      <span className="ingredient-name">{ing.label}</span>
                      <span className="ingredient-price">
                        +{Math.round(ing.price)} ₴
                      </span>
                    </div>
                  </div>
                  <div className="pizza-counter">
                    <button
                      className="counter-btn"
                      onClick={() => handleRemove(ing.id)}
                      disabled={count === 0}
                    >
                      −
                    </button>
                    <span className="counter-value">{count}</span>
                    <button
                      className="counter-btn plus"
                      onClick={() => handleAdd(ing.id)}
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
        </div>

        <div className="drawer-footer">
          <div className="drawer-total">
            <span>Итого добавок:</span>
            <span>+{calculateExtraTotal()} ₴</span>
          </div>
          <button className="drawer-save-btn" onClick={handleSave}>
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}

export default IngredientsDrawer;
