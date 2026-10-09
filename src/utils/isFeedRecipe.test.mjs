import assert from 'node:assert/strict';
import { test } from 'node:test';
import { isFeedRecipe } from './isFeedRecipe.js';
import { filterRecipes } from './filterRecipes.js';

const recipe = {
  id: 'real-recipe',
  title: 'Tomato salad',
  description: 'Fresh tomatoes with olive oil.',
  image: { url: 'https://example.com/tomato-salad.jpg', alt: 'Tomato salad' },
  prepTime: 10,
  cookTime: 0,
  tags: ['Vegan'],
  ingredients: [{ name: 'Tomatoes' }, { name: 'Olive oil' }],
  instructions: ['Chop the tomatoes.', 'Drizzle with olive oil and serve.'],
};

test('hides known test titles with different case and whitespace', () => {
  for (const title of ['my title', 'vv', 'nbn', 'testt', ' My   TITLE ', ' VV ', 'TESTT']) {
    assert.equal(isFeedRecipe({ ...recipe, title }), false, title);
  }
  assert.equal(isFeedRecipe({ ...recipe, title: 'Taste Test Cookies' }), true);
});

test('hides placeholder ingredients even when the name and image look real', () => {
  for (const title of ['Tiramisu', 'Pad Thai', 'Beef Wellington']) {
    assert.equal(isFeedRecipe({ ...recipe, title, image: { url: 'https://example.com/food.jpg' },
      ingredients: [{ name: 'Ingredient placeholder.' }] }), false);
  }
  assert.equal(isFeedRecipe({ ...recipe, ingredients: [...recipe.ingredients, { name: 'PLACEHOLDER ingredient' }] }), false);
});

test('hides placeholder instructions even when other instructions are usable', () => {
  for (const instruction of ['Placeholder instruction', 'Instruction placeholder.',
    'No instructions provided.', ' NO   INSTRUCTIONS PROVIDED. ']) {
    assert.equal(isFeedRecipe({ ...recipe, instructions: [...recipe.instructions, instruction] }), false);
  }
  assert.equal(isFeedRecipe({ ...recipe, ingredients: [{ name: 'No instructions provided.' }] }), false);
});

test('hides the additional unfinished-content markers found in the live API', () => {
  assert.equal(isFeedRecipe({ ...recipe, ingredients: [{ name: ' To be added ' }] }), false);
  assert.equal(isFeedRecipe({ ...recipe, instructions: ['Instructions will be added later.'] }), false);
});

test('hides empty and Lorem ipsum descriptions', () => {
  for (const description of ['', '  \n ', null, undefined, 'Lorem ipsum dolor sit amet.',
    'A recipe. LOREM   IPSUM filler.']) {
    assert.equal(isFeedRecipe({ ...recipe, description }), false);
  }
});

test('hides zero total time but preserves recipes with only prep or cooking time', () => {
  assert.equal(isFeedRecipe({ ...recipe, prepTime: 0, cookTime: 0 }), false);
  assert.equal(isFeedRecipe(recipe), true);
  assert.equal(isFeedRecipe({ ...recipe, prepTime: 0, cookTime: 20 }), true);
});

test('hides descriptions containing only test or testing', () => {
  for (const description of ['test', 'testing', ' TESTING ', 'Test.', 'testing!', 'Testing?']) {
    assert.equal(isFeedRecipe({ ...recipe, description }), false, description);
  }
  assert.equal(isFeedRecipe({ ...recipe, description: 'Testing a family recipe with fresh tomatoes.' }), true);
});

test('search excludes the review-reported testing entry but keeps complete recipes mentioning testing', () => {
  const complete = { ...recipe, id: 'complete-pasta', title: 'Creamy Garlic Pasta',
    description: 'A quick pasta dish, perfect for testing the recipe form.' };
  const unfinished = { ...recipe, id: 'unfinished-pasta', title: 'Spagetti', description: 'testing' };
  const visible = [complete, unfinished].filter(isFeedRecipe);
  assert.deepEqual(filterRecipes(visible, { search: 'test' }), [complete]);
  assert.deepEqual(filterRecipes(visible, { search: 'Spagetti' }), []);
  assert.deepEqual(filterRecipes(visible), [complete]);
});

test('handles missing, empty, and malformed content safely', () => {
  for (const value of [null, undefined, {}, { ...recipe, ingredients: [] },
    { ...recipe, ingredients: [null] }, { ...recipe, ingredients: [{ name: ' ' }] },
    { ...recipe, ingredients: null }, { ...recipe, instructions: [] },
    { ...recipe, instructions: [null] }, { ...recipe, instructions: [' '] },
    { ...recipe, instructions: null }, { ...recipe, prepTime: undefined },
    { ...recipe, cookTime: -10 }, { ...recipe, cookTime: '10' }]) {
    assert.equal(isFeedRecipe(value), false);
  }
});

test('hides recipes without a photo URL', () => {
  for (const image of [undefined, null, {}, { url: '' }, { url: '   ' }, { url: null }, { url: 123 }]) {
    assert.equal(isFeedRecipe({ ...recipe, image }), false);
  }
  assert.equal(isFeedRecipe(recipe), true);
  const visible = [recipe, { ...recipe, id: 'no-photo', title: 'Chickpea Special', image: null }]
    .filter(isFeedRecipe);
  assert.deepEqual(filterRecipes(visible, { search: 'Chickpea' }), []);
  assert.deepEqual(filterRecipes(visible), [recipe]);
});

test('keeps complete recipes with photos regardless of duplicate titles or mentions of testing', () => {
  const complete = [recipe, { ...recipe, id: 'another-recipe', description: 'A complete recipe used for testing.' }];
  assert.deepEqual(complete.filter(isFeedRecipe), complete);
  assert.equal(isFeedRecipe({ ...recipe, title: 'Tiramisu' }), true);
  assert.equal(isFeedRecipe({ ...recipe, title: 'Pad Thai' }), true);
});

test('hidden recipes cannot reappear when searching or clearing filters', () => {
  const visible = [recipe, { ...recipe, id: 'test-recipe', title: 'testt' },
    { ...recipe, id: 'placeholder-recipe', title: 'Pad Thai', instructions: ['Placeholder instruction'] }]
    .filter(isFeedRecipe);
  assert.deepEqual(filterRecipes(visible, { search: 'testt' }), []);
  assert.deepEqual(filterRecipes(visible, { search: 'Pad Thai' }), []);
  assert.deepEqual(filterRecipes(visible, { search: 'tomato', diet: 'vegan', time: '15' }), [recipe]);
  assert.deepEqual(filterRecipes(visible), [recipe]);
});
