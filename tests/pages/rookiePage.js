// pages/LoginPage.js
import { expect } from '@playwright/test';

export class RookiePage {
    constructor(page) {
        this.page = page;
    }

    async clickOnPopup(page) {
        const popUpAppearance = await page.getByLabel('Close in-page popup window').isVisible();
        if (popUpAppearance) {
            await page.getByLabel('Close in-page popup window').click();
            await page.waitForTimeout(500);
        }

        const hideThisAppearance = await page.getByRole('link', { name: 'Hide This' }).isVisible();
        if (hideThisAppearance) {
            page.getByRole('link', { name: 'Hide This' }).click();
            await page.waitForTimeout(500);
        }
    }

    async removeAccents(stringToNormalize) {
        return stringToNormalize.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    async removeBeforeAndIncluding2024(str) {
        return str.replace(/^.*2024/, "").trim();
      }



      async removeFromAllMatches(str) {
        return str.replace(/All matches.*/, "").trim();
      }



    async createAccentInsensitiveRegex(input) {
        // const accentMap = {
        //     'a': '[aàáâãäåā]',
        //     'e': '[eèéêëē]',
        //     'i': '[iìíîïī]',
        //     'o': '[oòóôõöō]',
        //     'u': '[uùúûüū]',
        //     'n': '[nñ]'
        // }

        const accentMap = {
            'e': '[eé]',
        }

        // Replace each letter in the input with its regex equivalent if available
        const regexPattern = input.split('').map(char => accentMap[char.toLowerCase()] || char).join('');

        return new RegExp(`^${regexPattern}$`, 'i'); // Case-insensitive full match
    }
}