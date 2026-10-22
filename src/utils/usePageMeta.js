// Sets the page title, meta description and Open Graph tags for one page.
// When the page closes, the default tags from index.html are put back.

import { useEffect } from 'react';

export const SITE_URL = 'https://flavorcraft-team-beta.vercel.app';

const DEFAULTS = {
  title: 'FlavorCraft – Find a dinner idea in seconds',
  description: 'Find a dinner idea in seconds. Easy everyday recipes with search, filters and a Surprise me button.',
  ogDescription: 'Easy everyday recipes with search, filters and a Surprise me button.',
  url: `${SITE_URL}/`,
  type: 'website',
};

function setMeta(attribute, key, value) {
  let tag = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', value);
}

function removeMeta(attribute, key) {
  document.head.querySelector(`meta[${attribute}="${key}"]`)?.remove();
}

function applyMeta({ title, description, ogDescription, url, type, image, imageAlt }) {
  document.title = title;
  setMeta('name', 'description', description);
  setMeta('property', 'og:title', title);
  setMeta('property', 'og:description', ogDescription);
  setMeta('property', 'og:url', url);
  setMeta('property', 'og:type', type);

  if (image) {
    setMeta('property', 'og:image', image);
    setMeta('property', 'og:image:alt', imageAlt || title);
  } else {
    removeMeta('property', 'og:image');
    removeMeta('property', 'og:image:alt');
  }
}

export function shortDescription(text, maxLength = 155) {
  if (typeof text !== 'string') return '';
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength - 1).replace(/\s+\S*$/, '')}…`;
}

export function usePageMeta({ title, fullTitle, description, url, type, image, imageAlt } = {}) {
  useEffect(() => {
    const resolvedTitle = fullTitle || (title ? `${title} – FlavorCraft` : DEFAULTS.title);
    applyMeta({
      title: resolvedTitle,
      description: description || DEFAULTS.description,
      ogDescription: description || DEFAULTS.ogDescription,
      url: url || DEFAULTS.url,
      type: type || DEFAULTS.type,
      image,
      imageAlt,
    });

    return () => applyMeta(DEFAULTS);
  }, [title, fullTitle, description, url, type, image, imageAlt]);
}
