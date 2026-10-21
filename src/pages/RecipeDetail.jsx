import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Add01Icon,
  ArrowLeft02Icon,
  ArrowUp01Icon,
  ChefHatIcon,
  Clock01Icon,
  FavouriteIcon,
  Image01Icon,
  MinusIcon,
} from '@hugeicons/core-free-icons';
import { getRecipe } from '../api/recipes';
import logo from '../assets/logo.svg';
import { getStaticRecipe } from '../utils/recipeCollection';
import { useRecipeSchema } from '../utils/useRecipeSchema';
import { SITE_URL, shortDescription, usePageMeta } from '../utils/usePageMeta';
import '../styles/recipe-detail.css';
import { getStaticRecipe } from '../utils/recipeCollection';

function formatQuantity(quantity) {
  return new Intl.NumberFormat('en', { maximumFractionDigits: 2 }).format(quantity);
}

function ingredientParts(ingredient, baseServings, servings) {
  if (typeof ingredient === 'string') return { amount: '', name: ingredient };
  if (!ingredient || typeof ingredient.name !== 'string') return { amount: '', name: '' };

  const rawQuantity = ingredient.quantity ?? ingredient.amount;
  const numericQuantity = typeof rawQuantity === 'number'
    ? rawQuantity
    : Number(String(rawQuantity).trim());
  const quantity = Number.isFinite(numericQuantity) && numericQuantity > 0
    ? numericQuantity * (servings / baseServings)
    : rawQuantity;
  const unit = typeof ingredient.unit === 'string' ? ingredient.unit.trim() : '';
  const displayUnit = unit === 'piece' && quantity !== 1 ? 'pieces' : unit;
  const displayQuantity = quantity !== undefined && quantity !== null && String(quantity).trim()
    ? (Number.isFinite(quantity) ? formatQuantity(quantity) : String(quantity).trim())
    : '';

  return {
    amount: [displayQuantity, displayUnit].filter(Boolean).join(' '),
    name: ingredient.name,
  };
}

function dietaryLabel(recipe) {
  if (recipe.dietary?.vegetarian) return 'Vegetarian';
  if (recipe.dietary?.glutenFree) return 'Gluten-free';
  if (recipe.dietary?.lactoseFree) return 'Lactose-free';
  return '';
}

function getRecipeComments(recipe) {
  if (!Array.isArray(recipe.comments)) return [];

  return recipe.comments.filter(
    (comment) => comment && typeof comment.text === 'string' && comment.text.trim(),
  );
}

function commentAuthor(comment) {
  return typeof comment.author?.name === 'string' && comment.author.name.trim()
    ? comment.author.name.trim()
    : 'Anonymous';
}

function relativeCommentTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const difference = date.getTime() - Date.now();
  const units = [
    ['year', 31_536_000_000],
    ['month', 2_592_000_000],
    ['week', 604_800_000],
    ['day', 86_400_000],
    ['hour', 3_600_000],
    ['minute', 60_000],
  ];
  const [unit, milliseconds] = units.find(([, duration]) => Math.abs(difference) >= duration)
    || ['minute', 60_000];
  const amount = Math.round(difference / milliseconds);

  return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(amount, unit);
}

function FavoriteButton({
  className,
  favoriteLabel,
  isFavorite,
  recipe,
  onToggleFavorite,
  size,
  showTitle = false,
}) {
  return (
    <button
      className={className}
      type="button"
      aria-label={favoriteLabel}
      aria-pressed={isFavorite}
      title={showTitle ? favoriteLabel : undefined}
      onClick={() => onToggleFavorite?.(recipe)}
    >
      <HugeiconsIcon
        icon={FavouriteIcon}
        size={size}
        fill={isFavorite ? 'currentColor' : 'none'}
        aria-hidden="true"
      />
    </button>
  );
}

function RecipeImage({
  imageUrl,
  recipe,
  favoriteLabel,
  isFavorite,
  onToggleFavorite,
  onImageError,
}) {
  return (
    <div className={`detail-image${imageUrl ? '' : ' detail-image--placeholder'}`}>
      <div className="detail-image-actions">
        <Link to="/" aria-label="Back to recipes">
          <HugeiconsIcon icon={ArrowLeft02Icon} size={24} aria-hidden="true" />
        </Link>
        <FavoriteButton
          favoriteLabel={favoriteLabel}
          isFavorite={isFavorite}
          recipe={recipe}
          onToggleFavorite={onToggleFavorite}
          size={25}
        />
      </div>
      {imageUrl ? (
        <img src={imageUrl} alt={recipe.image?.alt || recipe.title} onError={onImageError} />
      ) : (
        <div className="detail-image-placeholder">
          <HugeiconsIcon icon={Image01Icon} size={34} aria-hidden="true" />
          <span>No photo available</span>
        </div>
      )}
    </div>
  );
}

