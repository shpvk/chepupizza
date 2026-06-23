import { buildApiUrl } from './apiConfig'

let cachedPizzas = null
let pizzasRequest = null

function normalizePizzas(data) {
  if (Array.isArray(data)) {
    return data
  }

  if (Array.isArray(data?.value)) {
    return data.value
  }

  return []
}

export function loadPizzas() {
  if (cachedPizzas) {
    return Promise.resolve(cachedPizzas)
  }

  if (!pizzasRequest) {
    pizzasRequest = fetch(buildApiUrl('/api/pizzas'), {
      headers: { accept: 'application/json' },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load pizzas: ${response.status}`)
        }

        return response.json()
      })
      .then((data) => {
        cachedPizzas = normalizePizzas(data)
        return cachedPizzas
      })
      .catch((error) => {
        pizzasRequest = null
        throw error
      })
  }

  return pizzasRequest
}