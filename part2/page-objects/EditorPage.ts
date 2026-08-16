
import { Page, Locator } from '@playwright/test';

export class EditorPage {
  readonly page: Page;
  readonly scriptTab: Locator;
  readonly visualsTab: Locator;
  readonly canvas: Locator;
  readonly timeline: Locator;
  readonly scriptEditor: Locator;
  readonly aiModifyButton: Locator;
  readonly promptInput: Locator;
  readonly rewriteButton: Locator;
  readonly unselectedTile: Locator;
  readonly keepChangesButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.scriptTab = page.getByRole('tab', { name: 'Script' });
    this.visualsTab = page.getByRole('tab', { name: 'Visuals' });
    this.canvas = page.locator('canvas').first();
    this.timeline = page.locator('[class*="timelineScrollbar"]');
    this.scriptEditor = page.locator('[data-slate-editor="true"]').first();

    this.aiModifyButton = page
      .locator('button:has-text("Modify Script"), button.text-blue-750')
      .first();

    this.promptInput = page.getByPlaceholder(/Make it more conversational/i);
    this.rewriteButton = page.getByRole('button', { name: 'Rewrite script' });

    this.unselectedTile = page
      .locator('.grid span')
      .filter({ hasNot: page.locator('svg') })
      .locator('img')
      .first();

    this.keepChangesButton = page.getByRole('button', {
      name: 'Keep changes',
    });
  }


  async verifyEditorLoaded() {
    await this.scriptTab.waitFor({ state: 'visible' });
    await this.canvas.waitFor({ state: 'visible' });
    await this.timeline.waitFor({ state: 'visible' });
  }

  async modifyScriptWithAI(promptText: string) {
    await this.aiModifyButton.click();
    await this.promptInput.fill(promptText);
    await this.rewriteButton.click();
  }

async keepChangesAfterModification() {
  await this.keepChangesButton.click();
}
  async changeBackgroundVisual() {
    const beforeImage = await this.canvas.screenshot();
    await this.unselectedTile.click();
    
    // Explicit wait for canvas frame buffer update or animation frame
    await this.page.evaluate(() => new Promise((resolve) => requestAnimationFrame(resolve)));
    
    const afterImage = await this.canvas.screenshot();
    return { beforeImage, afterImage };
  }
}
