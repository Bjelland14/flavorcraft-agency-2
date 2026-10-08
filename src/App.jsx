import { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './assets/components/Header';
import Footer from './assets/components/Footer';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import RecipeDetail from './pages/RecipeDetail';

function App() {
  const [search, setSearch] = useState('');
  const [diet, setDiet] = useState('');
  const [time, setTime] = useState('');
  const { pathname } = useLocation();

  return (
    <div className="app-shell">
      <Header
        showSearch={pathname === '/'} search={search} onSearchChange={setSearch}
        diet={diet} onDietChange={setDiet} time={time} onTimeChange={setTime}
      />
      <Routes>
        <Route path="/" element={<Home search={search} diet={diet} time={time} />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/recipe" element={<RecipeDetail />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
