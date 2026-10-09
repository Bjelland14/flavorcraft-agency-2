import { useId, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import { FavouriteIcon, Image02Icon } from '@hugeicons/core-free-icons';
import '../../styles/recipe-card.css';

const DIET_LABELS = {
  vegetarian: 'Veg',
  vegan: 'Vegan',
  'gluten-free': 'Gluten-free',
};

function RecipePhoto({ url, alt }) {
  const [failed, setFailed] = useState(false);
  const showImage = url && !failed;

  return (
    <div className="recipe-card-photo">
      {showImage ? (
        <img src={url} alt={alt} loading="lazy" onError={() => setFailed(true)} />
      ) : (
        <div className="recipe-card-photo-fallback" role="img"
          aria-label={url ? 'Recipe photo unavailable' : 'No recipe photo provided'}>
          <HugeiconsIcon icon={Image02Icon} size={24} aria-hidden="true" />
          <span>{url ? 'Unavailable' : 'No photo'}</span>
        </div>
      )}
    </div>
  );
}

function RecipeCard({ recipe, isFavorite = false, onToggleFavorite }) {
  const titleId = useId();
  const tags = Array.isArray(recipe.tags) ? recipe.tags : [];
  const diets = [...new Set(tags.filter((tag) => typeof tag === 'string')
    .map((tag) => tag.trim().toLowerCase().replace(/\s+/g, '-'))
    .filter((tag) => DIET_LABELS[tag]))];
  const ingredients = Array.isArray(recipe.ingredients)
    ? recipe.ingredients.map((ingredient) => ingredient?.name)
      .filter((name) => typeof name === 'string' && name.trim()).slice(0, 3)
    : [];
  const hasTime = Number.isFinite(recipe.prepTime) && Number.isFinite(recipe.cookTime);
  const favoriteLabel = `${isFavorite ? 'Remove' : 'Save'} ${recipe.title} ${isFavorite ? 'from' : 'to'} favorites`;

  return (
    <article className="recipe-card" aria-labelledby={titleId}>
      <RecipePhoto key={recipe.image?.url || 'no-photo'}
        url={recipe.image?.url} alt={recipe.image?.alt || recipe.title} />
      <div className="recipe-card-content">
        <h3 id={titleId} title={recipe.title}>{recipe.title}</h3>
        {recipe.description && (
          <p className="recipe-card-description" title={recipe.description}>{recipe.description}</p>
        )}
        <ul className="recipe-card-badges" aria-label="Recipe information">
          {hasTime && <li>{recipe.prepTime + recipe.cookTime} min</li>}
          {diets.map((diet) => <li key={diet} title={diet === 'vegetarian' ? 'Vegetarian' : DIET_LABELS[diet]}
            aria-label={diet === 'vegetarian' ? 'Vegetarian' : DIET_LABELS[diet]}>{DIET_LABELS[diet]}</li>)}
          {recipe.servings > 0 && <li title={`${recipe.servings} servings`}>{recipe.servings} serv</li>}
          {recipe.difficulty && <li>{recipe.difficulty}</li>}
        </ul>
        {ingredients.length > 0 && (
          <p className="recipe-card-ingredients" title={ingredients.join(', ')}>
            {ingredients.map((ingredient, index) => (
              <span key={`${ingredient}-${index}`}>
                {index > 0 && <span className="recipe-card-separator" aria-hidden="true"> &middot; </span>}
                {index > 0 && <span className="sr-only">, </span>}{ingredient}
              </span>
            ))}
          </p>
        )}
      </div>
      <button type="button" className="recipe-card-favorite" aria-label={favoriteLabel}
        title={favoriteLabel} aria-pressed={isFavorite} disabled={!onToggleFavorite}
        onClick={() => onToggleFavorite(recipe)}>
        <HugeiconsIcon icon={FavouriteIcon} size={22} aria-hidden="true"
          fill={isFavorite ? 'currentColor' : 'none'} />
      </button>
    </article>
  );
}

export default RecipeCard;
