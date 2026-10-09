import RecipeCard from '../assets/components/RecipeCard';
import '../styles/home.css';

function Favorites({ favorites = [], onToggleFavorite }) {
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
                <li key={recipe.id}>
                  <RecipeCard recipe={recipe} isFavorite onToggleFavorite={onToggleFavorite} />
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </main>
  );
}

export default Favorites;
