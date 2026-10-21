// Adds the Schema.org/Recipe JSON-LD for the open recipe to <head>,
// so Google can read it. It is removed again when the page closes.
import { useEffect } from 'react';
import { buildRecipeSchema } from './recipeSchema';

export function useRecipeSchema(recipe) {
  useEffect(() => {
    const schema = buildRecipeSchema(recipe);
    if (!schema) return undefined;

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'recipe-schema';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => script.remove();
  }, [recipe]);
}
