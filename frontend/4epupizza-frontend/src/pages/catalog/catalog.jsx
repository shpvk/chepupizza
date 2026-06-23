import { useState, useEffect } from "react";
import "./catalog.css";
import Header from "../../components/header/header";
import Footer from "../../components/footer/footer";
import Card from "../../components/pizzacard/pizzacard";
import { buildApiUrl } from "../../services/apiConfig";

const categories = [
  { id: null, name: "Все" },
  { id: "Meat", name: "Мясо" },
  { id: "Veggie", name: "Вегетарианские" },
  { id: "Seafood", name: "Морепродукты" },
  { id: "Mushrooms", name: "Грибные" },
];

let cachedPizzas = null;
let pizzasRequest = null;

function normalizePizzas(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.value)) {
    return data.value;
  }

  return [];
}

function Catalog() {
  const [pizzas, setPizzas] = useState(cachedPizzas || []);
  const [loading, setLoading] = useState(!cachedPizzas);
  const [loadError, setLoadError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortOrder, setSortOrder] = useState("default"); // default, price-asc, price-desc

  useEffect(() => {
    let isMounted = true;

    if (cachedPizzas) {
      setPizzas(cachedPizzas);
      setLoadError("");
      setLoading(false);
      return;
    }

    if (!pizzasRequest) {
      pizzasRequest = fetch(buildApiUrl("/api/pizzas"))
      .then((res) => res.json())
      .then((data) => {
        const normalizedPizzas = normalizePizzas(data);
        cachedPizzas = normalizedPizzas;
        return normalizedPizzas;
      })
      .catch((err) => {
        console.error("Ошибка при загрузке пицц:", err);
        pizzasRequest = null;
        throw err;
      });
    }

    pizzasRequest
      .then((data) => {
        if (isMounted) {
          setPizzas(data);
          setLoadError("");
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setPizzas([]);
          setLoadError("Не вдалося завантажити піци з API.");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  let filteredPizzas = selectedCategory
    ? pizzas.filter((pizza) => pizza.category === selectedCategory)
    : [...pizzas];

  if (sortOrder === "price-asc") {
    filteredPizzas.sort((a, b) => a.price - b.price);
  } else if (sortOrder === "price-desc") {
    filteredPizzas.sort((a, b) => b.price - a.price);
  }

  return (
    <div className="catalog-page-wrapper">
      <Header />

      <main className="catalog-content">
        <div className="catalog-container">
          <h1 className="catalog-title">Каталог пицц</h1>

          <div className="catalog-layout">
            <aside className="catalog-sidebar">
              <div className="catalog-controls">
                <div className="catalog-filters">
                  {categories.map((cat) => (
                    <button
                      key={cat.id || "all"}
                      className={`filter-btn ${selectedCategory === cat.id ? "active-filter" : ""}`}
                      onClick={() => setSelectedCategory(cat.id)}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            <div className="catalog-main">
              <div className="catalog-main-header">
                <div className="catalog-sort">
                  <select
                    id="sort-select"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                  >
                    <option value="default">Сортировка: По умолчанию</option>
                    <option value="price-asc">Сначала дешевле</option>
                    <option value="price-desc">Сначала дороже</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="catalog-loading">Загрузка...</div>
              ) : loadError ? (
                <div className="catalog-empty">{loadError}</div>
              ) : (
                <div className="catalog-grid">
                  {filteredPizzas.length > 0 ? (
                    filteredPizzas.map((pizza, index) => (
                      <Card key={pizza.id || index} pizza={pizza} />
                    ))
                  ) : (
                    <div className="catalog-empty">Пиццы не найдены</div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Catalog;
