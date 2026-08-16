# Part 3: LLM-as-a-Judge Validation Suite

This module uses Gemini as an automated judge to evaluate the quality of Trupeer.ai's AI script-rewriting feature across multiple natural language prompts.

---

## 📂 Project Structure

```text
submission/
├── part2/                    # Reusable Page Objects (LoginPage, LibraryPage, EditorPage)
└── part3/                    # AI Judge Validation Module
    ├── judge.ts              # Gemini API judge implementation & JSON schema evaluation
    ├── validate.spec.ts      # Automated Playwright test iterating through AI prompts
    ├── .env                  # Environment variables (API Keys & Credentials)
    ├── package.json          # Module dependencies
    ├── playwright.config.ts  # Playwright settings
    └── tsconfig.json         # TypeScript configuration



⚙️ Prerequisites
Node.js: v18.0.0 or higher

npm: v9.0.0 or higher

🛠️ Setup Instructions
1. Install Dependencies
Navigate into the part3 directory and install the required packages:

Bash
cd part3
npm install
npx playwright install
2. Configure Environment Variables
Create a .env file inside the part3/ directory with your application credentials and API key:

Code snippet
# Application Credentials
TRUPEER_EMAIL="your-email@example.com"
TRUPEER_PASSWORD="your-secure-password"

# Gemini API Key & Model Configuration
GEMINI_API_KEY="your-gemini-api-key"
JUDGE_MODEL="gemini-3.1-flash-lite"
🚀 Run Commands
Execute the validation suite using any of the following commands:

Single Command Execution (via npm script):

Bash
npm run validate
Direct Spec Execution via Playwright:

Bash
npx playwright test validate.spec.ts
Interactive UI Mode:

Bash
npx playwright test validate.spec.ts --ui
Headed Mode (Visible Browser):

Bash
npx playwright test validate.spec.ts --headed
View Test Report:

Bash
npx playwright show-report
📊 Sample Execution Output
Plaintext
[PASS] "Make this more professional"
   ✓ intent            0.95  Reflects professional tone
   ✓ coherence         0.98  Grammatically correct and fluent
   ✓ preservation      0.90  Retains original script information
   ✓ meaningfulChange  0.88  Rewritten with formal vocabulary

[PASS] "Translate to malayalam"
   ✓ intent            0.99  Translated into Malayalam script
   ✓ coherence         0.95  Natural phrasing in Malayalam
   ✓ preservation      0.92  Preserves core content
   ✓ meaningfulChange  0.99  Language fully converted

[PASS] "Add a call to action at the end"
   ✓ intent            0.96  Added closing CTA sentence
   ✓ coherence         0.97  Smooth text transition
   ✓ preservation      0.95  Original core text untouched
   ✓ meaningfulChange  0.85  Clear addition at conclusion

[PASS] "Translate to Spanish"
   ✓ intent            0.99  Script converted to Spanish
   ✓ coherence         0.96  Fluent Spanish syntax
   ✓ preservation      0.91  Meaning accurately transferred
   ✓ meaningfulChange  0.99  Full linguistic conversion

[PASS] "Make this script more concise"
   ✓ intent            0.94  Shortened text while keeping key points
   ✓ coherence         0.98  Clear and concise syntax
   ✓ preservation      0.89  Main message retained
   ✓ meaningfulChange  0.90  Word count significantly reduced






   ## 🧪 Evaluation Architecture (`judge.ts`)

The judge evaluates the original script against the rewritten script based on 4 structured criteria returning a JSON verdict:

* **Intent**: Does the rewritten script follow the user's prompt instruction?
* **Coherence**: Is the output grammatically fluent and natural?
* **Preservation**: Does it maintain the core information of the baseline script?
* **Meaningful Change**: Is the edit substantially distinct rather than a superficial reword?

A test failure is flagged if a prompt fails any evaluation criterion with a high confidence score (`≥ 0.8`).

