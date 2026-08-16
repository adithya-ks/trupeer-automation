# Part 3 — LLM-as-a-Judge Validation Suite

Uses Gemini as an automated judge to evaluate the quality of Trupeer.ai's AI script-rewriting feature across multiple natural language prompts. Reuses the Part 2 page objects.

## Prerequisites


## Setup

```bash
# From repo root
npm install

# Install Playwright browsers (Chromium, Firefox, WebKit)
npx playwright install
```

## Environment Variables

Create a `.env` file in this directory (`part3/.env`):

```env
# Application credentials
TRUPEER_EMAIL="your-email@example.com"
TRUPEER_PASSWORD="your-secure-password"

# Gemini API
GEMINI_API_KEY="your-gemini-api-key"
JUDGE_MODEL="gemini-3.1-flash-lite"
```

## Run the Validation

```bash
# From this directory
npm run validate

# From repo root
npm run validate --workspace part3

# Directly via Playwright
npx playwright test validate.spec.ts
```

Tests run headed and have a 5-minute timeout per test.

## How It Works

1. Logs into Trupeer.ai, opens the first video in the Library, and reads the baseline script.
2. For each prompt in `validate.spec.ts`, rewrites the script via AI, keeps the changes, and reads the modified script.
3. Calls `judge()` in `judge.ts`, which asks Gemini to score the rewrite against 4 criteria:
   - **Intent** — does the rewrite follow the user's prompt?
   - **Coherence** — is the output fluent and grammatically correct?
   - **Preservation** — does it keep the core information of the original?
   - **Meaningful Change** — is it substantially different, not a trivial reword?
4. Each criterion returns a pass/fail verdict with a confidence score (0.0–1.0).
5. The test fails if any prompt fails a criterion with high confidence (`≥ 0.8`).

## Validated Prompts

| Prompt | Expected behavior |
| --- | --- |
| Make this more professional | Formal tone rewrite |
| Translate to malayalam | Translate to Malayalam |
| Add a call to action at the end | Append a CTA |
| Translate to Spanish | Translate to Spanish |
| Make this script more concise | Shorten while keeping key points |

## View the Report

```bash
npx playwright show-report
```

## Project Structure

```
part3/
├── judge.ts           # Gemini judge implementation & JSON schema evaluation
├── validate.spec.ts   # Automated test iterating through AI prompts
├── playwright.config.ts
├── tsconfig.json
└── .env               # Credentials & API key (not committed)
```
