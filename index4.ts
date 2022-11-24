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
    await page.goto('https://etoro.com/login');
    // await page.screenshot({ path: 'example.png' });
    await page.waitForTimeout(1000);
    const email = 'insertyourown@email.com';
    const password = 'insertyourownpassword';
    console.log(`Typing the email: `);
    await page.type('input[automation-id="login-sts-username-input"]', email, {
        delay: 25
    });
    console.log(`Typing the password: `);
    await page.type('input[automation-id="login-sts-password-input"]', password, {
        delay: 25,
    });
    console.log('wait for .5 seconds before finding the login button');
    await page.waitForTimeout(1000);
    console.log('click the login button');
    await page.click('button[automation-id="login-sts-btn-sign-in"]');
    // await browser.close();
    // const puppeteer = require('puppeteer');
    //
    // const browser = await puppeteer.launch({
    //     args: [
    //         '--disable-web-security',
    //     ],
    //     headless: false
    // });
    // const StealthPlugin = require('puppeteer-extra-plugin-stealth')
    // puppeteer.use(StealthPlugin())
//     const page = await browser.newPage();
// //
//     let etoroUrl = 'https://www.etoro.com/markets/oil';
//
//     await page.goto(etoroUrl);
//     // await page.waitForTimeout(1000);
//     // await page.waitForSelector('et-instrument-trading-row');
//     // const divs = await page.$$eval('div', divs => divs);
//     //print innter html of all divs
//     //go over all divs and find the one with the price
//     const spanTexts = await page.$$eval('div', )
//     // const searchValue = await page.$eval('#search', el => el.value);
//     console.log(spanTexts)
//
//     // console.log('divsCounts', divsCounts);
//
//     //get the price of the oil
//     //get the inner text of span with id market-head-stats-value
//     let spanElement;
//
//     spanElement = await page.$$('span');
//     spanElement = spanElement.pop();
//     spanElement = await spanElement.getProperty('innerText');
//     spanElement = await spanElement.jsonValue();
//
//     // const price = await page.$eval('span', '#market-head-stats-value', el => el.innerText);
//     // console.log('price', price);
//     //select div with id market-head-stats-value
//     // const marketHeadStatsValue = await page.$eval('market-head-stats-value', div => div.textContent);
//     // console.log(marketHeadStatsValue);
//     // const spanTexts = await page.$$eval('market-head-stats-value', elements => elements.map(el => el.innerText))
//     // console.log(spanTexts)
//     // await page.goto("https://www.etoro.com/markets/oil");
//     // await page.waitForTimeout(2000);
//     // await page.screenshot({ path: 'example.png' });
//     // await page.$eval("input[name=email]", (el, value) => el.value = value, creds.email);
//     // await page.$eval("input[name=password]", (el, value) => el.value = value, creds.password);
//     // await Promise.all([
//     //     page.$eval("input[type=submit]", elem => elem.click()),
//     //     page.waitForNavigation({ waitUntil: 'networkidle0' }),
//     // ]);
//     //
//     //get the price of the oil
//
//     //print the price out
//     await browser.close();
})();
