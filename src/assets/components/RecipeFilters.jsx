import { useId, useState } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Add01Icon,
  Cancel01Icon,
  InformationCircleIcon,
  UnavailableIcon,
} from '@hugeicons/core-free-icons';

import {
  countFilters,
  DIET_OPTIONS,
  EMPTY_FILTERS,
} from '../../utils/recipeFilters';

function Choice({ label, checked, onChange, disabled = false }) {
  return (
    <label className="filter-choice">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <span>{label}</span>
    </label>
  );
}

export function IngredientChips({ ingredients, onRemove }) {
  return ingredients.map((ingredient) => (
    <button
      type="button"
      className="ingredient-chip"
      key={ingredient}
      aria-label={`Remove excluded ingredient ${ingredient}`}
      onClick={() => onRemove(ingredient)}
    >
      <HugeiconsIcon icon={UnavailableIcon} size={13} aria-hidden="true" />
      {ingredient}
      <HugeiconsIcon icon={Cancel01Icon} size={12} aria-hidden="true" />
    </button>
  ));
}

export default function RecipeFilters({
  filters,
  onChange,
  categories,
  mobile = false,
  onClose,
  onApply,
  resultCount,
}) {
  const [ingredient, setIngredient] = useState('');
  const titleId = useId();
  const ingredientId = useId();
  const hintId = useId();
  const count = countFilters(filters);
  const standardCategories = [
    'Dinner',
    'Lunch',
    'Breakfast',
    'Dessert',
    'Drink',
    'Snack',
  ];
  const options = [
    ...standardCategories,
    ...categories.filter((category) => !standardCategories.includes(category)),
  ];

  function toggle(key, value) {
    const values = filters[key];
    onChange({
      ...filters,
      [key]: values.includes(value)
        ? values.filter((item) => item !== value)
        : [...values, value],
    });
  }

  function clear() {
    onChange(EMPTY_FILTERS);
    setIngredient('');
  }

  function addIngredient(event) {
    event.preventDefault();
    const value = ingredient.trim().toLowerCase();
    if (!value) return;
    if (!filters.excludedIngredients.includes(value)) {
      onChange({
        ...filters,
        excludedIngredients: [...filters.excludedIngredients, value],
      });
    }
    setIngredient('');
  }

  return (
    <section
      className={`filter-panel${mobile ? ' filter-panel--mobile' : ''}`}
      aria-labelledby={titleId}
    >
      <div className="filter-panel-header">
        <h2 id={titleId}>
          Filters
          {count > 0 && (
            <sup className="filter-badge">
              {count}
              <span className="sr-only"> active</span>
            </sup>
          )}
        </h2>
        {mobile ? (
          <button
            type="button"
            className="filter-close"
            aria-label="Close filters"
            onClick={onClose}
          >
            <HugeiconsIcon icon={Cancel01Icon} size={20} aria-hidden="true" />
          </button>
        ) : (
          <button type="button" className="filter-clear" onClick={clear}>
            Clear all
          </button>
        )}
      </div>
      <div className="filter-panel-body">
        <fieldset className="filter-group">
          <legend>Category</legend>
          <div className="filter-options filter-options--categories">
            {options.map((category) => (
              <Choice
                key={category}
                label={category}
                checked={filters.category.includes(category)}
                disabled={!categories.includes(category)}
                onChange={() => toggle('category', category)}
              />
            ))}
          </div>
        </fieldset>
        <fieldset className="filter-group">
          <legend>Diet</legend>
          <div className="filter-options filter-options--diets">
            {DIET_OPTIONS.map(([field, label]) => (
              <Choice
                key={field}
                label={label}
                checked={filters.diet.includes(field)}
                onChange={() => toggle('diet', field)}
              />
            ))}
          </div>
        </fieldset>
        <fieldset className="filter-group filter-group--time">
          <legend>
            Cooking time <span>max, min</span>
          </legend>
          <div className="time-options">
            {[
              ['15', '15'],
              ['30', '30'],
              ['60', '60'],
              ['', '90+'],
            ].map(([value, label]) => (
              <button
                type="button"
                key={label}
                aria-label={
                  value ? `Up to ${value} minutes` : 'Any cooking time'
                }
                aria-pressed={filters.time === value}
                onClick={() =>
                  onChange({
                    ...filters,
                    time: filters.time === value ? '' : value,
                  })
                }
              >
                {label}
              </button>
            ))}
          </div>
        </fieldset>
        <fieldset className="filter-group">
          <legend>Difficulty</legend>
          <div className="filter-options filter-options--difficulty">
            {['Easy', 'Medium', 'Hard'].map((difficulty) => (
              <Choice
                key={difficulty}
                label={difficulty}
                checked={filters.difficulty.includes(difficulty)}
                onChange={() => toggle('difficulty', difficulty)}
              />
            ))}
          </div>
        </fieldset>
        <div className="filter-group filter-group--ingredients">
          <label className="filter-group-label" htmlFor={ingredientId}>
            Exclude ingredients
          </label>
          <p className="ingredient-hint" id={hintId}>
            <HugeiconsIcon
              icon={InformationCircleIcon}
              size={14}
              aria-hidden="true"
            />
            Allergy? Always check the ingredients.
          </p>
          <form className="ingredient-input" onSubmit={addIngredient}>
            <button type="submit" aria-label="Add excluded ingredient">
              <HugeiconsIcon icon={Add01Icon} size={20} aria-hidden="true" />
            </button>
            <input
              id={ingredientId}
              value={ingredient}
              maxLength={60}
              aria-describedby={hintId}
              placeholder="Add an ingredient"
              onChange={(event) => setIngredient(event.target.value)}
            />
          </form>
          {filters.excludedIngredients.length > 0 && (
            <div className="ingredient-chips">
              <IngredientChips
                ingredients={filters.excludedIngredients}
                onRemove={(value) => toggle('excludedIngredients', value)}
              />
            </div>
          )}
        </div>
      </div>
      {mobile && (
        <div className="filter-panel-footer">
          <button type="button" className="filter-reset-button" onClick={clear}>
            Clear all
          </button>
          <button
            type="button"
            className="filter-apply-button"
            onClick={onApply}
          >
            Show {resultCount} {resultCount === 1 ? 'recipe' : 'recipes'}
          </button>
        </div>
      )}
    </section>
  );
}
