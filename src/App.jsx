import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import RecipeBrowser from './assets/components/RecipeBrowser';
import Footer from './assets/components/Footer';
import CookieBanner from './assets/components/CookieBanner'; 
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
  const [lastSurpriseRecipeId, setLastSurpriseRecipeId] = useState(null);
  const location = useLocation();

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

  return (
    <div className="app-shell">
      <RecipeBrowser
        key={location.key}
        isHome={location.pathname === '/'}
        favorites={favorites}
        favoritesError={favoritesError}
        onToggleFavorite={handleToggleFavorite}
        lastSurpriseRecipeId={lastSurpriseRecipeId}
        onSurpriseRecipeSelected={setLastSurpriseRecipeId}
      />
      <Footer />
      <CookieBanner />
    </div>
  );
}

export default App;
