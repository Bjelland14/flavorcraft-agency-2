import { filterRecipes } from './filterRecipes.js';
import { isFeedRecipe } from './isFeedRecipe.js';

export function pickSurpriseRecipe(recipes, filters = {}, previousRecipeId = null, random = Math.random) {
  const candidates = filterRecipes(recipes.filter(isFeedRecipe), filters);
  if (candidates.length === 0) return null;
  const alternatives = candidates.filter((recipe) => recipe.id !== previousRecipeId);
  const pool = alternatives.length > 0 ? alternatives : candidates;
  return pool[Math.floor(random() * pool.length)];
}
