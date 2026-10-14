import { getJSON } from './client.js';

const RECIPES_PATH = 'recipe-book/recipes';

export async function getRecipes({ signal } = {}) {
  const recipes = [];
  let page = 1;

  // Include every page so local search and filters cover the whole collection.
  while (page !== null) {
    const result = await getJSON(RECIPES_PATH, {
      params: { limit: '100', page: String(page) },
      signal,
    });
    if (
      !Array.isArray(result.data) ||
      result.data.some((recipe) =>
        !recipe || typeof recipe.id !== 'string' || typeof recipe.title !== 'string'
      ) ||
      !result.meta ||
      (result.meta.nextPage !== null &&
        (!Number.isInteger(result.meta.nextPage) || result.meta.nextPage <= page))
    ) {
      throw new Error('The recipe response was invalid. Please try again.');
    }

    recipes.push(...result.data);
    page = result.meta.nextPage;
  }

  return recipes;
}

export async function getRecipe(id, { signal } = {}) {
  if (typeof id !== 'string' || !id.trim()) {
    throw new Error('A recipe id is required.');
  }

  const result = await getJSON(`${RECIPES_PATH}/${encodeURIComponent(id)}`, { signal });
  const recipe = result?.data;

  if (!recipe || typeof recipe.id !== 'string' || typeof recipe.title !== 'string') {
    throw new Error('The recipe response was invalid. Please try again.');
  }

  return recipe;
}

