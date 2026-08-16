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

> **Tip:** Run `npm run test:e2e` first. Part 3 depends on Part 2's credentials and on the same account/video setup, and it reuses Part 2's page objects.

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

## Architecture

The project is an npm workspaces monorepo (`part2`, `part3`). Both parts use **Playwright + TypeScript**. The key architectural decision is that **Part 3 does not re-implement UI automation** — it imports Part 2's page objects directly (`../part2/page-objects/...`) and adds an LLM judge on top. This keeps selectors, waits, and the login flow defined exactly once.

### Part 2 — E2E Automation (Page Object Model)

```
part2/
├── page-objects/          # POM: selectors + actions, no assertions on flows
│   ├── LoginPage.ts
│   ├── LibraryPage.ts
│   └── EditorPage.ts
├── tests/
│   └── trupeer.spec.ts    # Test scenarios + assertions
├── playwright.config.ts   # Browser mode, reporter, retries, dotenv
└── .env                   # Credentials (not committed)
```

**Layer separation.** Each page object encapsulates a page's locators and the actions a test can take against it:

- `LoginPage` — owns the `#email` / `#password` inputs, the Continue button, and the post-login welcome dialog. `login()` fills credentials, submits, and asserts the URL leaves `/login`. `dismissWelcomeDialogIfPresent()` uses a non-fatal `waitFor` so the dialog is handled only when it actually appears (flakiness guard).
- `LibraryPage` — owns the library nav button and the video rows (selected via a stable `data-userflow-id` attribute). `openFirstVideo()` asserts navigation into the editor URL.
- `EditorPage` — the largest POM. Owns the Script/Visuals tabs, canvas, timeline, the Slate-based script editor, the "Modify Script with AI" button, the prompt input, the "Rewrite script" / "Keep changes" buttons, and the background visual tiles. `verifyEditorLoaded()` asserts the three key editor regions (script panel, preview canvas, timeline) are visible.

**Test layer** (`trupeer.spec.ts`) consumes those page objects. A `beforeEach` performs the shared login, and each test is scoped to one user flow:

| # | Test | What it verifies |
| --- | --- | --- |
| 1 | Login lands on dashboard | URL no longer contains `/login` |
| 2 | Editor loads with key elements | Script tab, canvas, timeline visible |
| 3 | Modify Script with AI returns a changed script | Script text changes after a "make concise" rewrite |
| 3b | [Negative] Empty prompt does not alter script | Script text stays unchanged with an empty prompt |
| 4 | Background change applies correctly | Canvas screenshot before/after selecting a tile differs |

**Wait strategy.** Everything is an explicit wait (`waitFor({ state })`, `expect(...).toHaveText(...)`, `toHaveURL`) — no hard-coded sleeps except one bounded 2s settle after initial page load. Assertion messages are meaningful (e.g. `'Script content should change after AI modification'`).

**Config.** Runs headed, `fullyParallel: false`, no retries locally (2 in CI), HTML reporter, trace on first retry, and `dotenv` loads `.env`.

### Part 3 — AI-Augmented Testing (LLM-as-a-Judge)

```
part3/
├── judge.ts           # Gemini judge: prompt + JSON schema + scoring
├── validate.spec.ts   # Drives the browser, iterates prompts, aggregates verdicts
├── playwright.config.ts
├── tsconfig.json
└── .env               # Credentials + GEMINI_API_KEY (not committed)
```

**The core idea.** The AI rewrite output is non-deterministic — there's no expected string to match. So instead of hard assertions, a second LLM (Gemini) acts as an automated judge. The pipeline is:

1. **Baseline capture** — Playwright logs in, opens the first video, reads the original script.
2. **Rewrite loop** — for each prompt in `validate.spec.ts` (`PROMPTS`), it fires "Modify Script with AI", clicks "Keep changes", waits for the editor text to change (90s timeout — generation is slow), and reads the modified script.
3. **Judging** — `judge()` in `judge.ts` sends `{USER PROMPT, ORIGINAL, MODIFIED}` to Gemini with `temperature: 0` (deterministic) and a **structured output schema** (`responseSchema`), forcing the response to be valid JSON.

The rubric has 4 criteria, each scored with `pass` (boolean), `confidence` (0.0–1.0), and a short `reason`:

- **intent** — does the rewrite reflect the user's prompt?
- **coherence** — is it fluent and grammatically correct?
- **preservation** — does it keep the core information of the original?
- **meaningfulChange** — is it a real change, not a trivial reword?

4. **Aggregation** — a prompt counts as a failure only if a criterion fails **with confidence ≥ 0.8** (`THRESHOLD`). Low-confidence failures are logged but don't fail the run — this avoids flaky CI from an uncertain judge. The test fails if any high-confidence failures remain.

**Reuse over rebuild.** `validate.spec.ts` imports `LoginPage`, `LibraryPage`, and `EditorPage` from `../part2/page-objects`, plus the whole login flow. The only new code is the judge and the orchestration loop.

**Config.** Single worker (stateful flow, must run serially), 5-minute per-test timeout, list reporter, headless configurable.

### Confidence threshold & judge disagreements

A gate on CI should require every criterion to pass with `confidence ≥ 0.8` — lower than that, the judge is unsure and the failure may be a false positive. When the LLM judge disagrees with a human reviewer:

- **Low-confidence disagreements** — log them, don't gate. The output should be routed to a human review queue.
- **High-confidence false failures** — treat as a real regression candidate; re-run the rewrite to confirm before alerting.
- **Judge is wrong but confident** — that's the dangerous case. Guard against it by sampling: on failure, request a second judge (different model / higher-tier model) or re-prompt the same model with the human's verdict as a correction example, then take the majority.

A pragmatic approach: use the LLM judge as a **pre-filter** (fast, cheap, broad coverage) and route only high-confidence failures and low-confidence flag-ons to a human for final sign-off — LLM verdicts gate automatically, humans arbitrate edge cases.

## Per-Part Docs

- [Part 2 README](part2/README.md) — setup, test scenarios
- [Part 3 README](part3/readme.md) — setup, judge rubric
