# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: trupeer.spec.ts >> Trupeer E2E User Flows >> 2. Editor loads with key elements
- Location: tests\trupeer.spec.ts:34:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.waitFor: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('canvas').first() to be visible

```

# Page snapshot

```yaml
- generic [active] [ref=f9e1]:
  - generic [ref=f9e2]:
    - generic [ref=f9e3]:
      - generic [ref=f9e4]:
        - link "Back" [ref=f9e5] [cursor=pointer]:
          - /url: /
        - textbox [ref=f9e7]: "Screen Recording: Step-by-Step Guide"
      - tablist "Content view" [ref=f9e9]:
        - tab "Video" [selected] [ref=f9e10] [cursor=pointer]
        - tab "Document" [ref=f9e13] [cursor=pointer]
    - generic [ref=f9e16]:
      - generic [ref=f9e18]:
        - button "Enter Advanced Edit Mode" [ref=f9e19] [cursor=pointer]
        - generic [ref=f9e20]:
          - button "Skills"
        - button "English (IN) flag En" [ref=f9e21] [cursor=pointer]:
          - img "English (IN) flag" [ref=f9e22]
          - generic [ref=f9e23]: En
        - button "More options" [ref=f9e25] [cursor=pointer]
        - button "Share" [ref=f9e26] [cursor=pointer]
      - generic [ref=f9e27]:
        - status "Loading script" [ref=f9e49]
        - button [ref=f9e68] [cursor=pointer]
  - region "Notifications alt+T"
  - alert [ref=f9e95]
  - iframe [ref=f9e96]:
    
```

# Test source

```ts
  1  | 
  2  | import { Page, Locator } from '@playwright/test';
  3  | 
  4  | export class EditorPage {
  5  |   readonly page: Page;
  6  |   readonly scriptTab: Locator;
  7  |   readonly visualsTab: Locator;
  8  |   readonly canvas: Locator;
  9  |   readonly timeline: Locator;
  10 |   readonly scriptEditor: Locator;
  11 |   readonly aiModifyButton: Locator;
  12 |   readonly promptInput: Locator;
  13 |   readonly rewriteButton: Locator;
  14 |   readonly unselectedTile: Locator;
  15 |   readonly keepChangesButton: Locator;
  16 | 
  17 |   constructor(page: Page) {
  18 |     this.page = page;
  19 | 
  20 |     this.scriptTab = page.getByRole('tab', { name: 'Script' });
  21 |     this.visualsTab = page.getByRole('tab', { name: 'Visuals' });
  22 |     this.canvas = page.locator('canvas').first();
  23 |     this.timeline = page.locator('[class*="timelineScrollbar"]');
  24 |     this.scriptEditor = page.locator('[data-slate-editor="true"]').first();
  25 | 
  26 |     this.aiModifyButton = page
  27 |       .locator('button:has-text("Modify Script"), button.text-blue-750')
  28 |       .first();
  29 | 
  30 |     this.promptInput = page.getByPlaceholder(/Make it more conversational/i);
  31 |     this.rewriteButton = page.getByRole('button', { name: 'Rewrite script' });
  32 | 
  33 |     this.unselectedTile = page
  34 |       .locator('.grid span')
  35 |       .filter({ hasNot: page.locator('svg') })
  36 |       .locator('img')
  37 |       .first();
  38 | 
  39 |     this.keepChangesButton = page.getByRole('button', {
  40 |       name: 'Keep changes',
  41 |     });
  42 |   }
  43 | 
  44 | 
  45 |   async verifyEditorLoaded() {
  46 |     await this.scriptTab.waitFor({ state: 'visible' });
> 47 |     await this.canvas.waitFor({ state: 'visible' });
     |                       ^ Error: locator.waitFor: Test timeout of 30000ms exceeded.
  48 |     await this.timeline.waitFor({ state: 'visible' });
  49 |   }
  50 | 
  51 |   async modifyScriptWithAI(promptText: string) {
  52 |     await this.aiModifyButton.click();
  53 |     await this.promptInput.fill(promptText);
  54 |     await this.rewriteButton.click();
  55 |   }
  56 | 
  57 | async keepChangesAfterModification() {
  58 |   await this.keepChangesButton.click();
  59 | }
  60 |   async changeBackgroundVisual() {
  61 |     const beforeImage = await this.canvas.screenshot();
  62 |     await this.unselectedTile.click();
  63 |     
  64 |     // Explicit wait for canvas frame buffer update or animation frame
  65 |     await this.page.evaluate(() => new Promise((resolve) => requestAnimationFrame(resolve)));
  66 |     
  67 |     const afterImage = await this.canvas.screenshot();
  68 |     return { beforeImage, afterImage };
  69 |   }
  70 | }
  71 | 
```