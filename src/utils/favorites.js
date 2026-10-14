import { isFeedRecipe } from './isFeedRecipe.js';

export const FAVORITES_KEY = 'flavorcraft:favorites';

export function readFavorites(storage) {
  try {
    const saved = JSON.parse(storage.getItem(FAVORITES_KEY) || '[]');
    if (!Array.isArray(saved)) return [];
    const seen = new Set();
    return saved.filter((recipe) => {
      if (typeof recipe?.id !== 'string' || !recipe.id || seen.has(recipe.id) || !isFeedRecipe(recipe)) {
        return false;
      }
      seen.add(recipe.id);
      return true;
    });
  } catch {
    return [];
  }
}

export function toggleFavorite(favorites, recipe) {
  return favorites.some((favorite) => favorite.id === recipe.id)
    ? favorites.filter((favorite) => favorite.id !== recipe.id)
    : [...favorites, recipe];
}

export function writeFavorites(storage, favorites) {
  storage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}
