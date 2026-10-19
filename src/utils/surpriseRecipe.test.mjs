import assert from 'node:assert/strict';
import { test } from 'node:test';
import { pickSurpriseRecipe } from './surpriseRecipe.js';

const dinner = {
  id: 'bfeeef7c-b89a-4e9e-871c-928912a09d61', title: 'Tomato pasta', description: 'A quick tomato pasta for dinner.',
  image: { url: 'https://example.com/pasta.jpg' }, category: 'Dinner',
  prepTime: 5, cookTime: 15, servings: 2, tags: ['Vegetarian'],
  dietary: { glutenFree: false, lactoseFree: true, vegetarian: true },
  ingredients: [{ name: 'Tomatoes' }, { name: 'Pasta' }],
  instructions: ['Boil the pasta.', 'Add the tomatoes and serve.'],
};
const breakfast = { ...dinner, id: '79783d40-2339-47ad-840a-9e3f9d340f60', title: 'Toast', category: 'Breakfast', tags: [] };
const slowDinner = { ...dinner, id: 'd91c9778-765f-4a74-820c-8b58990ba592', cookTime: 90 };

test('random selection can reach every eligible recipe without filters', () => {
  const recipes = [dinner, breakfast, slowDinner];
  assert.equal(pickSurpriseRecipe(recipes, {}, null, () => 0), dinner);
  assert.equal(pickSurpriseRecipe(recipes, {}, null, () => 0.5), breakfast);
  assert.equal(pickSurpriseRecipe(recipes, {}, null, () => 0.999), slowDinner);
});

test('random selection applies search, category, diet, and time together', () => {
  const filters = { search: 'tomato', category: 'Dinner', diet: ['lactoseFree', 'vegetarian'], time: '30' };
  for (const random of [0, 0.5, 0.999]) {
    assert.equal(pickSurpriseRecipe([breakfast, slowDinner, dinner], filters, null, () => random), dinner);
  }
});

test('Surprise me respects difficulty and ingredient exclusions', () => {
  const easyDinner = { ...dinner, difficulty: 'Easy' };
  const mediumDinner = { ...slowDinner, difficulty: 'Medium' };
  assert.equal(pickSurpriseRecipe([easyDinner, mediumDinner], {
    category: ['Dinner'], difficulty: ['Easy'], excludedIngredients: ['beans'],
  }), easyDinner);
  assert.equal(pickSurpriseRecipe([easyDinner, mediumDinner], {
    difficulty: ['Easy'], excludedIngredients: ['tomatoes'],
  }), null);
});

test('test recipes and unfinished content are never selected', () => {
  const excluded = [
    { ...dinner, title: ' My title ' },
    { ...dinner, id: 'b4a637c2-2a64-4a03-b33f-1d773a084033' },
    { ...dinner, instructions: ['Placeholder instruction'] },
    { ...dinner, image: null },
  ];
  for (const random of [0, 0.5, 0.999]) {
    assert.equal(pickSurpriseRecipe([...excluded, dinner], {}, null, () => random), dinner);
  }
  assert.equal(pickSurpriseRecipe(excluded), null);
});

test('avoids the previous recipe whenever another matching recipe exists', () => {
  const recipes = [dinner, breakfast, slowDinner];
  for (const previous of recipes) {
    for (const random of [0, 0.5, 0.999]) {
      assert.notEqual(pickSurpriseRecipe(recipes, {}, previous.id, () => random).id, previous.id);
    }
  }
  assert.equal(pickSurpriseRecipe(recipes, { category: 'Dinner' }, dinner.id, () => 0), slowDinner);
});

test('allows the sole matching recipe again and never relaxes filters', () => {
  assert.equal(pickSurpriseRecipe([dinner, breakfast], { category: 'Dinner' }, dinner.id), dinner);
  assert.equal(pickSurpriseRecipe([dinner], { diet: ['glutenFree'] }, dinner.id), null);
});

test('empty collections and no matching filters return no recipe', () => {
  assert.equal(pickSurpriseRecipe([]), null);
  assert.equal(pickSurpriseRecipe([dinner], { diet: ['glutenFree'] }), null);
  assert.equal(pickSurpriseRecipe([dinner], { search: 'unmatched' }), null);
});
