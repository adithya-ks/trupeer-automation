import { test, expect } from '@playwright/test';
import { LoginPage } from '../part2/page-objects/LoginPage';
import { LibraryPage } from '../part2/page-objects/LibraryPage';
import { EditorPage } from '../part2/page-objects/EditorPage';
import { judge } from './judge';

const PROMPTS = [
  'Make this more professional',
  'Translate to malayalam',
  'Add a call to action at the end',
  'Translate to Spanish',
  'Make this script more concise',
];

const THRESHOLD = 0.8;

test('AI script modification validation', async ({ page }) => {
  const email = process.env.TRUPEER_EMAIL!;
  const password = process.env.TRUPEER_PASSWORD!;

  const loginPage = new LoginPage(page);
  await loginPage.navigate();
  await loginPage.login(email, password);
  await loginPage.dismissWelcomeDialogIfPresent();

  const libraryPage = new LibraryPage(page);
  await libraryPage.navigateToLibrary();
  await libraryPage.openFirstVideo();

  const editorPage = new EditorPage(page);
  await editorPage.verifyEditorLoaded();

  const baseline = (await editorPage.scriptEditor.innerText()).trim();
  let current = baseline;
  const failures: string[] = [];

  for (const prompt of PROMPTS) {
    await editorPage.modifyScriptWithAI(prompt);
    await editorPage.keepChangesAfterModification()
    await expect(editorPage.scriptEditor).not.toHaveText(current, { timeout: 90_000 });
    const modified = (await editorPage.scriptEditor.innerText()).trim();
    current = modified;

    const verdict = await judge(baseline, prompt, modified);
    const passed = Object.values(verdict).every((c: any) => c.pass);
    const minConf = Math.min(...Object.values(verdict).map((c: any) => c.confidence));

    console.log(`\n[${passed ? 'PASS' : 'FAIL'}] "${prompt}"${minConf < THRESHOLD ? '  ⚠ low confidence' : ''}`);
    for (const [id, c] of Object.entries(verdict) as any) {
      console.log(`   ${c.pass ? '✓' : '✗'} ${id.padEnd(17)} ${c.confidence.toFixed(2)}  ${c.reason}`);
    }

    if (!passed && minConf >= THRESHOLD) failures.push(prompt);
  }

  expect(failures, `High-confidence failures: ${failures.join(', ')}`).toHaveLength(0);
});
