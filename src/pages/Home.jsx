import { useEffect, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { RefreshIcon } from '@hugeicons/core-free-icons';
import { getRecipes } from '../api/recipes';
import { filterRecipes } from '../utils/filterRecipes';
import '../styles/home.css';

function formatCategory(category) {
  const value = category.trim().toLowerCase();
  return value ? `${value[0].toUpperCase()}${value.slice(1)}` : '';
}

function Home({ search = '', category = '', diet = '', time = '', onCategoriesLoad }) {
  const [result, setResult] = useState({ status: 'loading', recipes: [] });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    getRecipes({ signal: controller.signal })
      .then((recipes) => {
        if (!controller.signal.aborted) {
          setResult({ status: 'success', recipes });
          const categories = [...new Set(
            recipes
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

  const recipes = filterRecipes(result.recipes, { search, category, diet, time });
  const hasFilters = search.trim() || category || diet || time;

  return (
    <main className="content">
      <section className="recipe-area" aria-labelledby="view-heading">
        <h2 id="view-heading">
          {search.trim() ? 'Search results' : category ? `${category} recipes` : 'Tonight for your family'}
        </h2>
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
            {hasFilters ? 'No results found.' : 'No recipes yet.'}
          </p>
        )}
        {result.status === 'success' && recipes.length > 0 && (
          <>
            <p className="recipe-count" role="status">
              {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'}
            </p>
            <ul className="recipe-grid">
              {recipes.map((recipe) => (
                <li key={recipe.id} className="recipe-card">
                  <div className="recipe-image">
                    <span>Image unavailable</span>
                    {recipe.image?.url && (
                      <img src={recipe.image.url} alt={recipe.image.alt || recipe.title}
                        loading="lazy" onError={(event) => { event.currentTarget.hidden = true; }} />
                    )}
                  </div>
                  <div className="recipe-card-content">
                    {recipe.category && <p className="recipe-category">{recipe.category}</p>}
                    <h3>{recipe.title}</h3>
                    {recipe.description && <p className="recipe-description">{recipe.description}</p>}
                    <ul className="recipe-meta" aria-label="Recipe information">
                      {Number.isFinite(recipe.prepTime) && Number.isFinite(recipe.cookTime) && (
                        <li>{recipe.prepTime + recipe.cookTime} min</li>
                      )}
                      {recipe.servings > 0 && <li>Serves {recipe.servings}</li>}
                      {recipe.difficulty && <li>{recipe.difficulty}</li>}
                    </ul>
                  </div>
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
