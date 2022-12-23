import {Browser, Page} from "puppeteer";
import puppeteer from "puppeteer";

(async () => {
    let etoroUrlArr = [
        'https://www.etoro.com/markets/btc/chart',
        'https://www.etoro.com/markets/eth/chart',
        'https://www.etoro.com/markets/xrp/chart',
    ];

    // Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
    const browser = await setUpWebBrowser();

    // Use Promise.all to make the loop async
    await Promise.all(
        etoroUrlArr.map(async (etoroUrl) => {
            const page = await browser.newPage();
            await navigateToUrl(etoroUrl, page);

            // Find all divs with class price
            const priceDivs = await page.$$('div.etoro-price-value');

            // Extract the text content of the span elements
            while(true) {
                const prices = await Promise.all(
                    priceDivs.map(async (div) => {
                        const spanText = await page.evaluate((element) => {
                            const span = element.querySelector('span[automation-id="buy-sell-button-rate-value"]');
                            return span ? span.textContent : null;
                        }, div);

                        return spanText;
                    }),
                );

                //console log the url and the price
                console.log(etoroUrl, prices);

                await page.waitForTimeout(1000);
            }
        }),
    );

    await browser.close();
})();
async function setUpWebBrowser(): Promise<Browser> {
    const StealthPlugin = require('puppeteer-extra-plugin-stealth');
    let puppeteer = require('puppeteer-extra');
    puppeteer.use(StealthPlugin());
    const browser = await puppeteer.launch({
        headless: true,
    });
    return browser;
}
async function navigateToUrl(etoroUrl: string, page: Page) {
    console.log('Navigating to ' + etoroUrl);
    await page.goto(etoroUrl);
    console.log('wait for 1 second');
    await page.waitForTimeout(1000);
    console.log('wait for selector on the page');
}
