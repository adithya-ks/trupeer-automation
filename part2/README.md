# Part 2 — playwright e2e tests for trupeer.ai

end-to-end tests covering the trupeer.ai video editor user flows, built with playwright and the page object model.


## Setup

```bash
# from repo root
npm install

# install playwright browsers (chromium, firefox, webkit)
npx playwright install
```

## Environment variables

create a `.env` file in this directory (`part2/.env`):

```env
trupeer_email="your-email@example.com"
trupeer_password="your-secure-password"
```

## run the tests

```bash
# from this directory
npx playwright test

# from repo root
npm run test:e2e

# run a single test
npx playwright test -g "login lands on dashboard"
```

tests run headed (a browser window opens). for ci/headless, set `headless: true` in `playwright.config.ts`.

## View the report

```bash
npx playwright show-report
```

## Test scenarios

all tests are in `tests/trupeer.spec.ts`:

| # | test | steps & assertions |
| --- | --- | --- |
| 1 | login lands on dashboard | logs in via `loginpage`, dismisses the welcome dialog, asserts the url no longer contains `/login`. |
| 2 | editor loads with key elements | navigates to library, opens the first video, asserts the script tab, canvas, and timeline are visible. |
| 3 | modify script with ai returns a changed script | reads the original script, modifies it via ai prompt ("make this script more concise"), clicks "keep changes", asserts the script text changed. |
| 3b | [negative] empty prompt does not alter script | modifies script with an empty prompt, asserts the script text remains unchanged. |
| 4 | editor interaction: background change applies correctly | opens the visuals tab, clicks a background tile, compares canvas screenshots before/after and asserts they differ. |

## Project structure

```
part2/
├── page-objects/      # loginpage, librarypage, editorpage (pom)
├── tests/             # trupeer.spec.ts
├── playwright.config.ts
└── .env               # credentials (not committed)
```
