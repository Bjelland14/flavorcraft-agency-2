import assert from 'node:assert/strict';
import { test } from 'node:test';
import { pickSurpriseRecipe } from './surpriseRecipe.js';
import { filterRecipes } from './filterRecipes.js';

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
  assert.equal(pickSurpriseRecipe(recipes, null, () => 0), dinner);
  assert.equal(pickSurpriseRecipe(recipes, null, () => 0.5), breakfast);
  assert.equal(pickSurpriseRecipe(recipes, null, () => 0.999), slowDinner);
});

test('discovery can reach every available recipe even when the feed has no search or filter matches', () => {
  const recipes = [dinner, breakfast, slowDinner];
  for (const filters of [
    { search: 'unmatched' }, { category: ['Dessert'] }, { diet: ['vegan'] }, { time: '1' },
    { difficulty: ['Hard'] }, { excludedIngredients: ['tomatoes'] },
    { search: 'unmatched', category: ['Dessert'], diet: ['vegan'], time: '1',
      difficulty: ['Hard'], excludedIngredients: ['tomatoes'] },
  ]) {
    assert.deepEqual(filterRecipes(recipes, filters), []);
    assert.equal(pickSurpriseRecipe(recipes, null, () => 0), dinner);
    assert.equal(pickSurpriseRecipe(recipes, null, () => 0.5), breakfast);
    assert.equal(pickSurpriseRecipe(recipes, null, () => 0.999), slowDinner);
  }
});

test('test recipes and unfinished content are never selected', () => {
  const excluded = [
    { ...dinner, title: ' My title ' },
    { ...dinner, id: 'b4a637c2-2a64-4a03-b33f-1d773a084033' },
    { ...dinner, instructions: ['Placeholder instruction'] },
    { ...dinner, image: null },
  ];
  for (const random of [0, 0.5, 0.999]) {
    assert.equal(pickSurpriseRecipe([...excluded, dinner], null, () => random), dinner);
  }
  assert.equal(pickSurpriseRecipe(excluded), null);
});

test('avoids the previous recipe whenever another available recipe exists', () => {
  const recipes = [dinner, breakfast, slowDinner];
  for (const previous of recipes) {
    for (const random of [0, 0.5, 0.999]) {
      assert.notEqual(pickSurpriseRecipe(recipes, previous.id, () => random).id, previous.id);
    }
  }
  assert.equal(pickSurpriseRecipe(recipes, dinner.id, () => 0), breakfast);
});

test('allows the sole available recipe to be selected again', () => {
  assert.equal(pickSurpriseRecipe([dinner], dinner.id), dinner);
});

test('empty collections return no recipe', () => {
  assert.equal(pickSurpriseRecipe([]), null);
});
