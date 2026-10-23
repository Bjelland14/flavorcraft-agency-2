# FlavorCraft

FlavorCraft is a recipe discovery web app that helps users find a dinner idea in seconds. Users can search and filter recipes, choose diet options, save favourites, open a recipe detail page with ingredients and steps, and use the "Surprise me" button to get a random recipe.

Built by **Team Beta (Agency 2)** at Noroff, October 2026.

**Live site:** https://flavorcraft-team-beta.vercel.app

> The old Netlify site (https://flavorcraft-team-beta.netlify.app) is no longer updated. We moved to Vercel after using up our free Netlify credits.

---

## Features

- **Search** recipes by name
- **Filters** for category, cooking time and difficulty, with a sidebar on desktop and a filter sheet on mobile
- **Diet options:** vegetarian, vegan, gluten-free and lactose-free
- **Exclude ingredients** you do not want
- **Tonight's Pick** and a **"Surprise me"** button for a random recipe
- **Favourites** saved in the browser (localStorage)
- **Recipe detail page** with ingredients, steps and adjustable servings
- **"Recipe not found"** page for invalid recipe links
- Search and filters **reset** when you navigate between pages
- **23 Norwegian dinner recipes** with dietary information, together with reviewed recipes from the Noroff API

---

## Team

| Name | Role |
|---|---|
| Lloyd Bjelland | Scrum Master and SEO & Analytics Lead |
| Marina Kovaleva | Lead Designer |
| Hampus Lang | Developer |
| Vladyslav Serikov | Developer |
| Milagros Vasshus | QA |

Product Owner: Monde Sineke

---

## Tech stack

- React + Vite
- React Router
- JavaScript
- Noroff API v2 (`recipe-book/recipes`)
- Hosting: Vercel

---

## Getting started

```bash
git clone https://github.com/Bjelland14/flavorcraft-agency-2.git
cd flavorcraft-agency-2
npm install
npm run dev
```

Other commands:

```bash
npm run build   # production build
npm run lint    # check the code with ESLint
npm test        # run the tests
```

---

## Project structure

```
src/
  api/                API requests to the Noroff API
  assets/components/  Reusable components (Header, Footer, CookieBanner, ...)
  data/               Our Norwegian recipes and the list of approved API recipes
  pages/              Home, Favorites and Recipe Detail
  styles/             CSS files
  utils/              Helper functions and hooks (filters, SEO, ...)
```

---

## Routing

| Path | Page |
|---|---|
| `/` | Home |
| `/favorites` | Favorites |
| `/recipe/:id` | Recipe detail |

`vercel.json` sends all routes to `index.html`, so links to a recipe page also work when you open them directly.

---

## Recipe data

- **Norwegian recipes:** The shared API had few complete recipes, so we added 23 Norwegian dinner recipes in `src/data/recipes.json`, with dietary information (gluten-free, lactose-free, vegetarian). These are always shown in the feed.
- **API recipes:** The shared API also contains other students' test entries. Only reviewed API recipes listed in `src/data/approvedRecipeIds.js` are shown, and they must have a photo. New API recipes are hidden until they are reviewed.
- **Diet options** use the dietary fields on each recipe. The API recipes do not have dietary data, so the diet options mainly match our Norwegian recipes.
- **Exclude ingredients** is a simple text match, not an allergen system. Users still need to check the ingredients.

**To approve a new API recipe:** check its description, ingredients, steps and photo, then add its exact ID with a title comment to `src/data/approvedRecipeIds.js`. Remove the ID again if it turns into test content.

---

## SEO and analytics

**SEO**
- Meta, Open Graph and Twitter card tags, so links look good when shared
- Dynamic page titles and descriptions for each recipe and page
- Recipe structured data (JSON-LD), validated with Google Rich Results Test: "1 valid item detected"
- `robots.txt`
- No fake ratings in the schema, and no user e-mails

**Analytics**
- Microsoft Clarity, which only loads after the user accepts the cookie banner

**Lighthouse (mobile)**

| Date | Performance | Accessibility | Best Practices | SEO |
|---|---|---|---|---|
| 14.10 (first audit) | 81 | 100 | 100 | 92 |
| 22.10 (Vercel) | 97 | 100 | 100 | 100 |
| 23.10 (final) | 96–97 | 100 | 100 | 100 |

Performance can vary a little between test runs.

---

## Workflow

- Agile with one-week sprints and a GitHub Projects board
- `main` is protected and needs two approvals (a teammate and QA)
- Every change is tested on a deploy preview before it is merged
- Branch names: `type/issue-number-short-description`, for example `feature/16-fetch-recipes`
- Commit messages: `feat:`, `fix:`, `docs:` and so on

---

## Documentation

- **QA test plan:** [TEST_PLAN.md](TEST_PLAN.md)
- **AI log:** [ai_log.md](ai_log.md)
- **Design and UX research:** [Figma](https://www.figma.com/design/Gvl9cCzIGiyHXIkvVdwEmB/FlavorCraft-Labs---Team-Beta?node-id=0-1&t=Uo6HZWvx0IGVYbYc-1)

---

## Ideas for the future

- A Cooking mode with step-by-step instructions and a timer
- Return to the same search results and scroll position after viewing a recipe
- A "dislike" option and personal recipe recommendations
- An AI chat that helps users find recipes
- Photos for our Norwegian recipes
- Automated end-to-end tests with Playwright
