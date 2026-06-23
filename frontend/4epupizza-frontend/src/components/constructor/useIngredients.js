import { useEffect, useState } from 'react'
import { INGREDIENTS_API_URL, normalizeIngredient } from './constructorData'

let ingredientsRequest = null

function preloadIngredientImages(ingredients) {
  ingredients.forEach((ingredient) => {
    if (!ingredient.imageUrl) return

    const image = new Image()
    image.src = ingredient.imageUrl
  })
}

async function fetchIngredients(signal) {
  const response = await fetch(INGREDIENTS_API_URL, {
    headers: {
      accept: 'application/json',
    },
    signal,
  })

  if (!response.ok) {
    throw new Error('Failed to load ingredients')
  }

  const data = await response.json()
  const ingredients = data
    .filter((ingredient) => ingredient.isAvailable !== false)
    .map(normalizeIngredient)

  preloadIngredientImages(ingredients)

  return ingredients
}

export function preloadIngredients() {
  if (!ingredientsRequest) {
    ingredientsRequest = fetchIngredients()
      .catch((error) => {
        ingredientsRequest = null
        throw error
      })
  }

  return ingredientsRequest
}

export function useIngredients() {
  const [ingredients, setIngredients] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    let isMounted = true

    async function loadIngredients() {
      try {
        setLoadError('')
        setIsLoading(true)

        const freshIngredients = ingredientsRequest
          ? await ingredientsRequest
          : await fetchIngredients(controller.signal)

        if (isMounted) {
          setIngredients(freshIngredients)
        }
      } catch (error) {
        if (error.name !== 'AbortError' && isMounted) {
          setIngredients([])
          setLoadError('Could not load ingredients from API.')
        }
      } finally {
        if (!controller.signal.aborted && isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadIngredients()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [])

  return {
    ingredients,
    isLoading,
    loadError,
  }
}
