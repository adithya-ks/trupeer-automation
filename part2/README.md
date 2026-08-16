# Part 2 — Playwright E2E Tests for Trupeer.ai

End-to-end tests covering the Trupeer.ai video editor user flows, built with Playwright and the Page Object Model.

## Prerequisites

- Node.js v18+
- npm v9+

## Setup

```bash
# From repo root
npm install

# Install Playwright browsers (Chromium, Firefox, WebKit)
npx playwright install
```

## Environment Variables

Create a `.env` file in this directory (`part2/.env`):

```env
TRUPEER_EMAIL="your-email@example.com"
TRUPEER_PASSWORD="your-secure-password"
```

## Run the Tests

```bash
# From this directory
npx playwright test

# From repo root
npm run test:e2e

# Run a single test
npx playwright test -g "Login lands on dashboard"
```

Tests run headed (a browser window opens). For CI/headless, set `headless: true` in `playwright.config.ts`.

## View the Report

```bash
npx playwright show-report
```

## Test Scenarios

All tests are in `tests/trupeer.spec.ts`:

| # | Test | Steps & Assertions |
| --- | --- | --- |
| 1 | Login lands on dashboard | Logs in via `LoginPage`, dismisses the welcome dialog, asserts the URL no longer contains `/login`. |
| 2 | Editor loads with key elements | Navigates to Library, opens the first video, asserts the Script tab, canvas, and timeline are visible. |
| 3 | Modify Script with AI returns a changed script | Reads the original script, modifies it via AI prompt ("Make this script more concise"), clicks "Keep changes", asserts the script text changed. |
| 3b | [Negative] Empty prompt does not alter script | Modifies script with an empty prompt, asserts the script text remains unchanged. |
| 4 | Editor interaction: background change applies correctly | Opens the Visuals tab, clicks a background tile, compares canvas screenshots before/after and asserts they differ. |

## Project Structure

```
part2/
├── page-objects/      # LoginPage, LibraryPage, EditorPage (POM)
├── tests/             # trupeer.spec.ts
├── playwright.config.ts
└── .env               # Credentials (not committed)
```