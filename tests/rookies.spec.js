import { test, expect } from '@playwright/test';
import { RookiePage } from './pages/rookiePage';

test('test', { timeout: 10 * 60 * 1000 }, async ({ page }) => {

    const rookiePage = new RookiePage;

    const playerArray = ["Nolan Jones", "Shane Baz", "Paul Skenes", "Kameron Misner"]

    for (var x = 0; x < playerArray.length; x++) {
        await page.goto('https://www.baseball-reference.com/');

        await rookiePage.clickOnPopup(page);
        const firstInterstertial = await page.getByRole('button', { name: 'Close this dialog' }).isVisible();
        await page.waitForTimeout(500);

        if (firstInterstertial) {
            await page.getByRole('button', { name: 'Close this dialog' }).click();
        }

        await rookiePage.clickOnPopup(page);

        await page.getByRole('searchbox', { name: 'Enter a player, team or' }).click();
        await page.waitForTimeout(500);

        await rookiePage.clickOnPopup(page);

        await page.getByRole('searchbox', { name: 'Enter a player, team or' }).fill(playerArray[x]);
        await page.waitForTimeout(500);

        await rookiePage.clickOnPopup(page);

        const regex = new RegExp(`-?2024 ${playerArray[x]}`);
        await page.getByText(regex).click();
        
        await page.waitForTimeout(500);

        const bioUniformDraft = await page.getByRole('button', { name: 'More bio, uniform, draft,' }).isVisible();

        if (bioUniformDraft) {
            await page.getByRole('button', { name: 'More bio, uniform, draft,' }).click();
        }

        await rookiePage.clickOnPopup(page);
        await page.waitForTimeout(500);
        const rookieStatusExceeded = await page.getByText('Rookie Status: Exceeded').isVisible();

        if (rookieStatusExceeded) {
            console.log(playerArray[x] + ": rookie status exceeded");
        }
        else {
            console.log(playerArray[x] + ": rookie status NOT exceeded");
        }

        const stillIntact = await page.getByText('Rookie Status: Still Intact through').isVisible();

        if (stillIntact) {
            console.log(playerArray[x] + ": rookie status still intact!");
        }

        await page.waitForTimeout(3000);
    }
});



//   await page.goto('https://www.baseball-reference.com/');
//   await page.getByRole('button', { name: 'Close this dialog' }).click();
//   await page.getByRole('searchbox', { name: 'Enter a player, team or' }).click();
//   await page.getByRole('searchbox', { name: 'Enter a player, team or' }).fill('shane baz');
//   await page.getByText('-2024 Shane Baz').click();

//   await page.getByRole('button', { name: 'More bio, uniform, draft,' }).click();
//   await page.getByText('Rookie Status: Still Intact through').click();
//   await page.getByRole('searchbox', { name: 'Enter a player, team or' }).click();
//   await page.getByRole('searchbox', { name: 'Enter a player, team or' }).fill('nolan jones');
//   await page.getByText('Nolan', { exact: true }).click();
//   await page.getByText('Rookie Status: Exceeded').click();
//   await page.getByRole('searchbox', { name: 'Enter a player, team or' }).click();
//   await page.getByRole('searchbox', { name: 'Enter a player, team or' }).fill('luis garcia');
//   await page.getByText('2013-2024 Luis García').click();
//   await page.getByRole('link', { name: 'Luis García (2013-2024)' }).click();
//   await page.getByLabel('Close in-page popup window').click();
//   await page.getByText('Rookie Status: Exceeded').click();