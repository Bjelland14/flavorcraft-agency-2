import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Cancel01Icon,
  FilterHorizontalIcon,
  RefreshIcon,
} from '@hugeicons/core-free-icons';
import { getRecipes } from '../api/recipes';
import { filterRecipes } from '../utils/filterRecipes';
import { isFeedRecipe } from '../utils/isFeedRecipe';
import { pickSurpriseRecipe } from '../utils/surpriseRecipe';
import { combineRecipes } from '../utils/recipeCollection';
import FeaturedRecipe from '../assets/components/FeaturedRecipe';
import RecipeCard from '../assets/components/RecipeCard';
import RecipeFilters, {
  IngredientChips,
} from '../assets/components/RecipeFilters';
import { countFilters, DIET_OPTIONS } from '../utils/recipeFilters';
import '../styles/home.css';

function formatCategory(category) {
  const value = category.trim().toLowerCase();
  return value ? `${value[0].toUpperCase()}${value.slice(1)}` : '';
}

function Home({
  search = '',
  filters,
  onFiltersChange,
  onCategoriesLoad,
  categories = [],
  favorites = [],
  onToggleFavorite,
  lastSurpriseRecipeId = null,
  onSurpriseRecipeSelected,
}) {
  const [result, setResult] = useState({ status: 'loading', recipes: [] });
  const [attempt, setAttempt] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [draftFilters, setDraftFilters] = useState(filters);
  const dialogRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const controller = new AbortController();

    getRecipes({ signal: controller.signal })
      .then((apiRecipes) => {
        if (!controller.signal.aborted) {
          const recipes = combineRecipes(apiRecipes);
          const feedRecipes = recipes.filter(isFeedRecipe);
          setResult({ status: 'success', recipes });
          const categories = [
            ...new Set(
              feedRecipes
                .map((recipe) => recipe.category)
                .filter((value) => typeof value === 'string')
                .map(formatCategory)
                .filter(Boolean)
            ),
          ].sort((first, second) => first.localeCompare(second));
          onCategoriesLoad(categories);
        }
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setResult({ status: 'error', recipes: [] });
      });

    return () => controller.abort();
  }, [attempt, onCategoriesLoad]);

  useEffect(() => {
    if (!filtersOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const desktop = window.matchMedia('(min-width: 1024px)');
    function closeOnDesktop(event) {
      if (event.matches) dialogRef.current?.close();
    }
    desktop.addEventListener('change', closeOnDesktop);
    return () => {
      document.body.style.overflow = previousOverflow;
      desktop.removeEventListener('change', closeOnDesktop);
    };
  }, [filtersOpen]);

  const feedRecipes = result.recipes.filter(isFeedRecipe);
  const recipes = filterRecipes(feedRecipes, { search, ...filters });
  const draftCount = filterRecipes(feedRecipes, {
    search,
    ...draftFilters,
  }).length;
  const activeCount = countFilters(filters);
  const hasFilters = search.trim() || activeCount > 0;
  const chips = [
    ...filters.category.map((value) => ({
      key: 'category',
      value,
      label: value,
    })),
    ...(filters.time
      ? [
          {
            key: 'time',
            value: filters.time,
            label: `Under ${filters.time} min`,
          },
        ]
      : []),
    ...filters.difficulty.map((value) => ({
      key: 'difficulty',
      value,
      label: value,
    })),
    ...filters.diet.map((value) => ({
      key: 'diet',
      value,
      label: DIET_OPTIONS.find(([field]) => field === value)?.[1],
    })),
  ];

  function openFilters() {
    setDraftFilters(filters);
    setFiltersOpen(true);
    dialogRef.current.showModal();
  }

  function removeFilter(key, value) {
    onFiltersChange({
      ...filters,
      [key]:
        key === 'time' ? '' : filters[key].filter((item) => item !== value),
    });
  }
  // Discovery uses the full reviewed collection, independently of feed filters.
  const featuredRecipe =
    feedRecipes.find(
      (recipe) =>
        recipe.category?.trim().toLowerCase() === 'dinner' &&
        recipe.difficulty?.trim().toLowerCase() === 'easy' &&
        recipe.prepTime + recipe.cookTime <= 60
    ) ||
    feedRecipes.find(
      (recipe) => recipe.category?.trim().toLowerCase() === 'dinner'
    ) ||
    feedRecipes[0];

  function handleSurprise() {
    const recipe = pickSurpriseRecipe(feedRecipes, lastSurpriseRecipeId);
    if (recipe) {
      onSurpriseRecipeSelected(recipe.id);
      navigate(`/recipe/${encodeURIComponent(recipe.id)}`);
    }
  }

  return (
    <main className="content home-layout">
      <aside className="desktop-filters" aria-label="Recipe filters">
        <RecipeFilters
          filters={filters}
          onChange={onFiltersChange}
          categories={categories}
        />
      </aside>
      <div className="home-results">
        <FeaturedRecipe
          recipe={featuredRecipe}
          status={result.status}
          isFavorite={
            featuredRecipe
              ? favorites.some((favorite) => favorite.id === featuredRecipe.id)
              : false
          }
          onToggleFavorite={onToggleFavorite}
          onSurprise={handleSurprise}
        />
        <section className="recipe-area" aria-labelledby="view-heading">
          <div className="recipe-toolbar">
        <h2 id="view-heading">
              {search.trim()
                ? 'Search results'
                : activeCount > 0
                  ? 'Filtered recipes'
                  : 'All recipes'}
              {result.status === 'success' && (
                <span className="recipe-total">{recipes.length}</span>
              )}
            </h2>
            <button
              type="button"
              className="filter-button"
              aria-expanded={filtersOpen}
              aria-controls="mobile-recipe-filters"
              aria-haspopup="dialog"
              onClick={openFilters}
            >
              <HugeiconsIcon
                icon={FilterHorizontalIcon}
                size={18}
                aria-hidden="true"
              />
              Filters
              {activeCount > 0 && (
                <span className="filter-badge">{activeCount}</span>
              )}
            </button>
          </div>
          {activeCount > 0 && (
            <div className="active-filters" aria-label="Active filters">
              {chips.map(({ key, value, label }) => (
                <button
                  type="button"
                  className="active-filter-chip"
                  key={`${key}-${value}`}
                  aria-label={`Remove ${label} filter`}
                  onClick={() => removeFilter(key, value)}
                >
                  {label}
                  <HugeiconsIcon
                    icon={Cancel01Icon}
                    size={13}
                    aria-hidden="true"
                  />
                </button>
              ))}
              <IngredientChips
                ingredients={filters.excludedIngredients}
                onRemove={(value) => removeFilter('excludedIngredients', value)}
              />
            </div>
          )}
          {result.status === 'loading' && (
            <p className="empty-state" role="status">
              Loading recipes...
            </p>
          )}
          {result.status === 'error' && (
            <div className="recipe-error">
              <p role="alert">
                We couldn't load recipes. Check your connection and try again.
              </p>
              <button
                type="button"
                className="retry-button"
                onClick={() => {
                  setResult({ status: 'loading', recipes: [] });
                  setAttempt((value) => value + 1);
                }}
              >
                <HugeiconsIcon
                  icon={RefreshIcon}
                  size={18}
                  aria-hidden="true"
                />
                Try again
              </button>
            </div>
          )}
          {result.status === 'success' && recipes.length === 0 && (
            <p className="empty-state" role="status">
              {filters.diet.length > 0
                ? 'No recipes match your filters with confirmed dietary information. Try turning off a dietary preference.'
                : hasFilters
                  ? 'No recipes match your search or filters.'
                  : 'No recipes yet.'}
            </p>
          )}
          {result.status === 'success' && recipes.length > 0 && (
            <>
              <p className="sr-only" role="status">
                {recipes.length} {recipes.length === 1 ? 'recipe' : 'recipes'}
              </p>
              <ul className="recipe-grid">
                {recipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    isFavorite={favorites.some(
                      (favorite) => favorite.id === recipe.id
                    )}
                    onToggleFavorite={onToggleFavorite}
                  />
                ))}
              </ul>
            </>
          )}
        </section>
      </div>
      <dialog
        ref={dialogRef}
        id="mobile-recipe-filters"
        className="mobile-filter-dialog"
        aria-label="Recipe filters"
        onClose={() => setFiltersOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            const bounds = event.currentTarget.getBoundingClientRect();
            if (
              event.clientX < bounds.left ||
              event.clientX > bounds.right ||
              event.clientY < bounds.top ||
              event.clientY > bounds.bottom
            ) {
              event.currentTarget.close();
            }
          }
        }}
      >
        <RecipeFilters
          mobile
          filters={draftFilters}
          onChange={setDraftFilters}
          categories={categories}
          resultCount={draftCount}
          onClose={() => dialogRef.current.close()}
          onApply={() => {
            onFiltersChange(draftFilters);
            dialogRef.current.close();
          }}
        />
      </dialog>
    </main>
  );
}

export default Home;
