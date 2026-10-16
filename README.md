# FlavorCraft 
Recipe discovery web app for FlavorCraft Labs – Team Beta (Agency 2)

**Live site:** https://flavorcraft-team-beta.netlify.app

## Installation

Clone the repository:

git clone <https://github.com/Bjelland14/flavorcraft-agency-2.git>

Install dependencies:

npm install

Start the development server:

npm run dev

## Build

Create a production build:

npm run build

## Project Structure

The project uses the following structure:

- `src/assets/components/` – Reusable React components (Header, Footer, CookieBanner)
- `src/pages/` – Application pages
- `src/api/` – API requests
- `src/data/` – Static recipe list (recipes.json)
- `src/utils/` – Helper functions (filters, Recipe schema)
- `src/styles/` – Global and component styles

## Shared API recipe review (#83)

The feed, search, category options, Surprise me, and restored favorites use
`isFeedRecipe`. Only API IDs listed in `src/data/approvedRecipeIds.js` can pass
this check, alongside the existing content and photo checks. New shared-API
entries are hidden by default, even if they copy a reviewed recipe's title.

To include another API recipe, review its description, ingredients, instructions,
and photo, then add its exact ID and a title comment to that file. Remove its ID
if it becomes test content. Simple recipes can still qualify with fewer than
three ingredients. The static JSON recipe collection is currently unused by the
feed; a `source: 'static'` field from the shared API does not bypass review.

## Routing

React Router is used for client-side routing.

- `/` – Home page
- `/favorites` – Favorites page
- `/recipe` – Recipe Detail

## Tech Stack

- React
- Vite
- JavaScript



## Naming conventions

**Branches:** `type/issue-number-short-description`, for example `feature/16-fetch-recipes` or `fix/31-broken-images`

**Commit messages (semantic):** for example `feat: add search bar`, `fix: show error when API fails` or `docs: update README`


## Design & research

UX research (interviews, notes and insights) and designs are in Figma:
[FlavorCraft Labs – Team Beta (Figma)](https://www.figma.com/design/Gvl9cCzIGiyHXIkvVdwEmB/FlavorCraft-Labs---Team-Beta?node-id=0-1&t=Uo6HZWvx0IGVYbYc-1)

## SEO & Analytics

**Responsible:** Lloyd Bjelland (SEO & Analytics Lead)

### SEO
- **Meta tags:** page title, meta description, Open Graph and Twitter card tags in `index.html` (#71)
- **robots.txt:** allows all search engines. Before, the SPA redirect returned `index.html` for `/robots.txt` (#77, in review)
- **Recipe schema (JSON-LD):** helper in `src/utils/recipeSchema.js` that turns a recipe into Schema.org/Recipe data for Google. It will be added to the recipe detail page (#42, in review)
  - No `aggregateRating`, since the API has no rating data (agreed with the PO)
  - Never includes `owner.email`, for privacy
- **Planned:** dynamic page titles and recipe-specific Open Graph tags on the recipe detail page (#40, #41)

### Analytics
- **Microsoft Clarity** for heatmaps and session recordings (#39)
- Clarity only loads after the user accepts the cookie banner, as required in Norway/EU (`src/assets/components/CookieBanner.jsx`)

### Lighthouse
| Date | Performance | Accessibility | Best Practices | SEO |
|------|-------------|---------------|----------------|-----|
| 14.10 (first audit, mobile) | 81 | 100 | 100 | 92 |

Findings and follow-up are tracked in #43.
