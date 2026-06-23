import './Recomend.css'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../pizzacard/pizzacard'
import { loadPizzas } from '../../services/pizzaService'

const categories = [
  { id: null, name: 'All' },
  { id: 'Meat', name: 'Meat' },
  { id: 'Veggie', name: 'Veggie' },
  { id: 'Seafood', name: 'Seafood' },
  { id: 'Mushrooms', name: 'Mushrooms' },
]

function PizzaList({ loading, error, pizzas }) {
  if (loading) return <div className="rec-status">Loading...</div>
  if (error) return <div className="rec-status">{error}</div>
  if (pizzas.length === 0) return <div className="rec-status">No pizzas found</div>
  return <div className="pizza-grid">{pizzas.map((pizza, index) => <Card key={pizza.id || index} pizza={pizza} />)}</div>
}

function Recomend() {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [pizzas, setPizzas] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

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

  const filteredPizzas = selectedCategory ? pizzas.filter((pizza) => pizza.category === selectedCategory) : pizzas
  const visiblePizzas = filteredPizzas.slice(0, 4)

  return (
    <main>
      <div className="rec-container">
        <div className="main-text">Recommendations</div>
        <nav className="buttons-cont">
          {categories.map((category) => (
            <a
              key={category.id || 'all'}
              href="#"
              className={selectedCategory === category.id ? 'active-cat' : ''}
              onClick={(event) => {
                event.preventDefault()
                setSelectedCategory(category.id)
              }}
            >
              {category.name}
            </a>
          ))}
        </nav>
        <PizzaList loading={loading} error={loadError} pizzas={visiblePizzas} />
        <div className="moore-btn"><Link to="/catalog">Pizza catalog</Link></div>
        <div className="main-text">Popular</div>
        <PizzaList loading={loading} error={loadError} pizzas={visiblePizzas} />
      </div>
    </main>
  )
}

export default Recomend