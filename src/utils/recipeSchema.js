// Builds Schema.org/Recipe JSON-LD for one recipe, so Google can understand it.
// Works for both API recipes and our static recipes (src/data/recipes.json).
// No aggregateRating: the API has no rating data (agreed with the PO).
// Never includes owner.email, for privacy.

const SITE_URL = 'https://flavorcraft-team-beta.netlify.app';

function toIsoDuration(minutes) {
  const total = Number(minutes);
  if (!Number.isFinite(total) || total <= 0) return undefined;
  const hours = Math.floor(total / 60);
  const mins = Math.round(total % 60);
  return `PT${hours ? `${hours}H` : ''}${mins ? `${mins}M` : ''}`;
}

function formatIngredient(ingredient) {
  if (!ingredient || !ingredient.name) return null;
  const parts = [ingredient.quantity, ingredient.unit, ingredient.name]
    .filter((part) => part !== undefined && part !== null && part !== '');
  return parts.join(' ');
}

function dietsFor(dietary) {
  if (!dietary) return undefined;
  const diets = [];
  if (dietary.glutenFree) diets.push('https://schema.org/GlutenFreeDiet');
  if (dietary.lactoseFree) diets.push('https://schema.org/LowLactoseDiet');
  if (dietary.vegetarian) diets.push('https://schema.org/VegetarianDiet');
  return diets.length ? diets : undefined;
}

export function buildRecipeSchema(recipe) {
  if (!recipe || !recipe.title) return null;

  const prep = Number(recipe.prepTime) || 0;
  const cook = Number(recipe.cookTime) || 0;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
    name: recipe.title,
    description: recipe.description || undefined,
    image: recipe.image?.url ? [recipe.image.url] : undefined,
    author: recipe.owner?.name
      ? { '@type': 'Person', name: recipe.owner.name }
      : { '@type': 'Organization', name: 'FlavorCraft' },
    datePublished: recipe.created || undefined,
    prepTime: toIsoDuration(prep),
    cookTime: toIsoDuration(cook),
    totalTime: toIsoDuration(prep + cook),
    recipeYield: recipe.servings ? `${recipe.servings} servings` : undefined,
    recipeCategory: recipe.category || undefined,
    keywords: Array.isArray(recipe.tags) && recipe.tags.length ? recipe.tags.join(', ') : undefined,
    suitableForDiet: dietsFor(recipe.dietary),
    recipeIngredient: Array.isArray(recipe.ingredients)
      ? recipe.ingredients.map(formatIngredient).filter(Boolean)
      : undefined,
    recipeInstructions: Array.isArray(recipe.instructions)
      ? recipe.instructions.map((text) => ({ '@type': 'HowToStep', text }))
      : undefined,
    url: recipe.id ? `${SITE_URL}/recipe/${recipe.id}` : undefined,
  };

  // Remove empty fields, so Google only sees real data
  return JSON.parse(JSON.stringify(schema));
}
