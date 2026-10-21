import { isFeedRecipe } from './isFeedRecipe.js';

export function pickSurpriseRecipe(recipes, previousRecipeId = null, random = Math.random) {
  const candidates = recipes.filter(isFeedRecipe);
  if (candidates.length === 0) return null;
  const alternatives = candidates.filter((recipe) => recipe.id !== previousRecipeId);
  const pool = alternatives.length > 0 ? alternatives : candidates;
  return pool[Math.floor(random() * pool.length)];
}
