// @ts-ignore
let puppeteer = require('puppeteer-extra');
//https://medium.com/@ajay_613/i-scrapped-30-000-stocks-from-etoro-heres-how-1f26608084a
(async () => {
    const StealthPlugin = require('puppeteer-extra-plugin-stealth')
    puppeteer.use(StealthPlugin())
    const browser = await puppeteer.launch({
        headless: false,
    });
    const page = await browser.newPage();

    await page.goto('https://etoro.com/login');

    let etoroUrl = '<https://www.etoro.com/discover/markets/stocks/industry/technology>';
    console.log('Navigating to ' + etoroUrl);
    await page.goto(etoroUrl);
    console.log('wait for 1 second');
    await page.waitForTimeout(1000);
    console.log('wait for selector on the page');
    await page.waitForSelector('et-instrument-trading-row');
    const instrumentTradingRows = await page.$$eval('et-instrument-trading-row', (rows) => {
        console.log('rows', rows[0], rows[1]);
    });
});