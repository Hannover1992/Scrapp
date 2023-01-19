"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
function get_the_div_with_price(browser, etoroUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const page = yield browser.newPage();
        yield navigateToUrl(etoroUrl, page);
        // Find all divs with class price
        const priceDivs = yield page.$$('div.etoro-price-value');
        return { page, priceDivs };
    });
}
// concatinate_e_toro_url_and_stocks(etorourl, precious_metal)
function concatinate_e_toro_url_and_stocks(stock) {
    let etoroUrl = 'https://www.etoro.com/markets/';
    const chart = '/chart';
    return stock.map(metal => etoroUrl + metal + chart);
}
var assetType;
(function (assetType) {
    assetType[assetType["precious_metal"] = 0] = "precious_metal";
    assetType[assetType["raw_material"] = 1] = "raw_material";
    assetType[assetType["grow"] = 2] = "grow";
    assetType[assetType["value"] = 3] = "value";
    assetType[assetType["bond"] = 4] = "bond";
    assetType[assetType["reit"] = 5] = "reit";
    assetType[assetType["crypto"] = 6] = "crypto";
})(assetType || (assetType = {}));
class Details {
    //construct the detail object default for string = "" and enum = 0
    constructor(name = "", assetType = 0, exchange = "") {
        this.name = name;
        this.assetType = assetType;
        this.exchange = exchange;
    }
}
//
class Stock {
    //construct the stock object default for string = "" and enum = 0
    constructor(symbol = "", detail = new Details(), url = "", buy = 0, sell = 0) {
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
(() => __awaiter(void 0, void 0, void 0, function* () {
    function generate_silver() {
        let silver = [];
        let pslv = new Stock('PSLV', new Details('', assetType.precious_metal));
        silver.push(pslv);
        return silver;
    }
    function generate_gold() {
        let gold = [];
        let phys = new Stock('PHYS', new Details('', assetType.precious_metal));
        let gdxj = new Stock('GDXJ', new Details('', assetType.precious_metal));
        gold.push(phys, gdxj);
        return gold;
    }
    let gold = generate_gold();
    let silver = generate_silver();
    class Precious_Metal {
        constructor() {
            this.gold = generate_gold();
            this.silver = generate_silver();
        }
    }
    class Market {
        //constructor
        constructor() {
            this.precious_metal = new Precious_Metal();
            this.something_else = "something_else";
        }
        flattenObject() {
            const values = Object.values(this).flat(Infinity);
            return values.filter(val => val instanceof Stock || typeof val === 'object').map(val => {
                if (val instanceof Stock) {
                    return val;
                }
                else {
                    return this.flattenObject.call(val);
                }
            });
        }
        save_stocks_to_db() {
            return __awaiter(this, void 0, void 0, function* () {
                let all_stocks = this.flattenObject()[0];
                let browser = yield setUpWebBrowser();
                // Use Promise.all to make the loop async
                yield Promise.all(all_stocks.map((stock) => __awaiter(this, void 0, void 0, function* () {
                    const { page, priceDivs } = yield get_the_div_with_price(browser, stock.url);
                    while (true) {
                        let prices = yield get_price(page, priceDivs);
                        let prices_float;
                        prices_float = convert_to_float(prices);
                        let buy_price = prices_float[0];
                        let sell_price = prices_float[1];
                        let prisma = new client_1.PrismaClient();
                        const price = yield prisma.price.create({
                            data: {
                                Buy: buy_price,
                                Sell: sell_price,
                                industry: {
                                    connectOrCreate: {
                                        where: {
                                            Symbol: stock.symbol
                                        },
                                        create: {
                                            Symbol: stock.symbol,
                                            Name: stock.detail.name,
                                            Exchange: assetType[stock.detail.assetType],
                                        }
                                    }
                                },
                            }
                        });
                        // const industry = await prisma.industry.create({
                        //     data: {
                        //         Symbol: stock.symbol,
                        //         Name: stock.detail.name,
                        //         Exchange: stock.detail.exchange,
                        //         price : {
                        //             create: {
                        //                 Buy: buy_price,
                        //                 Sell: sell_price,
                        //             }
                        //         }
                        //     }
                        // });
                        console.log(price);
                        //console log the url and the price
                        // console.log(stock.url, prices_float);
                        yield page.waitForTimeout(60 * 1000);
                    }
                    function get_price(page, priceDivs) {
                        return __awaiter(this, void 0, void 0, function* () {
                            const buy_sell_string = yield Promise.all(priceDivs.map((div) => __awaiter(this, void 0, void 0, function* () {
                                const spanText = yield page.evaluate((element) => {
                                    const span = element.querySelector('span[automation-id="buy-sell-button-rate-value"]');
                                    //toDo: check if the button ist disabled
                                    return span ? span.textContent : null;
                                }, div);
                                return spanText;
                            })));
                            return buy_sell_string;
                        });
                    }
                    function convert_to_float(prices) {
                        return prices.map((price) => parseFloat(price));
                    }
                })));
                yield browser.close();
            });
        }
    }
    let market = new Market();
    market.save_stocks_to_db();
}))();
function setUpWebBrowser() {
    return __awaiter(this, void 0, void 0, function* () {
        const StealthPlugin = require('puppeteer-extra-plugin-stealth');
        let puppeteer = require('puppeteer-extra');
        puppeteer.use(StealthPlugin());
        const browser = yield puppeteer.launch({
            headless: true,
        });
        return browser;
    });
}
function navigateToUrl(etoroUrl, page) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Navigating to ' + etoroUrl);
        yield page.goto(etoroUrl);
        console.log('wait for 1 second');
        yield page.waitForTimeout(1000);
        console.log('wait for selector on the page');
    });
}
