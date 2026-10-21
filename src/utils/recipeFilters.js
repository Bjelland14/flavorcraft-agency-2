export const EMPTY_FILTERS = {
  category: [],
  diet: [],
  time: '',
  difficulty: [],
  excludedIngredients: [],
};

export const DIET_OPTIONS = [
  ['vegetarian', 'Vegetarian'],
  ['vegan', 'Vegan'],
  ['glutenFree', 'Gluten-Free'],
  ['lactoseFree', 'Lactose-Free'],
];

export function countFilters(filters) {
  return (
    filters.category.length +
    filters.diet.length +
    Number(Boolean(filters.time)) +
    filters.difficulty.length +
    filters.excludedIngredients.length
  );
}
