// @ts-ignore
let puppeteer = require('puppeteer-extra');
//https://medium.com/@ajay_613/i-scrapped-30-000-stocks-from-etoro-heres-how-1f26608084a
(async () => {
    // Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
    const StealthPlugin = require('puppeteer-extra-plugin-stealth')
    puppeteer.use(StealthPlugin())
    const browser = await puppeteer.launch({
        headless: false,
    });
    const page = await browser.newPage();
    await page.waitForTimeout(5000);
    let etoroUrl = 'https://www.etoro.com/discover/markets/stocks/industry/technology';
    console.log('Navigating to ' + etoroUrl);
    await page.goto(etoroUrl);
    console.log('wait for 1 second');
    await page.waitForTimeout(1000);
    console.log('wait for selector on the page');

    async function get_price() {
        const priceDivs = await page.$$('div.price');
        console.log('priceDivs', priceDivs);
        //for all element hanlde output the text
        for (let i = 0; i < priceDivs.length; i++) {
            const priceDiv = priceDivs[i];
            const price = await page.evaluate(priceDiv => priceDiv.textContent, priceDiv);
            console.log('price', price);
        }
    }

//find all divs with class price
    while(true) {
        await get_price();
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