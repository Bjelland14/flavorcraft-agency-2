import { useEffect, useState } from 'react';

const STORAGE_KEY = 'flavorcraft-favorite-recipes';

function readFavorites() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(stored)
      ? stored.filter((recipe) => recipe && typeof recipe.id === 'string' && typeof recipe.title === 'string')
      : [];
  } catch {
    return [];
  }
}

export default function useFavoriteRecipes() {
  const [favorites, setFavorites] = useState(readFavorites);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // Favorites still work for this session if browser storage is unavailable.
    }
  }, [favorites]);

  function toggleFavorite(recipe) {
    setFavorites((current) => current.some((favorite) => favorite.id === recipe.id)
      ? current.filter((favorite) => favorite.id !== recipe.id)
      : [...current, recipe]);
  }

  return { favorites, toggleFavorite };
}
