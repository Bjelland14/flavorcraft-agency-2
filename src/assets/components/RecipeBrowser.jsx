import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './Header';
import Home from '../../pages/Home';
import Favorites from '../../pages/Favorites';
import RecipeDetail from '../../pages/RecipeDetail';
import { EMPTY_FILTERS } from '../../utils/recipeFilters';

// App keys this component by navigation entry, resetting transient discovery state.
function RecipeBrowser({
  isHome,
  isRecipeDetail,
  favorites,
  favoritesError,
  onToggleFavorite,
  lastSurpriseRecipeId,
  onSurpriseRecipeSelected,
}) {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <>
      <Header
        showSearch={isHome || isRecipeDetail}
        search={search}
        onSearchChange={setSearch}
        isRecipeDetail={isRecipeDetail}
      />
      {favoritesError && <p className="favorites-error" role="alert">{favoritesError}</p>}
      <Routes>
        <Route
          path="/"
          element={
            <Home
              search={debouncedSearch}
              filters={filters}
              onFiltersChange={setFilters}
              onCategoriesLoad={setCategories}
              categories={categories}
              favorites={favorites}
              onToggleFavorite={onToggleFavorite}
              lastSurpriseRecipeId={lastSurpriseRecipeId}
              onSurpriseRecipeSelected={onSurpriseRecipeSelected}
            />
          }
        />
        <Route path="/favorites" element={<Favorites favorites={favorites} onToggleFavorite={onToggleFavorite} />} />
        <Route
          path="/recipe/:id"
          element={<RecipeDetail favorites={favorites} onToggleFavorite={onToggleFavorite} />}
        />
        <Route
          path="/recipe"
          element={<RecipeDetail favorites={favorites} onToggleFavorite={onToggleFavorite} />}
        />
      </Routes>
    </>
  );
}

export default RecipeBrowser;
