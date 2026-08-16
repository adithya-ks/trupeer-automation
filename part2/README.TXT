# Playwright End-to-End Test Suite Documentation

This single document covers the setup, project layout, test scenarios, execution commands, and debugging guidelines for the **Trupeer.ai** Playwright test suite.

---

## 📂 Project Structure

```text
page2/
├── page-objects/          # Page Object Model (POM) classes
│   ├── EditorPage.ts      # Video editor locators and actions (AI script, visual changes, canvas)
│   ├── LibraryPage.ts     # Library navigation and video selection
│   └── LoginPage.ts       # Authentication flows and dialog handlers
├── tests/                 # Test suites
│   └── trupeer.specs.ts   # Main end-to-end user flow scenarios
├── .env                   # Environment variables (Credentials)
├── package.json           # Project dependencies and script shortcuts
└── playwright.config.ts   # Global Playwright settings

```

---

## 🛠️ Prerequisites & Installation

### 1. Requirements

* **Node.js**: `v18.0.0` or higher
* **npm**: `v9.0.0` or higher

### 2. Installation Commands

Navigate into the root directory (`page2`) and run the setup steps:

```bash
# Navigate to project folder
cd page2

# Install project dependencies
npm install

# Install Playwright browser binaries (Chromium, Firefox, WebKit)
npx playwright install

```

### 3. Environment Setup

Create a `.env` file in the project root directory:

```env
TRUPEER_EMAIL="your-email@example.com"
TRUPEER_PASSWORD="your-secure-password"

```

---

## 🚀 Test Run Commands

### Run Full Test Suite

```bash

npx playwright test


### View HTML Test Reports

```bash
# Open generated test report in browser
npx playwright show-report

```

---

## 🧪  Test Scenarios (`trupeer.specs.ts`)

| # | Test Scenario | Description & Actions |
| --- | --- | --- |
| **1** | `1. Login lands on dashboard` | Validates authentication via `LoginPage` and asserts navigation away from `/login`. |
| **2** | `2. Editor loads with key elements` | Navigates from `LibraryPage` to `EditorPage` and verifies `scriptTab`, `canvas`, and `timeline` visibility. |
| **3** | `3. Modify Script with AI returns a changed script` | Uses `modifyScriptWithAI`, saves changes via `keepChangesAfterModification`, and verifies inner text update. |
| **4** | `3b. [Negative] Empty prompt to Modify Script` | Submits an empty AI prompt and asserts that original script text remains unchanged. |
| **5** | `4. Editor interaction: background change` | Triggers visual background change and performs canvas screenshot diffs (`beforeImage` vs `afterImage`). |