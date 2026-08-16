import { test, expect } from '@playwright/test';
import { LoginPage } from '../page-objects/LoginPage';
import { LibraryPage } from '../page-objects/LibraryPage';
import { EditorPage } from '../page-objects/EditorPage';

test.describe('Trupeer E2E User Flows', () => {
  let loginPage: LoginPage;
  let libraryPage: LibraryPage;
  let editorPage: EditorPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    libraryPage = new LibraryPage(page);
    editorPage = new EditorPage(page);

    const email = process.env.TRUPEER_EMAIL;
    const password = process.env.TRUPEER_PASSWORD;
    if (!email || !password) {
      throw new Error('Missing TRUPEER_EMAIL or TRUPEER_PASSWORD in environment variables.');
    }

    await loginPage.navigate();
    await loginPage.login(email, password);
    await loginPage.dismissWelcomeDialogIfPresent();
  });

  test('1. Login lands on dashboard', async ({ page }) => {
  await expect(page, 'Expected to leave /login after successful login').not.toHaveURL(/\/login/);
 //   await expect(page, 'User should land on the dashboard after login')
      //.toHaveURL(/.*dashboard/, { timeout: 10000 });
    // or, if there's no URL signal: assert a dashboard-only element is visible
  });

  test('2. Editor loads with key elements', async () => {
    await libraryPage.navigateToLibrary();
    await libraryPage.openFirstVideo();
    await editorPage.verifyEditorLoaded(); // should itself assert timeline, preview, script panel visible
  });

  test('3. Modify Script with AI returns a changed script', async () => {
    await libraryPage.navigateToLibrary();
    await libraryPage.openFirstVideo();
    await editorPage.verifyEditorLoaded();

    const originalScript = await editorPage.scriptEditor.innerText();
    await editorPage.modifyScriptWithAI('Make this script more concise');
    console.log("Keep Changes button about to be clicked")
    await editorPage.keepChangesAfterModification()
    console.log("Keep Changes Button Clicked ")
    await expect(editorPage.scriptEditor, 'Script content should change after AI modification')
      .not.toHaveText(originalScript, { timeout: 30000 });
  });

  test('3b. [Negative] Empty prompt to Modify Script with AI does not alter script', async () => {
    await libraryPage.navigateToLibrary();
    await libraryPage.openFirstVideo();
    await editorPage.verifyEditorLoaded();

    const originalScript = await editorPage.scriptEditor.innerText();
    await editorPage.modifyScriptWithAI(''); // empty prompt

    // Adjust to whatever the actual product does: button disabled, toast error, or no-op
    await expect(editorPage.scriptEditor, 'Script should remain unchanged when prompt is empty')
      .toHaveText(originalScript);
  });

  test('4. Editor interaction: background change applies correctly', async () => {
    await libraryPage.navigateToLibrary();
    await libraryPage.openFirstVideo();
    await editorPage.verifyEditorLoaded();

    await editorPage.visualsTab.click();
    const { beforeImage, afterImage } = await editorPage.changeBackgroundVisual();
    expect(beforeImage, 'Canvas background should update after tile selection').not.toEqual(afterImage);
  });
});
