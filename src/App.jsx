import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './assets/components/Header';
import Footer from './assets/components/Footer';
import CookieBanner from './assets/components/CookieBanner'; 
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import RecipeDetail from './pages/RecipeDetail';
import { readFavorites, toggleFavorite, writeFavorites } from './utils/favorites';

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
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [diet, setDiet] = useState('');
  const [time, setTime] = useState('');
  const [lastSurpriseRecipeId, setLastSurpriseRecipeId] = useState(null);
  const { pathname } = useLocation();
  const isRecipeDetail = pathname.startsWith('/recipe');

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
        showSearch={pathname === '/' || isRecipeDetail} search={search} onSearchChange={setSearch} isRecipeDetail={isRecipeDetail}
      />
      {favoritesError && <p className="favorites-error" role="alert">{favoritesError}</p>}
      <Routes>
        <Route
          path="/"
          element={
            <Home
              search={debouncedSearch}
              category={category}
              diet={diet}
              time={time}
              onCategoriesLoad={setCategories}
              categories={categories}
              onCategoryChange={setCategory}
              onDietChange={setDiet}
              onTimeChange={setTime}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              lastSurpriseRecipeId={lastSurpriseRecipeId}
              onSurpriseRecipeSelected={setLastSurpriseRecipeId}
            />
          }
        />
        <Route path="/favorites" element={<Favorites favorites={favorites} onToggleFavorite={handleToggleFavorite} />} />
        <Route
          path="/recipe/:id"
          element={<RecipeDetail favorites={favorites} onToggleFavorite={handleToggleFavorite} />}
        />
        <Route
          path="/recipe"
          element={<RecipeDetail favorites={favorites} onToggleFavorite={handleToggleFavorite} />}
        />
      </Routes>
      <Footer />
      <CookieBanner />
    </div>
  );
}

export default App;
