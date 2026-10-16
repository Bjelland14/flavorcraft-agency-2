import staticRecipes from '../data/recipes.json' with { type: 'json' };

export function combineRecipes(apiRecipes) {
  return [
    ...staticRecipes,
    ...apiRecipes.map((recipe) => ({ ...recipe, source: 'api' })),
  ];
}

export function getStaticRecipe(id) {
  return staticRecipes.find((recipe) => recipe.id === id) ?? null;
}
