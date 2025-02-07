import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://www.baseball-reference.com/');
  await page.getByRole('button', { name: 'Close this dialog' }).click();
  await page.getByRole('searchbox', { name: 'Enter a player, team or' }).click();
  await page.getByRole('searchbox', { name: 'Enter a player, team or' }).fill('shane baz');
  await page.getByText('-2024 Shane Baz').click();
  await page.getByRole('button', { name: 'More bio, uniform, draft,' }).click();
  await page.getByText('Rookie Status: Still Intact through').click();
  await page.getByRole('searchbox', { name: 'Enter a player, team or' }).click();
  await page.getByRole('searchbox', { name: 'Enter a player, team or' }).fill('nolan jones');
  await page.getByText('Nolan', { exact: true }).click();
  await page.getByText('Rookie Status: Exceeded').click();
  await page.getByRole('searchbox', { name: 'Enter a player, team or' }).click();
  await page.getByRole('searchbox', { name: 'Enter a player, team or' }).fill('luis garcia');
  await page.getByText('2013-2024 Luis García').click();
  await page.getByRole('link', { name: 'Luis García (2013-2024)' }).click();
  await page.getByLabel('Close in-page popup window').click();
  await page.getByText('Rookie Status: Exceeded').click();
});