import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import { filterRecipes } from './filterRecipes.js';

const staticRecipes = JSON.parse(await readFile(new URL('../data/recipes.json', import.meta.url), 'utf8'));
const fields = ['glutenFree', 'lactoseFree', 'vegetarian'];

test('every combination of dietary toggles requires all selected static dietary fields', () => {
  for (let mask = 0; mask < 8; mask += 1) {
    const diet = fields.filter((_, index) => mask & (1 << index));
    const expected = staticRecipes.filter((recipe) => diet.every((field) => recipe.dietary[field]));
    assert.deepEqual(filterRecipes(staticRecipes, { diet }), expected);
  }
});

test('dietary claims require explicit true fields, even if tags claim a match', () => {
  const base = { title: 'Soup', tags: ['gluten-free', 'lactose-free', 'vegetarian'] };
  const recipes = [
    base,
    { ...base, dietary: null },
    { ...base, dietary: {} },
    { ...base, dietary: { vegetarian: false } },
    { ...base, dietary: { vegetarian: 'true' } },
    { ...base, dietary: { vegetarian: true } },
  ];
  assert.deepEqual(filterRecipes(recipes), recipes);
  assert.deepEqual(filterRecipes(recipes, { diet: ['vegetarian'] }), [recipes[5]]);
  assert.deepEqual(filterRecipes(recipes, { diet: ['vegetarian', 'lactoseFree'] }), []);
});

test('dietary preferences combine with search, category, and time', () => {
  const matching = {
    title: 'Tomato soup', category: 'Lunch', prepTime: 10, cookTime: 15,
    dietary: { glutenFree: true, lactoseFree: true, vegetarian: true },
  };
  const recipes = [
    matching,
    { ...matching, title: 'Pea soup' },
    { ...matching, category: 'Dinner' },
    { ...matching, cookTime: 60 },
    { ...matching, dietary: { glutenFree: true, lactoseFree: false, vegetarian: true } },
  ];
  assert.deepEqual(filterRecipes(recipes, {
    search: 'tomato', category: 'Lunch', time: '30', diet: fields,
  }), [matching]);
});

test('multiple categories and difficulties use OR within their groups and AND between them', () => {
  const recipes = [
    { title: 'Soup', category: 'Lunch', difficulty: 'Easy' },
    { title: 'Salad', category: 'Dinner', difficulty: 'Medium' },
    { title: 'Toast', category: 'Breakfast', difficulty: 'Easy' },
    { title: 'Roast', category: 'Dinner', difficulty: 'Hard' },
    { title: 'Unknown difficulty', category: 'Dinner' },
  ];
  assert.deepEqual(filterRecipes(recipes, {
    category: ['Lunch', 'Dinner'], difficulty: ['Easy', 'Medium'],
  }), recipes.slice(0, 2));
});

test('ingredient exclusions match names without case sensitivity and require known ingredients', () => {
  const recipes = [
    { title: 'Soup', ingredients: [{ name: 'Roasted Mushrooms' }, { name: 'Cream' }] },
    { title: 'Salad', ingredients: [{ name: 'Walnuts' }] },
    { title: 'Toast', ingredients: [{ name: 'Bread' }] },
    { title: 'Unknown ingredients' },
    { title: 'Empty ingredients', ingredients: [] },
  ];
  assert.deepEqual(filterRecipes(recipes, { excludedIngredients: ['mushrooms', 'NUTS'] }), [recipes[2]]);
  assert.deepEqual(filterRecipes(recipes), recipes);
});

test('vegan selection requires a confirmed dietary field rather than a tag', () => {
  const recipes = [
    { title: 'Confirmed', dietary: { vegan: true } },
    { title: 'Tagged', tags: ['Vegan'] },
  ];
  assert.deepEqual(filterRecipes(recipes, { diet: ['vegan'] }), [recipes[0]]);
});
