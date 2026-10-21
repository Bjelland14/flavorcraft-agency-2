export function filterRecipes(recipes, {
  search = '', category = [], diet = [], time = '', difficulty = [], excludedIngredients = [],
} = {}) {
  const query = search.trim().toLowerCase();
  const selectedCategories = Array.isArray(category) ? category : category ? [category] : [];

  return recipes.filter((recipe) => {
    const tags = Array.isArray(recipe.tags) ? recipe.tags : [];
    const ingredients = Array.isArray(recipe.ingredients) ? recipe.ingredients : [];
    const searchable = [recipe.title, recipe.description, ...tags,
      ...ingredients.map((ingredient) => ingredient?.name)];
    const matchesSearch = searchable.some((value) =>
      typeof value === 'string' && value.toLowerCase().includes(query)
    );
    const matchesCategory = selectedCategories.length === 0 || (
      typeof recipe.category === 'string' &&
      selectedCategories.some((value) => recipe.category.trim().toLowerCase() === value.trim().toLowerCase())
    );
    const matchesDiet = diet.every((field) =>
      recipe.dietary?.[field] === true
    );
    const matchesTime = !time || (
      Number.isFinite(recipe.prepTime) && Number.isFinite(recipe.cookTime) &&
      recipe.prepTime + recipe.cookTime <= Number(time)
    );

    const matchesDifficulty = difficulty.length === 0 || difficulty.some((value) =>
      typeof recipe.difficulty === 'string' && recipe.difficulty.trim().toLowerCase() === value.toLowerCase()
    );
    const matchesIngredients = excludedIngredients.length === 0 || (
      ingredients.length > 0 && ingredients.every((ingredient) =>
        typeof ingredient?.name === 'string' && !excludedIngredients.some((excluded) =>
          ingredient.name.toLowerCase().includes(excluded.trim().toLowerCase())
        )
      )
    );

    return matchesSearch && matchesCategory && matchesDiet && matchesTime && matchesDifficulty && matchesIngredients;
  });
}
