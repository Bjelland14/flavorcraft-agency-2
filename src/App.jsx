import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './assets/components/Header';
import Footer from './assets/components/Footer';
import CookieBanner from './assets/components/CookieBanner'; 
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import RecipeDetail from './pages/RecipeDetail';
import { readFavorites, toggleFavorite, writeFavorites } from './utils/favorites';
import { EMPTY_FILTERS } from './utils/recipeFilters';

function App() {
  const [favorites, setFavorites] = useState(() => {
    try {
      return readFavorites(window.localStorage);
    } catch {
      return [];
    }
  });
  const [favoritesError, setFavoritesError] = useState('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [categories, setCategories] = useState([]);
  const [lastSurpriseRecipeId, setLastSurpriseRecipeId] = useState(null);
  const { pathname } = useLocation();

  function handleToggleFavorite(recipe) {
    const next = toggleFavorite(favorites, recipe);
    try {
      writeFavorites(window.localStorage, next);
      setFavorites(next);
      setFavoritesError('');
    } catch {
      setFavoritesError('Could not save favorites. Allow browser storage and try again.');
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="app-shell">
      <Header
        showSearch={pathname === '/'} search={search} onSearchChange={setSearch}
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
              onToggleFavorite={handleToggleFavorite}
              lastSurpriseRecipeId={lastSurpriseRecipeId}
              onSurpriseRecipeSelected={setLastSurpriseRecipeId}
            />
          }
        />
        <Route path="/favorites" element={<Favorites favorites={favorites} onToggleFavorite={handleToggleFavorite} />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />
        <Route path="/recipe" element={<RecipeDetail />} />
      </Routes>
      <Footer />
      <CookieBanner />
    </div>
  );
}

export default App;