function RecipeFacts({ recipe, diet }) {
  return (
    <ul className="detail-facts" aria-label="Recipe details">
      {Number.isFinite(recipe.prepTime) && (
        <li><HugeiconsIcon icon={Clock01Icon} size={18} aria-hidden="true" />Prep {recipe.prepTime} min</li>
      )}
      {Number.isFinite(recipe.cookTime) && (
        <li><HugeiconsIcon icon={Clock01Icon} size={18} aria-hidden="true" />Cook {recipe.cookTime} min</li>
      )}
      {recipe.difficulty && (
        <li><HugeiconsIcon icon={ChefHatIcon} size={18} aria-hidden="true" />{recipe.difficulty}</li>
      )}
      {diet && <li><HugeiconsIcon icon={ChefHatIcon} size={18} aria-hidden="true" />{diet}</li>}
    </ul>
  );
}

function ServingsControl({ servings, onChange }) {
  return (
    <div className="serving-control" aria-label="Recipe servings">
      <span>Servings</span>
      <div>
        <button
          type="button"
          aria-label="Decrease servings"
          disabled={servings <= 1}
          onClick={() => onChange(-1)}
        >
          <HugeiconsIcon icon={MinusIcon} size={22} aria-hidden="true" />
        </button>
        <b aria-live="polite">{servings}</b>
        <button type="button" aria-label="Increase servings" onClick={() => onChange(1)}>
          <HugeiconsIcon icon={Add01Icon} size={22} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

function IngredientsPanel({ ingredients, servings, checkedIngredients, onToggleIngredient }) {
  return (
    <section className="ingredients-panel" aria-labelledby="ingredients-heading">
      <h2 id="ingredients-heading">Ingredients <span>{ingredients.length}</span></h2>
      <p className="ingredients-serving">
        For {servings} {servings === 1 ? 'serving' : 'servings'}
      </p>
      {ingredients.length > 0 ? (
        <ul className="ingredient-list">
          {ingredients.map((ingredient, index) => {
            const checked = checkedIngredients.includes(index);

            return (
              <li key={`${ingredient.name}-${index}`}>
                <label className={checked ? 'is-checked' : ''}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggleIngredient(index)}
                  />
                  <span className="ingredient-amount">{ingredient.amount}</span>
                  <span>{ingredient.name}</span>
                </label>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="section-empty">No ingredients provided.</p>
      )}
    </section>
  );
}

function StepsPanel({ instructions, totalTime }) {
  return (
    <section className="steps-panel" id="recipe-steps" aria-labelledby="steps-heading" tabIndex="-1">
      <div className="section-heading-row">
        <h2 id="steps-heading">Steps <span>{instructions.length}</span></h2>
        {totalTime > 0 && (
          <p><HugeiconsIcon icon={Clock01Icon} size={18} aria-hidden="true" />{totalTime} min total</p>
        )}
      </div>
      {instructions.length > 0 ? (
        <ol className="instruction-list">
          {instructions.map((instruction, index) => (
            <li key={`${index}-${instruction}`}>{instruction}</li>
          ))}
        </ol>
      ) : (
        <p className="section-empty">No instructions provided.</p>
      )}
    </section>
  );
}

function CommentsPanel({ comments }) {
  return (
    <section className="comments-panel" aria-labelledby="comments-heading">
      <h2 id="comments-heading">Comments <span>{comments.length}</span></h2>
      {comments.length > 0 ? (
        <ul>
          {comments.map((comment, index) => {
            const author = commentAuthor(comment);
            const timestamp = comment.updated || comment.created;
            const time = relativeCommentTime(timestamp);

            return (
              <li key={comment.id || `${author}-${index}`}>
                <span className="comment-avatar">{author.charAt(0).toUpperCase()}</span>
                <div>
                  <b>{author}</b>
                  <p>{comment.text.trim()}</p>
                </div>
                {time && <time dateTime={timestamp}>{time}</time>}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="section-empty">No comments yet.</p>
      )}
    </section>
  );
}

function StartCookingButton({ className, onClick }) {
  return (
    <button className={`button start-cooking ${className}`} type="button" onClick={onClick}>
      <HugeiconsIcon icon={ChefHatIcon} size={18} aria-hidden="true" />
      Start cooking
    </button>
  );
}

function RecipeSiteFooter() {
  return (
    <footer className="recipe-site-footer">
      <div className="recipe-site-footer-inner">
        <Link className="recipe-site-brand" to="/" aria-label="FlavorCraft home">
          <img src={logo} alt="" aria-hidden="true" />
          <span><b>flavor</b><em>craft</em></span>
        </Link>
        <a className="recipe-back-to-top" href="#recipe-top" aria-label="Back to top">
          <HugeiconsIcon icon={ArrowUp01Icon} size={22} aria-hidden="true" />
        </a>
        <p>© 2026 FlavorCraft Labs. Team Beta</p>
      </div>
    </footer>
  );
}

function MobileRecipeToolbar({ recipe, favoriteLabel, isFavorite, onToggleFavorite }) {
  return (
    <div className="recipe-mobile-toolbar" aria-label="Recipe actions">
      <Link to="/" aria-label="Back to recipes">
        <HugeiconsIcon icon={ArrowLeft02Icon} size={24} aria-hidden="true" />
      </Link>
      <strong>{recipe.title}</strong>
      <FavoriteButton
        favoriteLabel={favoriteLabel}
        isFavorite={isFavorite}
        recipe={recipe}
        onToggleFavorite={onToggleFavorite}
        size={28}
      />
    </div>
  );
}

function RecipeDetail({ favorites = [], onToggleFavorite }) {
  const { id } = useParams();
  const staticRecipe = getStaticRecipe(id);
  const [result, setResult] = useState({
    id: null,
    attempt: -1,
    status: 'loading',
    recipe: null,
  });
  const [attempt, setAttempt] = useState(0);
  const [checkedIngredientsState, setCheckedIngredientsState] = useState({ id: null, value: [] });
  const [servings, setServings] = useState(null);
  const [imageFailureId, setImageFailureId] = useState(null);
  const [compactHeaderVisible, setCompactHeaderVisible] = useState(false);

  useEffect(() => {
    if (!id || staticRecipe) return undefined;

    const controller = new AbortController();

    getRecipe(id, { signal: controller.signal })
      .then((recipe) => {
        if (!controller.signal.aborted) {
          setResult({ id, attempt, status: 'success', recipe });
        }
      })
      .catch((error) => {
        if (!controller.signal.aborted) {
          setResult({
            id,
            attempt,
            status: error.status === 404 ? 'not-found' : 'error',
            recipe: null,
          });
        }
      });

    return () => controller.abort();
  }, [id, attempt, staticRecipe]);

  const status = !id
    ? 'not-found'
    : staticRecipe
      ? 'success'
      : result.id !== id || result.attempt !== attempt
        ? 'loading'
        : result.status;
  const recipe = staticRecipe || result.recipe;
  const baseServings = Number.isFinite(recipe?.servings) && recipe.servings > 0
    ? recipe.servings
    : 1;

  useEffect(() => {
    const updateCompactHeader = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
      setCompactHeaderVisible(window.innerWidth < 720 && scrollTop > 300);
    };

    updateCompactHeader();
    window.addEventListener('scroll', updateCompactHeader, { passive: true });
    window.addEventListener('resize', updateCompactHeader);

    return () => {
      window.removeEventListener('scroll', updateCompactHeader);
      window.removeEventListener('resize', updateCompactHeader);
    };
  }, [id]);


  const loadedRecipe = status === 'success' ? (staticRecipe || result.recipe) : null;
  useRecipeSchema(loadedRecipe);
  usePageMeta(loadedRecipe
    ? {
      title: loadedRecipe.title,
      description: shortDescription(loadedRecipe.description)
        || `How to make ${loadedRecipe.title}. Ingredients and step-by-step instructions.`,
      url: `${SITE_URL}/recipe/${loadedRecipe.id}`,
      type: 'article',
      image: loadedRecipe.image?.url,
      imageAlt: loadedRecipe.image?.alt || loadedRecipe.title,
    }
    : { title: status === 'not-found' ? 'Recipe not found' : undefined });
  
  if (status === 'loading') {
    return (
      <main className="content recipe-detail recipe-detail-message" aria-busy="true">
        <p className="detail-status" role="status">Loading recipe...</p>
      </main>
    );
  }

  if (status === 'not-found') {
    return (
      <main className="content recipe-detail recipe-detail-message">
        <h1>Recipe not found</h1>
        <p>This recipe may have been removed or the link is incorrect.</p>
        <Link className="button detail-return" to="/">Browse recipes</Link>
      </main>
    );
  }

  if (status === 'error') {
    return (
      <main className="content recipe-detail recipe-detail-message">
        <h1>We couldn&apos;t load this recipe</h1>
        <p>Please check your connection and try again.</p>
        <button className="button" type="button" onClick={() => setAttempt((value) => value + 1)}>
          Try again
        </button>
      </main>
    );
  }

  const currentServings = servings?.id === id ? servings.value : baseServings;
  const checkedIngredients = checkedIngredientsState.id === id ? checkedIngredientsState.value : [];
  const ingredients = Array.isArray(recipe.ingredients)
    ? recipe.ingredients
      .map((ingredient) => ingredientParts(ingredient, baseServings, currentServings))
      .filter((ingredient) => ingredient.name)
    : [];
  const instructions = Array.isArray(recipe.instructions)
    ? recipe.instructions.filter((instruction) => typeof instruction === 'string' && instruction.trim())
    : [];
  const comments = getRecipeComments(recipe);
  const tags = Array.isArray(recipe.tags)
    ? recipe.tags.filter((tag) => typeof tag === 'string' && tag.trim())
    : [];
  const diet = dietaryLabel(recipe);
  const recipeImageUrl = typeof recipe.image?.url === 'string' ? recipe.image.url.trim() : '';
  const imageUrl = imageFailureId !== id && recipeImageUrl ? recipeImageUrl : null;
  const isFavorite = favorites.some((favorite) => favorite.id === recipe.id);
  const favoriteLabel = `${isFavorite ? 'Remove' : 'Save'} ${recipe.title} ${isFavorite ? 'from' : 'to'} favorites`;
  const totalTime = [recipe.prepTime, recipe.cookTime]
    .filter(Number.isFinite)
    .reduce((total, time) => total + time, 0);

  const toggleIngredient = (index) => {
    setCheckedIngredientsState({
      id,
      value: checkedIngredients.includes(index)
        ? checkedIngredients.filter((item) => item !== index)
        : [...checkedIngredients, index],
    });
  };

  const updateServings = (change) => {
    setServings({
      id,
      value: Math.min(24, Math.max(1, currentServings + change)),
    });
  };

  const goToSteps = () => {
    document.getElementById('recipe-steps')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      {compactHeaderVisible && (
        <MobileRecipeToolbar
          recipe={recipe}
          favoriteLabel={favoriteLabel}
          isFavorite={isFavorite}
          onToggleFavorite={onToggleFavorite}
        />
      )}
      <main className="recipe-detail" id="recipe-top">
        <div className="recipe-detail-inner">
          <Link className="back-link" to="/">
            <HugeiconsIcon icon={ArrowLeft02Icon} size={22} aria-hidden="true" />
            Back to recipes
          </Link>
          <article>
            <header className="recipe-hero">
              <RecipeImage
                imageUrl={imageUrl}
                recipe={recipe}
                favoriteLabel={favoriteLabel}
                isFavorite={isFavorite}
                onToggleFavorite={onToggleFavorite}
                onImageError={() => setImageFailureId(id)}
              />
              <div className="recipe-summary">
                <div className="recipe-summary-heading">
                  <div>
                    {recipe.category && <p className="recipe-eyebrow">{recipe.category}</p>}
                    <h1>{recipe.title}</h1>
                  </div>
                  <FavoriteButton
                    className="detail-favorite"
                    favoriteLabel={favoriteLabel}
                    isFavorite={isFavorite}
                    recipe={recipe}
                    onToggleFavorite={onToggleFavorite}
                    size={25}
                    showTitle
                  />
                </div>
                {recipe.description && <p className="recipe-intro">{recipe.description}</p>}
                <RecipeFacts recipe={recipe} diet={diet} />
                {tags.length > 0 && (
                  <ul className="recipe-tags" aria-label="Recipe tags">
                    {tags.map((tag) => <li key={tag}>{tag}</li>)}
                  </ul>
                )}
                <ServingsControl servings={currentServings} onChange={updateServings} />
                <StartCookingButton className="start-cooking--desktop" onClick={goToSteps} />
                <p className="kitchen-note">Opens kitchen mode — one step at a time, screen stays on.</p>
              </div>
            </header>
            <div className="recipe-workspace">
              <IngredientsPanel
                ingredients={ingredients}
                servings={currentServings}
                checkedIngredients={checkedIngredients}
                onToggleIngredient={toggleIngredient}
              />
              <div className="recipe-main-column">
                <StepsPanel instructions={instructions} totalTime={totalTime} />
                <CommentsPanel comments={comments} />
                <StartCookingButton className="start-cooking--mobile" onClick={goToSteps} />
              </div>
            </div>
          </article>
        </div>
      </main>
      <RecipeSiteFooter />
    </>
  );
}

export default RecipeDetail;
