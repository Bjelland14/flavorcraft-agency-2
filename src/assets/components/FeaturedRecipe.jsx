import { useState } from 'react';
import { Link } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import { ArrowRight02Icon, DiceFaces05Icon, FavouriteIcon, StarIcon } from '@hugeicons/core-free-icons';
import '../../styles/featured-recipe.css';

function FeaturedPhoto({ recipe }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="featured-photo">
      {!failed ? (
        <img src={recipe.image.url} alt={recipe.image.alt || recipe.title}
          fetchPriority="high" onError={() => setFailed(true)} />
      ) : <span>Recipe photo unavailable</span>}
    </div>
  );
}

function FeaturedRecipe({ recipe, status, isFavorite, onToggleFavorite, onSurprise }) {
  const favoriteLabel = recipe
    ? `${isFavorite ? 'Remove' : 'Save'} ${recipe.title} ${isFavorite ? 'from' : 'to'} favorites`
    : '';
  return (
    <section className={`featured-recipe${recipe ? '' : ' featured-recipe--empty'}`}
      aria-labelledby="featured-title" aria-busy={status === 'loading'}>
      <span className="featured-pick">
        <HugeiconsIcon icon={StarIcon} size={13} fill="currentColor" aria-hidden="true" />
        Tonight’s pick
      </span>
      {recipe && <FeaturedPhoto key={recipe.image.url} recipe={recipe} />}
      {recipe && (
        <button type="button" className="featured-favorite" aria-label={favoriteLabel}
          title={favoriteLabel} aria-pressed={isFavorite} onClick={() => onToggleFavorite(recipe)}>
          <HugeiconsIcon icon={FavouriteIcon} size={22} aria-hidden="true"
            fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      )}
      <div className="featured-content">
        {recipe?.category && <p className="featured-category">{recipe.category}</p>}
        <h1 id="featured-title">{recipe ? recipe.title : 'A little dinner inspiration'}</h1>
        {recipe ? (
          <ul className="featured-facts" aria-label="Featured recipe information">
            <li>{recipe.prepTime + recipe.cookTime} min</li>
            {recipe.difficulty && <li>{recipe.difficulty}</li>}
            {recipe.servings > 0 && <li>{recipe.servings} {recipe.servings === 1 ? 'serving' : 'servings'}</li>}
          </ul>
        ) : (
          <p className="featured-message">
            {status === 'loading' ? 'Finding recipes for you…' : status === 'error'
              ? 'Load the recipes below to find your next meal.'
              : 'No matching recipes. Try changing your search or filters.'}
          </p>
        )}
        <div className="featured-actions">
          <button type="button" className="featured-surprise" disabled={!recipe || status !== 'success'}
            onClick={onSurprise}>
            <HugeiconsIcon icon={DiceFaces05Icon} size={18} aria-hidden="true" />
            Surprise me
          </button>
          {recipe && (
            <Link className="featured-open" to={`/recipe/${encodeURIComponent(recipe.id)}`}>
              <HugeiconsIcon icon={ArrowRight02Icon} size={18} aria-hidden="true" />
              <span>Open<span className="featured-open-desktop-label"> recipe</span></span>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

export default FeaturedRecipe;
