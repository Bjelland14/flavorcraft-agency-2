import assert from 'node:assert/strict';
import { test } from 'node:test';
import { isFeedRecipe } from './isFeedRecipe.js';
import { filterRecipes } from './filterRecipes.js';
import { pickSurpriseRecipe } from './surpriseRecipe.js';

const recipe = {
  id: 'db0b5880-e53a-4850-ba5f-3c3236c6f252',
  title: 'Tomato salad',
  description: 'Fresh tomatoes with olive oil.',
  image: { url: 'https://example.com/tomato-salad.jpg', alt: 'Tomato salad' },
  prepTime: 10,
  cookTime: 0,
  tags: ['Vegan'],
  dietary: { vegetarian: true },
  ingredients: [{ name: 'Tomatoes' }, { name: 'Olive oil' }],
  instructions: ['Chop the tomatoes.', 'Drizzle with olive oil and serve.'],
};

test('hides the reported brownies and future entries from discovery regardless of their title or content', () => {
  const unreviewed = [
    { ...recipe, id: '03009beb-f6e9-40dc-9164-22cbcc5881f9', title: 'brownies',
      description: 'blablablaabl', instructions: ['Follow instructions'] },
    { ...recipe, id: 'future-test', title: 'A convincing new dinner recipe' },
    { ...recipe, id: 'future-copy', source: 'static' },
    { ...recipe, id: 'future-duplicate-title' },
  ];
  assert.deepEqual(unreviewed.filter(isFeedRecipe), []);
  const visible = [...unreviewed, recipe].filter(isFeedRecipe);
  assert.deepEqual(filterRecipes(visible, { search: 'brownies' }), []);
  assert.deepEqual(filterRecipes(visible), [recipe]);
  for (const random of [0, 0.5, 0.999]) {
    assert.equal(pickSurpriseRecipe([...unreviewed, recipe], null, () => random), recipe);
  }
  assert.equal(pickSurpriseRecipe(unreviewed), null);
});

test('keeps reviewed simple recipes with fewer than three ingredients', () => {
  const juice = { ...recipe, id: '5da54af6-27ab-4340-82f6-4cf0b884263f',
    title: 'Fresh Orange Juice', ingredients: [{ name: 'Oranges' }],
    instructions: ['Cut oranges in half.', 'Squeeze the juice and serve.'] };
  assert.equal(isFeedRecipe(juice), true);
  assert.equal(pickSurpriseRecipe([juice]), juice);
});

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

test('excludes known test IDs from the feed and search while preserving other complete recipes', () => {
  const complete = { ...recipe, id: 'bfeeef7c-b89a-4e9e-871c-928912a09d61', title: 'Creamy Garlic Pasta',
    description: 'A quick pasta dish, perfect for testing the recipe form.' };
  const blocked = { ...complete, id: 'b4a637c2-2a64-4a03-b33f-1d773a084033' };
  const unfinished = { ...recipe, id: 'unfinished-pasta', title: 'Spagetti', description: 'testing' };
  assert.equal(isFeedRecipe(blocked), false);
  assert.equal(isFeedRecipe({ ...blocked, title: 'Renamed recipe', description: 'Fresh pasta.' }), false);
  const visible = [complete, blocked, unfinished].filter(isFeedRecipe);
  assert.deepEqual(filterRecipes(visible, { search: 'test' }), [complete]);
  assert.deepEqual(filterRecipes(visible, { search: 'testing' }), [complete]);
  assert.deepEqual(filterRecipes([blocked].filter(isFeedRecipe), { search: 'testing' }), []);
  assert.deepEqual(filterRecipes([blocked].filter(isFeedRecipe), { search: 'Creamy Garlic Pasta' }), []);
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
  const complete = [recipe, { ...recipe, id: '79783d40-2339-47ad-840a-9e3f9d340f60', description: 'A complete recipe used for testing.' }];
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
  assert.deepEqual(filterRecipes(visible, { search: 'tomato', diet: ['vegetarian'], time: '15' }), [recipe]);
  assert.deepEqual(filterRecipes(visible), [recipe]);
});
