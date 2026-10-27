import { Page } from 'playwright';

export async function openAccount(page: Page) {
  await page.getByRole('button', { name: 'Profil', exact: true }).click();
  await page.getByRole('button', { name: 'Gérer mon compte', exact: true }).click();
}

export async function openSettings(page: Page) {
  const current = (await page.locator('nav button[aria-current="page"]').textContent())?.trim() || 'Accueil';
  await page.getByRole('button', { name: 'Profil', exact: true }).click();
  await page.getByRole('button', { name: 'Réglages', exact: true }).click();
  await page.getByRole('dialog', { name: 'Réglages', exact: true }).waitFor();
  return current;
}

export async function closeSettings(page: Page, returnTo = 'Profil') {
  await page.getByRole('button', { name: 'Fermer les réglages', exact: true }).click();
  await page.getByRole('button', { name: returnTo, exact: true }).click();
}

export async function toggleTheme(page: Page) {
  const returnTo = await openSettings(page);
  const button = page.getByRole('button', { name: 'Mode sombre', exact: true });
  await button.click();
  const state = await button.getAttribute('aria-pressed');
  await closeSettings(page, returnTo);
  return state;
}
