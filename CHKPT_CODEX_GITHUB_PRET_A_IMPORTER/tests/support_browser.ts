import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';

export async function checkSupport() {
  const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined });
  try {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, offline: true });
    const page = await context.newPage();
    // Managed Chromium blocks file:// navigation. Render the exact standalone file offline.
    await page.setContent(await readFile(new URL('../docs/DEMO_SECOURS.html', import.meta.url), 'utf8'));
    await page.waitForFunction(() => [...document.images].every(image => image.complete && image.naturalWidth > 0));
    assert.equal(await page.locator('section').count(), 4);
    assert.equal(await page.locator('img').count(), 4);
    await page.getByText('Captures du prototype, pas une session en direct').waitFor();
    await page.getByRole('link', { name: 'Étape suivante →' }).first().click();
    assert.match(page.url(), /#etape-2$/);
    await context.close();
  } finally { await browser.close(); }
}
