import { Page, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  // 1. Define Selectors
  readonly emailInput;
  readonly passwordInput;
  readonly continueButton;
  readonly dialog;
  readonly dialogCloseButton;

  constructor(page: Page) {
    this.page = page;
    
    // Initialize Selectors
    this.emailInput = page.locator('#email');
    this.passwordInput = page.locator('#password');
    this.continueButton = page.getByRole('button', { name: 'Continue', exact: true });
    this.dialog = page.getByRole('dialog');
    this.dialogCloseButton = this.dialog.getByRole('button', { name: 'Close' });
  }

  // 2. Define Actions (Methods)
  
  /**
   * Navigates to the login page and waits for it to load.
   */
  async navigate() {
    await this.page.goto('https://app.trupeer.ai/auth?tab=login');
    await this.page.waitForTimeout(2000);
    // Replaces the `await page.waitForTimeout(2000);` from your original script
    // Waits for the email input to be visible before proceeding
    await this.emailInput.waitFor({ state: 'visible' }); 
  }

  /**
   * Fills in credentials, submits, and verifies the URL changes.
   */
  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.continueButton.click();

    // Verify successful login by checking the URL
    await expect(this.page, 'Expected to leave /login after successful login').not.toHaveURL(/\/login/);
  }
async dismissWelcomeDialogIfPresent() {
    const dialogAppeared = await this.dialog
      .waitFor({ state: 'visible', timeout: 18_000 })
      .then(() => true)
      .catch(() => false);

    if (dialogAppeared) {
      // this.dialogCloseButton is defined as: this.dialog.getByRole('button', { name: 'Close' })
      await this.dialogCloseButton.first().click();
      
      // Added this line to make sure it's fully closed before moving on
      await this.dialog.waitFor({ state: 'hidden' }); 
    }
  }
}
