import { HugeiconsIcon } from '@hugeicons/react';
import { FavouriteIcon } from '@hugeicons/core-free-icons';

function RecipeCard({ recipe, isFavorite, onToggleFavorite }) {
  const favoriteLabel = `${isFavorite ? 'Remove' : 'Save'} ${recipe.title} ${isFavorite ? 'from' : 'to'} favorites`;

  return (
    <li className="recipe-card">
      <div className="recipe-image">
        <span>{recipe.image?.url ? 'Image unavailable' : 'No photo provided'}</span>
        {recipe.image?.url && (
          <img src={recipe.image.url} alt={recipe.image.alt || recipe.title}
            loading="lazy" onError={(event) => { event.currentTarget.hidden = true; }} />
        )}
        <button type="button" className="favorite-button" aria-label={favoriteLabel}
          title={favoriteLabel} aria-pressed={isFavorite} onClick={() => onToggleFavorite(recipe)}>
          <HugeiconsIcon icon={FavouriteIcon} size={22} aria-hidden="true"
            fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="recipe-card-content">
        {recipe.category && <p className="recipe-category">{recipe.category}</p>}
        <h3>{recipe.title}</h3>
        {recipe.description && <p className="recipe-description">{recipe.description}</p>}
        <ul className="recipe-meta" aria-label="Recipe information">
          {Number.isFinite(recipe.prepTime) && Number.isFinite(recipe.cookTime) && (
            <li>{recipe.prepTime + recipe.cookTime} min</li>
          )}
          {recipe.servings > 0 && <li>Serves {recipe.servings}</li>}
          {recipe.difficulty && <li>{recipe.difficulty}</li>}
        </ul>
      </div>
    </li>
  );
}

export default RecipeCard;
