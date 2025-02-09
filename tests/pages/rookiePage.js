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
}