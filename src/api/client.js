const API_BASE_URL = 'https://v2.api.noroff.dev/';

export async function getJSON(path, { params = {}, signal } = {}) {
  const url = new URL(path, API_BASE_URL);
  url.search = new URLSearchParams(params);
  const response = await fetch(url, { signal });

  if (!response.ok) {
    throw new Error(`Request failed (${response.status}). Please try again.`);
  }

  return response.json();
}
