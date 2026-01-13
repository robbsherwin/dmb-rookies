import { test, expect } from '@playwright/test';
import { RookiePage } from './pages/rookiePage';
import { getRookiePlayers } from './readRookies.js';

// NOTES! For each year, need to change references from 2025 to 2026 and such. 
// As of 2026, b-ref.com was aware of ad blockers. 

test('test', { timeout: 10 * 60 * 1000 }, async ({ page }) => {

    const rookiePage = new RookiePage;

    // Read player names from rookies.txt file (one per line)
    const playerArray = await getRookiePlayers();


    const veterans = [""];
    const rookies = [""];
    const couldNotDetermine = [""];
    let cantFindPlayer = false;
    const currentYear = String(new Date().getFullYear());


    for (var x = 0; x < playerArray.length; x++) {
        cantFindPlayer = false;
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

        let regex = new RegExp(`-?2025 ${playerArray[x]}`);

        await page.waitForTimeout(500);
        let nameExactlyVisible = await page.getByText(regex).isVisible();
        await page.waitForTimeout(500);

        // If the name is exactly there, then click on it. 
        if (nameExactlyVisible) {
            cantFindPlayer = false;
            console.log("Name was exactly visible");
            await page.getByText(regex).click();
        }
        else {
            let textWeDoHave = await page.locator('form[name="f_big"]').textContent(); // Take the contents of the first text we have. 
            let trimmedSpacesFromStart = textWeDoHave.trimStart()

            let removedEverythingBeforeYear = await rookiePage.removeBeforeAndIncluding2025(trimmedSpacesFromStart);

            let removeEndOfString = await rookiePage.removeFromAllMatches(removedEverythingBeforeYear);

            let normalizedText = await rookiePage.removeAccents(removeEndOfString);
            console.log("Normalized for accents:" + normalizedText);

            if (normalizedText.includes(playerArray[x])) {
                // proceed
                console.log(normalizedText + " contains " + playerArray[x]);
                cantFindPlayer = false; // We found them
                //console.log("normalizedText:" + normalizedText);
                //await page.getByText('-2024 José Abreu').click();
                regex = new RegExp(`-?2025 ${removeEndOfString}`);
                await page.getByText(regex).click();

            }
            else {
                cantFindPlayer = true;
                console.log(normalizedText + " was not equal to " + playerArray[x]);
            }
        }

        if (cantFindPlayer == true) {
            couldNotDetermine.push(playerArray[x]);
        }
        else {

            await page.waitForTimeout(1000);

            // Check for ad blocker detection and click to dismiss if present
            const adBlockerDetected = await page.getByText('Looks like your ad blocker is on.').isVisible();
            if (adBlockerDetected) {
                console.log("Ad blocker detected and clicked to dismiss");
                await page.locator('xpath=/html/body/div[7]/div/div/span').click();
                await page.waitForTimeout(500);
            }
            else {
                console.log("No ad blocker pop-updetected");
            }

            const bioUniformDraft = await page.getByRole('button', { name: 'More bio, uniform, draft,' }).isVisible();

            if (bioUniformDraft) {
                await page.getByRole('button', { name: 'More bio, uniform, draft,' }).click();
            }

            await rookiePage.clickOnPopup(page);
            await page.waitForTimeout(500);

            const rookieStatusExceeded = await page.getByText('Exceeded rookie limits').isVisible();

            if (rookieStatusExceeded) {
                console.log(playerArray[x] + ": rookie status exceeded");
                veterans.push(playerArray[x]);
            }
            else {
                console.log(playerArray[x] + ": rookie status NOT exceeded");
            }

            const stillIntact = await page.getByText('Rookie Status: Still Intact through').isVisible();

            if (stillIntact) {
                console.log(playerArray[x] + ": rookie status still intact!");
                rookies.push(playerArray[x]);
            }

            await page.waitForTimeout(3000);
        }
    }

    console.log("--------")
    console.log("VETERANS");
    for (x = 0; x < veterans.length; x++) {
        console.log(veterans[x]);
    }
    console.log("--------")

    console.log("--------")
    console.log("ROOKIES");
    for (x = 0; x < rookies.length; x++) {
        console.log(rookies[x]);
    }

    console.log("--------")
    console.log("COULD NOT DETERMINE");
    for (x = 0; x < couldNotDetermine.length; x++) {
        console.log(couldNotDetermine[x]);
    }
    console.log("--------")

});