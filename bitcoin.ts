// @ts-ignore
import {Page} from "puppeteer";
let puppeteer = require('puppeteer-extra');


//https://medium.com/@ajay_613/i-scrapped-30-000-stocks-from-etoro-heres-how-1f26608084a
(async () => {

// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
    const page = await set_up_web_browser();
    let etoroUrl = 'https://www.etoro.com/markets/btc';
    await navigate_to_url(etoroUrl, page);

    //find all divs with class price
    const priceDivs = await page.$$('span.instrument-price');
    //print all information about priceDivs
    //filter span with class price
    console.log('priceDivs', priceDivs);
    //for all element hanlde output the text
    for (let i = 0; i < priceDivs.length; i++) {
        const priceDiv = priceDivs[i];
        while (true) {
            const price = await page.evaluate(priceDiv => priceDiv.textContent, priceDiv);
            console.log(price);
            //sleep 1 second
            await page.waitForTimeout(1000);
        }
    }

    //
    // //puppet select by div with class price
    // await page.waitForSelector('.price')
    //     .then(() => console.log('Found the price'))
    // //input the inner html of price
    //     .then(() => page.$eval('.price ', el => el.innerHTML))
    //     .then((html) => console.log(html));
    //
    //
    // await page.waitForSelector('et-instrument-trading-row');
    // const instrumentTradingRows = await page.$$eval('et-instrument-trading-row', (rows) => {
    //     console.log('rows', rows[0], rows[1]);
    // });
})();

async function set_up_web_browser() {
    const StealthPlugin = require('puppeteer-extra-plugin-stealth')
    puppeteer.use(StealthPlugin())
    const browser = await puppeteer.launch({
        headless: false,
    });
    const page = await browser.newPage();
    await page.waitForTimeout(5000);
    return page;
}

async function navigate_to_url(etoroUrl: string, page: Page) {
    console.log('Navigating to ' + etoroUrl);
    await page.goto(etoroUrl);
    console.log('wait for 1 second');
    await page.waitForTimeout(1000);
    console.log('wait for selector on the page');
}
