import {Browser, Page} from "puppeteer";
import {PrismaClient} from '@prisma/client'

async function get_the_div_with_price(browser: Browser, etoroUrl: string) {
    const page = await browser.newPage();
    await navigateToUrl(etoroUrl, page);
    // Find all divs with class price
    const priceDivs = await page.$$('div.etoro-price-value');
    return {page, priceDivs};
}

// concatinate_e_toro_url_and_stocks(etorourl, precious_metal)
function concatinate_e_toro_url_and_stocks(stock: string[]) {
    let etoroUrl = 'https://www.etoro.com/markets/';
    const chart = '/chart';
    return stock.map(metal => etoroUrl + metal + chart);
}

enum assetType
{
    precious_metal,
        raw_material,
        grow,
        value,
        bond,
        reit,
        crypto
}
class Details {
    name: string;
    assetType: assetType;
    exchange: string;

    //construct the detail object default for string = "" and enum = 0
    constructor(name: string = "", assetType: assetType = 0, exchange: string = "") {
        this.name = name;
        this.assetType = assetType;
        this.exchange = exchange;
    }

}

//
class Stock {
    symbol: string;
    detail: Details;
    url: string;
    buy: number;
    sell: number;

    //construct the stock object default for string = "" and enum = 0
    constructor(symbol: string = "", detail: Details = new Details(), url: string = "", buy: number = 0, sell: number = 0) {
        this.symbol = symbol;
        this.detail = detail;
        this.url = this.generate_url();
        this.buy = buy;
        this.sell = sell;
    }

    generate_url() {
        let etoroUrl = 'https://www.etoro.com/markets/';
        const chart = '/chart';
        return etoroUrl + this.symbol + chart;
    }

}


function get_URL() {
    function precius_metal_shorts() {
        const gold = ['phys', 'gdxj'];
        const silver = ['pslv', 'sbsw'];
        const platinum = ['pall', 'pall'];
        const precious_metal = gold.concat(silver, platinum);
        return precious_metal;
    }

    let precious_metal = precius_metal_shorts();
    let precious_metal_URL = concatinate_e_toro_url_and_stocks(precious_metal);
    return precious_metal_URL;
}


(async () => {

    function generate_gold() {
        let gold: Stock [] = [];
        let phys: Stock = new Stock ( 'PHYS',
            new Details( '', assetType.precious_metal )
        );
        let gdxj: Stock = new Stock ( 'GDXJ',
            new Details( '', assetType.precious_metal)
        );
        gold.push(phys, gdxj);
        return gold;
    }

    let gold: Stock[] =  generate_gold();


    let etoroUrlArr = get_URL();

    // Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
    const browser = await setUpWebBrowser();
    const prisma = new PrismaClient()

    // Use Promise.all to make the loop async
    await Promise.all(
        etoroUrlArr.map(async (etoroUrl) => {
            const {page, priceDivs} = await get_the_div_with_price(browser, etoroUrl);

            function convert_to_float(prices: any) {
                return prices.map((price) => parseFloat(price));
            }

            async function get_price() {
                const buy_sell_string = await Promise.all(
                    priceDivs.map(async (div) => {
                        const spanText = await page.evaluate((element) => {
                            const span = element.querySelector('span[automation-id="buy-sell-button-rate-value"]');
                            //toDo: check if the button ist disabled
                            return span ? span.textContent : null;
                        }, div);
                        return spanText;
                    }),
                );
                return buy_sell_string;
            }

// Extract the text content of the span elements
            while(true) {
                let prices = await get_price();
                let prices_float: number[];

                prices_float = convert_to_float(prices);
                let buy_price = prices_float[0];
                let sell_price = prices_float[1];

                //console log the url and the price
                console.log(etoroUrl, prices);
                console.log(etoroUrl, prices_float);
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
