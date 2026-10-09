const TEST_TITLES = new Set(['my title', 'vv', 'nbn', 'testt']);

function normalizeText(value) {
  return typeof value === 'string' ? value.trim().replace(/\s+/g, ' ').toLowerCase() : '';
}

function hasRealContent(value) {
  const text = normalizeText(value);
  return Boolean(text) && !(
    /\bplaceholder\b/.test(text) ||
    text.includes('no instructions provided') ||
    /^to be added[.!]?$/.test(text) ||
    /^instructions will be added later[.!]?$/.test(text)
  );
}

export function isFeedRecipe(recipe) {
  if (!recipe) return false;

  if (typeof recipe.image?.url !== 'string' || !recipe.image.url.trim()) {
    return false;
  }

  const title = normalizeText(recipe.title);
  const description = normalizeText(recipe.description);
  if (!title || TEST_TITLES.has(title) || !description || description.includes('lorem ipsum') ||
    /^test(?:ing)?[.!?]*$/.test(description)) {
    return false;
  }

  if (
    !Number.isFinite(recipe.prepTime) || recipe.prepTime < 0 ||
    !Number.isFinite(recipe.cookTime) || recipe.cookTime < 0 ||
    recipe.prepTime + recipe.cookTime === 0
  ) {
    return false;
  }

  // Judge the content, not the dish name: real-looking titles can still be placeholders.
  return Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 &&
    recipe.ingredients.every((ingredient) => hasRealContent(ingredient?.name)) &&
    Array.isArray(recipe.instructions) && recipe.instructions.length > 0 &&
    recipe.instructions.every(hasRealContent);
}
