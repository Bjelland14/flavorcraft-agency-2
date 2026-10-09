import { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './assets/components/Header';
import Footer from './assets/components/Footer';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import RecipeDetail from './pages/RecipeDetail';
import useFavoriteRecipes from './hooks/useFavoriteRecipes';

function App() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [diet, setDiet] = useState('');
  const [time, setTime] = useState('');
  const { pathname } = useLocation();
  const { favorites, toggleFavorite } = useFavoriteRecipes();

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="app-shell">
      <Header
        showSearch={pathname === '/'} search={search} onSearchChange={setSearch}
        category={category} onCategoryChange={setCategory} categories={categories}
        diet={diet} onDietChange={setDiet} time={time} onTimeChange={setTime}
      />
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
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          }
        />
        <Route path="/favorites" element={<Favorites favorites={favorites} onToggleFavorite={toggleFavorite} />} />
        <Route path="/recipe" element={<RecipeDetail />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
