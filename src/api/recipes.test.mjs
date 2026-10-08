import assert from 'node:assert/strict';
import { test } from 'node:test';
import { getRecipes } from './recipes.js';
import { filterRecipes } from '../utils/filterRecipes.js';

const recipes = [
  { id: '1', title: 'Vegetable pasta', description: 'Quick dinner',
    tags: ['Vegetarian'], ingredients: [{ name: 'Tomato' }], prepTime: 10, cookTime: 15 },
  { id: '2', title: 'Rice bowl', tags: ['Vegan', 'Gluten free'],
    ingredients: [{ name: 'Beans' }], prepTime: 5, cookTime: 10 },
  { id: '3', title: 'Roast chicken', tags: [], ingredients: [], prepTime: 15, cookTime: 60 },
];

test('fetches every page and passes the cancellation signal', async (t) => {
  const controller = new AbortController();
  const requests = [];
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    requests.push({ url, options });
    const page = Number(url.searchParams.get('page'));
    return Response.json({ data: [recipes[page - 1]], meta: { nextPage: page === 1 ? 2 : null } });
  });

  assert.deepEqual(await getRecipes({ signal: controller.signal }), recipes.slice(0, 2));
  assert.equal(requests.length, 2);
  assert.equal(requests[0].url.pathname, '/recipe-book/recipes');
  assert.equal(requests[0].url.searchParams.get('limit'), '100');
  assert.equal(requests[1].options.signal, controller.signal);
});

test('handles an empty collection', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => Response.json({ data: [], meta: { nextPage: null } }));
  assert.deepEqual(await getRecipes(), []);
});

test('rejects unsuccessful responses and network failures', async (t) => {
  const fetchMock = t.mock.method(globalThis, 'fetch', async () => new Response('', { status: 503 }));
  await assert.rejects(getRecipes(), /Request failed \(503\)/);
  fetchMock.mock.mockImplementation(async () => { throw new TypeError('Network unavailable'); });
  await assert.rejects(getRecipes(), /Network unavailable/);
});

test('rejects malformed recipe data, JSON, and pagination', async (t) => {
  const fetchMock = t.mock.method(globalThis, 'fetch');
  for (const body of [
    { data: null, meta: { nextPage: null } },
    { data: [null], meta: { nextPage: null } },
    { data: [{ id: '1' }], meta: { nextPage: null } },
    { data: recipes },
    { data: recipes, meta: { nextPage: 1 } },
    { data: recipes, meta: { nextPage: '2' } },
  ]) {
    fetchMock.mock.mockImplementation(async () => Response.json(body));
    await assert.rejects(getRecipes(), /invalid/);
  }
  fetchMock.mock.mockImplementation(async () => new Response('not JSON'));
  await assert.rejects(getRecipes(), SyntaxError);
});

test('propagates cancellation', async (t) => {
  const controller = new AbortController();
  controller.abort();
  t.mock.method(globalThis, 'fetch', async (_url, { signal }) => signal.throwIfAborted());
  await assert.rejects(getRecipes({ signal: controller.signal }), { name: 'AbortError' });
});

test('search matches titles, descriptions, tags, and ingredients without case sensitivity', () => {
  assert.deepEqual(filterRecipes(recipes, { search: ' PASTA ' }), [recipes[0]]);
  assert.deepEqual(filterRecipes(recipes, { search: 'dinner' }), [recipes[0]]);
  assert.deepEqual(filterRecipes(recipes, { search: 'vegan' }), [recipes[1]]);
  assert.deepEqual(filterRecipes(recipes, { search: 'tomato' }), [recipes[0]]);
  assert.deepEqual(filterRecipes(recipes, { search: 'no-match' }), []);
  assert.deepEqual(filterRecipes(recipes, { search: '' }), recipes);
});

test('combines diet and total cooking time with search', () => {
  assert.deepEqual(filterRecipes(recipes, { diet: 'vegetarian', time: '30', search: 'tomato' }), [recipes[0]]);
  assert.deepEqual(filterRecipes(recipes, { diet: 'vegan', time: '15' }), [recipes[1]]);
  assert.deepEqual(filterRecipes(recipes, { diet: 'gluten-free' }), [recipes[1]]);
  assert.deepEqual(filterRecipes(recipes, { diet: 'vegetarian', time: '15' }), []);
});

test('missing optional fields do not crash filtering or imply dietary suitability', () => {
  const minimal = [{ id: '1', title: 'Simple meal' }];
  assert.deepEqual(filterRecipes(minimal), minimal);
  assert.deepEqual(filterRecipes(minimal, { diet: 'vegan' }), []);
  assert.deepEqual(filterRecipes(minimal, { time: '30' }), []);
});
