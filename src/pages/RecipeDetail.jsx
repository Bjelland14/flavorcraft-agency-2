import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getRecipe } from '../api/recipes';
import { useRecipeSchema } from '../utils/useRecipeSchema';
import { SITE_URL, shortDescription, usePageMeta } from '../utils/usePageMeta';
import '../styles/recipe-detail.css';

function recipeFacts(recipe) {
  return [
    Number.isFinite(recipe.prepTime) && `Prep ${recipe.prepTime} min`,
    Number.isFinite(recipe.cookTime) && `Cook ${recipe.cookTime} min`,
    Number.isFinite(recipe.servings) && recipe.servings > 0 && `Serves ${recipe.servings}`,
    typeof recipe.difficulty === 'string' && recipe.difficulty.trim(),
  ].filter(Boolean);
}

function formatQuantity(quantity) {
  return new Intl.NumberFormat('en', { maximumFractionDigits: 2 }).format(quantity);
}

function ingredientText(ingredient, servings) {
  if (typeof ingredient === 'string') return ingredient;
  if (!ingredient || typeof ingredient.name !== 'string') return '';

  const rawQuantity = ingredient.quantity ?? ingredient.amount;
  const numericQuantity = typeof rawQuantity === 'number'
    ? rawQuantity
    : Number(String(rawQuantity).trim());
  const quantity = Number.isFinite(numericQuantity) && numericQuantity > 0
    ? numericQuantity / servings
    : rawQuantity;
  const unit = typeof ingredient.unit === 'string' ? ingredient.unit.trim() : '';
  const displayUnit = unit === 'piece' && quantity !== 1 ? 'pieces' : unit;
  const measurement = [
    quantity !== undefined && quantity !== null && String(quantity).trim()
      ? Number.isFinite(quantity) ? formatQuantity(quantity) : String(quantity).trim()
      : '',
    displayUnit,
  ].filter(Boolean).join(' ');

  return measurement ? `${measurement} ${ingredient.name}` : ingredient.name;
}

function RecipeDetail() {
  const { id } = useParams();
  const [result, setResult] = useState({ id: null, attempt: -1, status: 'loading', recipe: null });
  const [attempt, setAttempt] = useState(0);
  const [checkedIngredients, setCheckedIngredients] = useState([]);

  useEffect(() => {
    if (!id) {
      return undefined;
    }

    const controller = new AbortController();

    getRecipe(id, { signal: controller.signal })
      .then((recipe) => {
        if (!controller.signal.aborted) {
          setCheckedIngredients([]);
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
  }, [id, attempt]);

  const status = !id
    ? 'not-found'
    : result.id !== id || result.attempt !== attempt
      ? 'loading'
      : result.status;


  const loadedRecipe = status === 'success' ? result.recipe : null;
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
      <main className="content recipe-detail" aria-busy="true">
        <Link className="back-link" to="/">← Back to recipes</Link>
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

  const { recipe } = result;
  const servingCount = Number.isFinite(recipe.servings) && recipe.servings > 0 ? recipe.servings : 1;
  const ingredients = Array.isArray(recipe.ingredients)
    ? recipe.ingredients.map((ingredient) => ingredientText(ingredient, servingCount)).filter(Boolean)
    : [];
  const instructions = Array.isArray(recipe.instructions)
    ? recipe.instructions.filter((instruction) => typeof instruction === 'string' && instruction.trim())
    : [];
  const tags = Array.isArray(recipe.tags)
    ? recipe.tags.filter((tag) => typeof tag === 'string' && tag.trim())
    : [];

  return (
    <main className="content recipe-detail">
      <Link className="back-link" to="/">← Back to recipes</Link>

      <article>
        <header className="recipe-hero">
          <div className="detail-image">
            <span>{recipe.image?.url ? 'Recipe image unavailable' : 'No photo provided'}</span>
            {recipe.image?.url && (
              <img
                src={recipe.image.url}
                alt={recipe.image.alt || recipe.title}
                onError={(event) => { event.currentTarget.hidden = true; }}
              />
            )}
          </div>

          <div className="recipe-summary">
            {recipe.category && <p className="recipe-eyebrow">{recipe.category}</p>}
            <h1>{recipe.title}</h1>
            {recipe.description && <p className="recipe-intro">{recipe.description}</p>}
            <ul className="detail-facts" aria-label="Recipe details">
              {recipeFacts(recipe).map((fact) => <li key={fact}>{fact}</li>)}
            </ul>
            {tags.length > 0 && (
              <ul className="recipe-tags" aria-label="Recipe tags">
                {tags.map((tag) => <li key={tag}>{tag}</li>)}
              </ul>
            )}
            <button
              className="button start-cooking"
              type="button"
              onClick={() => document.getElementById('recipe-steps')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Start cooking
            </button>
          </div>
        </header>

        <div className="recipe-workspace">
          <section className="ingredients-panel" aria-labelledby="ingredients-heading">
            <h2 id="ingredients-heading">Ingredients <span>({ingredients.length})</span></h2>
            <p className="ingredients-serving">For 1 serving</p>
            {ingredients.length > 0 ? (
              <ul className="ingredient-list">
                {ingredients.map((ingredient, index) => {
                  const checked = checkedIngredients.includes(index);
                  return (
                    <li key={`${ingredient}-${index}`}>
                      <label>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => setCheckedIngredients((current) => (
                            checked ? current.filter((item) => item !== index) : [...current, index]
                          ))}
                        />
                        <span>{ingredient}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            ) : <p className="section-empty">No ingredients provided.</p>}
          </section>

          <section className="steps-panel" id="recipe-steps" aria-labelledby="steps-heading" tabIndex="-1">
            <h2 id="steps-heading">Steps <span>({instructions.length})</span></h2>
            {instructions.length > 0 ? (
              <ol className="instruction-list">
                {instructions.map((instruction, index) => <li key={`${index}-${instruction}`}>{instruction}</li>)}
              </ol>
            ) : <p className="section-empty">No instructions provided.</p>}
          </section>
        </div>
      </article>
    </main>
  );
}

export default RecipeDetail;
