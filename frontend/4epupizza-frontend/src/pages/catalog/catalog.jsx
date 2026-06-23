import { useEffect, useState } from 'react'
import './catalog.css'
import Header from '../../components/header/header'
import Footer from '../../components/footer/footer'
import Card from '../../components/pizzacard/pizzacard'
import { loadPizzas } from '../../services/pizzaService'

const categories = [
  { id: null, name: 'All' },
  { id: 'Meat', name: 'Meat' },
  { id: 'Veggie', name: 'Veggie' },
  { id: 'Seafood', name: 'Seafood' },
  { id: 'Mushrooms', name: 'Mushrooms' },
]

function Catalog() {
  const [pizzas, setPizzas] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [sortOrder, setSortOrder] = useState('default')

  useEffect(() => {
    let isMounted = true

    loadPizzas()
      .then((data) => {
        if (isMounted) {
          setPizzas(data)
          setLoadError('')
        }
      })
      .catch((error) => {
        console.error('Could not load pizzas:', error)
        if (isMounted) {
          setPizzas([])
          setLoadError('Could not load pizzas from API.')
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const filteredPizzas = selectedCategory ? pizzas.filter((pizza) => pizza.category === selectedCategory) : [...pizzas]

  if (sortOrder === 'price-asc') {
    filteredPizzas.sort((a, b) => a.price - b.price)
  } else if (sortOrder === 'price-desc') {
    filteredPizzas.sort((a, b) => b.price - a.price)
  }

  return (
    <div className="catalog-page-wrapper">
      <Header />
      <main className="catalog-content">
        <div className="catalog-container">
          <h1 className="catalog-title">Pizza catalog</h1>
          <div className="catalog-layout">
            <aside className="catalog-sidebar">
              <div className="catalog-controls">
                <div className="catalog-filters">
                  {categories.map((cat) => (
                    <button key={cat.id || 'all'} className={`filter-btn ${selectedCategory === cat.id ? 'active-filter' : ''}`} onClick={() => setSelectedCategory(cat.id)}>
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </aside>
            <div className="catalog-main">
              <div className="catalog-main-header">
                <div className="catalog-sort">
                  <select id="sort-select" value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}>
                    <option value="default">Sort: Default</option>
                    <option value="price-asc">Price: Low to high</option>
                    <option value="price-desc">Price: High to low</option>
                  </select>
                </div>
              </div>
              {loading ? (
                <div className="catalog-loading">Loading...</div>
              ) : loadError ? (
                <div className="catalog-empty">{loadError}</div>
              ) : (
                <div className="catalog-grid">
                  {filteredPizzas.length > 0 ? filteredPizzas.map((pizza, index) => <Card key={pizza.id || index} pizza={pizza} />) : <div className="catalog-empty">No pizzas found</div>}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Catalog