import { useEffect, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { FilterHorizontalIcon, RefreshIcon } from '@hugeicons/core-free-icons';
import { getRecipes } from '../api/recipes';
import { filterRecipes } from '../utils/filterRecipes';
import { isFeedRecipe } from '../utils/isFeedRecipe';
import RecipeCard from '../assets/components/RecipeCard';
import '../styles/home.css';

function formatCategory(category) {
  const value = category.trim().toLowerCase();
  return value ? `${value[0].toUpperCase()}${value.slice(1)}` : '';
}

function Home({
  search = '',
  category = '',
  diet = '',
  time = '',
  onCategoriesLoad,
  categories = [],
  onCategoryChange,
  onDietChange,
  onTimeChange,
  favorites = [],
  onToggleFavorite,
}) {
  const [result, setResult] = useState({ status: 'loading', recipes: [] });
  const [attempt, setAttempt] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    getRecipes({ signal: controller.signal })
      .then((recipes) => {
        if (!controller.signal.aborted) {
          const feedRecipes = recipes.filter(isFeedRecipe);
          setResult({ status: 'success', recipes });
          const categories = [...new Set(
            feedRecipes
              .map((recipe) => recipe.category)
              .filter((value) => typeof value === 'string')
              .map(formatCategory)
              .filter(Boolean)
          )].sort((first, second) => first.localeCompare(second));
          onCategoriesLoad(categories);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setResult({ status: 'error', recipes: [] });
      });

    return () => controller.abort();
  }, [attempt, onCategoriesLoad]);

  const recipes = filterRecipes(result.recipes.filter(isFeedRecipe), { search, category, diet, time });
  const hasFilters = search.trim() || category || diet || time;

  return (
    <main className="content">
      <section className="recipe-area" aria-labelledby="view-heading">
        <div className="recipe-toolbar">
          <h2 id="view-heading">
            {search.trim() ? 'Search results' : category ? `${category} recipes` : 'Tonight for your family'}
          </h2>
          <div className="recipe-filter-control">
            <button
              type="button"
              className="filter-button"
              aria-expanded={filtersOpen}
              aria-controls="recipe-filters"
              onClick={() => setFiltersOpen((isOpen) => !isOpen)}
            >
              <HugeiconsIcon icon={FilterHorizontalIcon} size={18} aria-hidden="true" />
              Filters
            </button>
            <div id="recipe-filters" className="filters" hidden={!filtersOpen}>
              <label>
                Category
                <select value={category} onChange={(event) => onCategoryChange(event.target.value)}>
                  <option value="">All categories</option>
                  {categories.map((recipeCategory) => (
                    <option key={recipeCategory} value={recipeCategory}>{recipeCategory}</option>
                  ))}
                </select>
              </label>
              <label>
                Diet
                <select value={diet} onChange={(event) => onDietChange(event.target.value)}>
                  <option value="">Any diet</option>
                  <option value="gluten-free">Gluten-free</option>
                  <option value="vegan">Vegan</option>
                  <option value="vegetarian">Vegetarian</option>
                </select>
              </label>
              <label>
                Cooking time
                <select value={time} onChange={(event) => onTimeChange(event.target.value)}>
                  <option value="">Any time</option>
                  <option value="15">Up to 15 minutes</option>
                  <option value="30">Up to 30 minutes</option>
                  <option value="60">Up to 60 minutes</option>
                </select>
              </label>
            </div>
          </div>
        </div>
        {result.status === 'loading' && (
          <p className="empty-state" role="status">Loading recipes...</p>
        )}
        {result.status === 'error' && (
          <div className="recipe-error">
            <p role="alert">We couldn't load recipes. Check your connection and try again.</p>
            <button type="button" className="retry-button" onClick={() => {
              setResult({ status: 'loading', recipes: [] });
              setAttempt((value) => value + 1);
            }}>
              <HugeiconsIcon icon={RefreshIcon} size={18} aria-hidden="true" />
              Try again
            </button>
          </div>
        )}
        {result.status === 'success' && recipes.length === 0 && (
          <p className="empty-state" role="status">
            {hasFilters ? 'No recipes match your search or filters.' : 'No recipes yet.'}
          </p>
        )}
        {result.status === 'success' && recipes.length > 0 && (
          <>
            <p className="recipe-count" role="status">
              {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'}
            </p>
            <ul className="recipe-grid">
              {recipes.map((recipe) => (
                <li key={recipe.id}>
                  <RecipeCard recipe={recipe}
                    isFavorite={favorites.some((favorite) => favorite.id === recipe.id)}
                    onToggleFavorite={onToggleFavorite} />
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </main>
  );
}

export default Home;
