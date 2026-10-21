import { LazyMotion, domAnimation, m as Motion, useReducedMotion } from 'motion/react';
import { HugeiconsIcon } from '@hugeicons/react';
import { FavouriteIcon, ListViewIcon } from '@hugeicons/core-free-icons';
import '../../styles/favorite-button.css';

const spring = { type: 'spring', duration: 0.3, bounce: 0.2 };
const fade = { duration: 0.12, ease: 'easeOut' };

function FavoriteButton({ recipe, isFavorite = false, onToggleFavorite, className = '' }) {
  const reduceMotion = useReducedMotion();
  const label = `${isFavorite ? 'Remove' : 'Save'} ${recipe.title} ${isFavorite ? 'from' : 'to'} favorites`;

  return (
    <button
      type="button"
      className={`favorite-button ${className}`}
      aria-label={label}
      title={label}
      aria-pressed={isFavorite}
      disabled={!onToggleFavorite}
      onClick={() => onToggleFavorite(recipe)}
    >
      <LazyMotion features={domAnimation} strict>
        <span className="favorite-button-icons" aria-hidden="true">
          {/* Keep both layers mounted so a rapid toggle reverses the current spring. */}
          <Motion.span
            className="favorite-button-icon"
            data-icon="heart"
            initial={false}
            animate={{
              opacity: isFavorite ? 0 : 1,
              transform: reduceMotion || !isFavorite
                ? 'rotate(0deg) scale(1)'
                : 'rotate(-30deg) scale(0.9)',
            }}
            transition={{ transform: reduceMotion ? { duration: 0 } : spring, opacity: fade }}
          >
            <HugeiconsIcon icon={FavouriteIcon} size={22} />
          </Motion.span>
          <Motion.span
            className="favorite-button-icon"
            data-icon="list"
            initial={false}
            animate={{
              opacity: isFavorite ? 1 : 0,
              transform: reduceMotion || isFavorite
                ? 'rotate(0deg) scale(1)'
                : 'rotate(30deg) scale(0.9)',
            }}
            transition={{ transform: reduceMotion ? { duration: 0 } : spring, opacity: fade }}
          >
            <HugeiconsIcon icon={ListViewIcon} size={22} />
          </Motion.span>
        </span>
      </LazyMotion>
    </button>
  );
}

export default FavoriteButton;
