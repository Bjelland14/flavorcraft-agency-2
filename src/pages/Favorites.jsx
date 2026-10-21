import '../styles/home.css';
import RecipeCard from '../assets/components/RecipeCard';
import { usePageMeta } from '../utils/usePageMeta';

function Favorites({ favorites, onToggleFavorite }) {
  usePageMeta({ title: 'Favorites', description: 'Your saved FlavorCraft recipes, all in one place.' });

  return (
    <main className="content">
      <section className="recipe-area" aria-labelledby="favorites-heading">
        <h2 id="favorites-heading">Favorites</h2>
        {favorites.length === 0 ? (
          <p className="empty-state" role="status">No favorites yet.</p>
        ) : (
          <>
            <p className="recipe-count" role="status">
              {favorites.length} {favorites.length === 1 ? 'recipe' : 'recipes'}
            </p>
            <ul className="recipe-grid">
              {favorites.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} isFavorite onToggleFavorite={onToggleFavorite} />
              ))}
            </ul>
          </>
        )}
      </section>
    </main>
  );
}

export default Favorites;
