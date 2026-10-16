import assert from 'node:assert/strict';
import { test } from 'node:test';
import { FAVORITES_KEY, readFavorites, toggleFavorite, writeFavorites } from './favorites.js';

const recipe = {
  id: 'db0b5880-e53a-4850-ba5f-3c3236c6f252', title: 'Tomato salad', description: 'Fresh tomatoes.',
  image: { url: 'https://example.com/salad.jpg' }, prepTime: 10, cookTime: 0,
  ingredients: [{ name: 'Tomatoes' }], instructions: ['Chop and serve.'],
};

function memoryStorage(initial = null) {
  let value = initial;
  return {
    getItem(key) { assert.equal(key, FAVORITES_KEY); return value; },
    setItem(key, next) { assert.equal(key, FAVORITES_KEY); value = next; },
  };
}

test('saves a recipe, restores it after reload, and persists removal', () => {
  const storage = memoryStorage();
  const saved = toggleFavorite(readFavorites(storage), recipe);
  writeFavorites(storage, saved);
  assert.deepEqual(readFavorites(storage), [recipe]);
  writeFavorites(storage, toggleFavorite(readFavorites(storage), recipe));
  assert.deepEqual(readFavorites(storage), []);
});

test('removes favorites by ID without removing other recipes', () => {
  const other = { ...recipe, id: 'other' };
  assert.deepEqual(toggleFavorite([recipe, other], { ...recipe, title: 'Updated' }), [other]);
});

test('ignores corrupt storage, invalid entries, duplicates, and blocked test recipes', () => {
  for (const value of ['broken json', '{}', 'null']) {
    assert.deepEqual(readFavorites(memoryStorage(value)), []);
  }
  const saved = [null, {}, recipe, recipe, { ...recipe, id: '' },
    { ...recipe, id: 'b4a637c2-2a64-4a03-b33f-1d773a084033' }];
  assert.deepEqual(readFavorites(memoryStorage(JSON.stringify(saved))), [recipe]);
});

test('handles unavailable reads and reports failed writes', () => {
  const storage = {
    getItem() { throw new Error('Storage blocked'); },
    setItem() { throw new Error('Quota exceeded'); },
  };
  assert.deepEqual(readFavorites(storage), []);
  assert.throws(() => writeFavorites(storage, [recipe]), /Quota exceeded/);
});
