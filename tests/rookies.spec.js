import { test, expect } from '@playwright/test';
import { RookiePage } from './pages/rookiePage';

test('test', { timeout: 10 * 60 * 1000 }, async ({ page }) => {

    const rookiePage = new RookiePage;

    //const playerArray = ["Nolan Jones", "Shane Baz", "Paul Skenes", "Kameron Misner"]
    const playerArray = ["Jose Abreu", "Nolan Jones", "Shane Baz"];
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
        
        let regex = new RegExp(`-?2024 ${playerArray[x]}`);

        await page.waitForTimeout(500);
        let nameExactlyVisible = await page.getByText(regex).isVisible();

        // If the name is exactly there, then click on it. 
        if (nameExactlyVisible) {
            cantFindPlayer = false;
            console.log("Name was exactly visible");
            await page.getByText(regex).click();
        }
        else {
            let textWeDoHave = await page.locator('form[name="f_big"]').textContent(); // Take the contents of the first text we have. 
            let trimmedSpacesFromStart = textWeDoHave.trimStart()

            let removedEverythingBeforeYear = await rookiePage.removeBeforeAndIncluding2024(trimmedSpacesFromStart);

            let removeEndOfString = await rookiePage.removeFromAllMatches(removedEverythingBeforeYear);

            let normalizedText = await rookiePage.removeAccents(removeEndOfString);
            console.log("Normalized for accents:" + normalizedText);

            if (normalizedText.includes(playerArray[x])) {
                // proceed
                console.log(normalizedText + " contains " + playerArray[x]);
                cantFindPlayer = false; // We found them
                //console.log("normalizedText:" + normalizedText);
                //await page.getByText('-2024 José Abreu').click();
                regex = new RegExp(`-?2024 ${removeEndOfString}`);
                await page.getByText(regex).click();

            }
            else {
                cantFindPlayer = true;
                console.log(normalizedText + " was not equal to " + playerArray[x]);
            }
        }        
        
        if (cantFindPlayer == true)
        {
            couldNotDetermine.push(playerArray[x]);
        }
        else {        
        
        await page.waitForTimeout(1000);

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
    for(x=0; x<veterans.length; x++)
    {
        console.log(veterans[x]);
    }
    console.log("--------")

    console.log("--------")
    console.log("ROOKIES");
    for(x=0; x<rookies.length; x++)
    {
        console.log(rookies[x]);
    }

    console.log("--------")
    console.log("COULD NOT DETERMINE");
    for(x=0; x<couldNotDetermine.length; x++)
    {
        console.log(couldNotDetermine[x]);
    }
    console.log("--------")

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