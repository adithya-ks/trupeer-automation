import { Page, expect } from '@playwright/test';

export class LibraryPage {
  readonly page: Page;

  // 1. Define Selectors
  readonly libraryNavButton;
  readonly videoRow;

  constructor(page: Page) {
    this.page = page;
    
    // Initialize Selectors
    this.libraryNavButton = page.locator('#trupeer-nav-library');
    this.videoRow = page.locator('[data-userflow-id="trupeer-library-row"]');
  }

  // 2. Define Actions (Methods)

  /**
   * Navigates to the library tab from the sidebar/navbar.
   */
  async navigateToLibrary() {
    await this.libraryNavButton.click();
    
    // Wait for the library rows to actually load in the DOM before proceeding
    await this.videoRow.first().waitFor({ state: 'visible' });
  }

  /**
   * Clicks the first video in the library and verifies it loads the editor.
   */
  async openFirstVideo() {
    await this.videoRow.first().click();
    
    // Verify we successfully navigated to the editor
    await expect(this.page, 'Expected URL to contain /video/edit after clicking a video card')
      .toHaveURL(/\/video\/edit/);
  }
}
