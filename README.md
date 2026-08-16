# Trupeer.ai QA Engineer Assignment

End-to-end QA assignment for the Trupeer.ai video editor. Covers exploratory bug reporting, Playwright E2E automation, and LLM-as-a-judge validation of the AI script-rewriting feature.

See `plan.md` for the full assignment requirements.

## Repo Structure

| Folder | Part | What's inside |
| --- | --- | --- |
| `part1/` | Exploratory Testing | `Bug Report.pdf` — 3–5 bugs found manually |
| `part2/` | E2E Automation | Playwright suite with Page Object Model covering login, editor, AI script rewrite, and editor interactions |
| `part3/` | AI-Augmented Testing | Gemini LLM judge validating AI script rewrites against a structured rubric |

## Prerequisites

- Node.js v18+
- npm v9+
- A Trupeer.ai account with at least one video that has a script (recorded with mic enabled)
- A Google Gemini API key (for Part 3)

## Install

```bash
npm install
npx playwright install
```

## Environment Variables

Credentials are read from `.env` files — never hardcoded. There are two:

`part2/.env`:

```env
TRUPEER_EMAIL="your-email@example.com"
TRUPEER_PASSWORD="your-secure-password"
```

`part3/.env`:

```env
TRUPEER_EMAIL="your-email@example.com"
TRUPEER_PASSWORD="your-secure-password"
GEMINI_API_KEY="your-gemini-api-key"
JUDGE_MODEL="gemini-3.1-flash-lite"
```

## How to Run

### Part 2 — E2E tests

```bash
# From repo root
npm run test:e2e

# Or from part2/
cd part2 && npx playwright test
```

View the HTML report:

```bash
npx playwright show-report
```

### Part 3 — AI validation

```bash
# From repo root
npm run validate

# Or from part3/
cd part3 && npm run validate
```

### Run Everything

```bash
npm run test:e2e && npm run validate
```

Both parts run headed (a browser window opens). For CI/headless, set `headless: true` in the respective `playwright.config.ts`.

## Per-Part Docs

- [Part 2 README](part2/README.md) — setup, test scenarios
- [Part 3 README](part3/README.md) — setup, judge rubric