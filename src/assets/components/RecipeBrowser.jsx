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
        showSearch={isHome} search={search} onSearchChange={setSearch}
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
        <Route path="/recipe/:id" element={<RecipeDetail />} />
        <Route path="/recipe" element={<RecipeDetail />} />
      </Routes>
    </>
  );
}

export default RecipeBrowser;
