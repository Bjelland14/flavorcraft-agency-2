export function filterRecipes(recipes, { search = '', diet = '', time = '' } = {}) {
  const query = search.trim().toLowerCase();

  return recipes.filter((recipe) => {
    const tags = Array.isArray(recipe.tags) ? recipe.tags : [];
    const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
    const searchable = [recipe.title, recipe.description, ...tags,
      ...ingredients.map((ingredient) => ingredient?.name)];
    const matchesSearch = searchable.some((value) =>
      typeof value === 'string' && value.toLowerCase().includes(query)
    );
    const matchesDiet = !diet || tags.some((tag) =>
      typeof tag === 'string' && tag.toLowerCase().replaceAll(' ', '-') === diet
    );
    const matchesTime = !time || (
      Number.isFinite(recipe.prepTime) && Number.isFinite(recipe.cookTime) &&
      recipe.prepTime + recipe.cookTime <= Number(time)
    );

    return matchesSearch && matchesDiet && matchesTime;
  });
}
