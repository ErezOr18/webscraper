
const puppeteer = require('puppeteer');

async function scrapeFootlockerAndEastbay(url) {
    try {
        const browser = await puppeteer.launch({ headless: false, slowMo: 200 });
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);

        await page.evaluateOnNewDocument(() => {
            delete navigator.__proto__.webdriver;
        });


        await page.goto(url);


        //scrape product name
        const [el] = await page.$x('//*[@id="pageTitle"]/span/span[1]');
        const text = await el.getProperty('textContent');
        const name = await text.jsonValue();

        //scrape product price

        //check for special price
        let text2 = ""
        const [found] = await page.$x('//*[@id="ProductDetails"]/div[5]/div[1]/span/div/p/span[1]');
        if (found !== undefined) {
            text2 = await found.getProperty('textContent');
        }
        else {
            const [el2] = await page.$x('//*[@id="ProductDetails"]/div[5]/div[1]/span/div/span');
            text2 = await el2.getProperty('textContent');
        }
        const price = await text2.jsonValue();



        //scrape product colors

        await page.waitForSelector('#ProductDetails > div.ProductStyles.row.row--always > fieldset');

        //scrape product sizes
        await page.waitForSelector('#ProductDetails > div.ProductDetails-form__info > div.ProductDetails-form__sizes > fieldset > div');

        //TODO  deal with overflow of colors
        const data = await page.evaluate(async () => {
            let colors_data = Array.from(document.querySelectorAll('#ProductDetails > div.ProductStyles.row.row--always > fieldset > div'));
            let colors = [];
            colors_data = colors_data.map((element) => {
                element.querySelector('input[type="radio"]').click();
                const sizes = Array.from(document.querySelectorAll('#ProductDetails > div.ProductDetails-form__info > div.ProductDetails-form__sizes > fieldset > div > div'));
                const true_sizes = sizes.filter(element => !element.className.includes('c-form-field--unavailable'));
                colors.push({
                    color: document.querySelector('#ProductDetails > div.ProductDetails-form__info > p').textContent,
                    color_sizes: true_sizes.map(element => element.querySelector('label > span').outerText)
                });
            });


            return {
                colors: colors
            };
        });

        const itemURL = url;
        const colors = data.colors;


        let items = [];


        colors.forEach(color => {
            const sizes = color.color_sizes.join(',');
            const color_name = color.color;
            items.push({ name, price, color_name, sizes , itemURL });
        });


        browser.close();

        return items;
    }
    catch (err) {
        console.log(err);
    }
}

async function scrapeDickSport(url) {
    try {
        const browser = await puppeteer.launch({ headless: false, slowMo: 200 });
        const page = await browser.newPage();
        await page.setDefaultNavigationTimeout(0);

        await page.evaluateOnNewDocument(() => {
            delete navigator.__proto__.webdriver;
        });


        await page.goto(url);


        //scrape product name
        const [el] = await page.$x('//*[@id="app-container"]/pdp-product-container/pdp-in-stock-default/div[3]/div[2]/div[2]/div/pdp-product-title/div/div/h1');
        const text = await el.getProperty('textContent');
        const name = await text.jsonValue();

        //scrape product price

        //TODO check for special price items
        let text2 = ""
//*[@id="attr_Color0"]/div[1]/div/pdp-price/div/div/div/div/div/span
        const [el2] = await page.$x('//*[@id="attr_Color0"]/div[1]/div/pdp-price/div/div/div/div/div/span');
        text2 = await el2.getProperty('textContent');
        const price = await text2.jsonValue();



        //scrape product colors

        await page.waitForSelector('#attr_Color0 > div.row.color-container.ng-star-inserted > div.col-12 > pdp-color-attribute > div > div');

        //scrape product sizes
        await page.waitForSelector('#block-attributes > div');



        //TODO  deal with overflow of colors
        const data = await page.evaluate(async () => {
            let colors_data = Array.from(document.querySelectorAll('#attr_Color0 > div.row.color-container.ng-star-inserted > div.col-12 > pdp-color-attribute > div > div > span'));
            let colors = [];
            colors_data = colors_data.map((element) => {
                element.querySelector('button').click();
                const sizes = Array.from(document.querySelectorAll('#block-attributes > div >button'));
                const true_sizes = sizes.filter(element => !element.className.includes('swatch-disabled'));
                colors.push({
                    color: document.querySelector('#attr_Color0 > div.row.color-container.ng-star-inserted > div.row.no-gutters > pdp-attribute-label > div > span.selected-attribute-title.ng-star-inserted').textContent,
                    color_sizes: true_sizes.map(element => element.querySelector('div > span').textContent)
                });
            });


            return {
                colors: colors
            };
        });

        const colors = data.colors;

        const itemURL = url;

        let items = [];

        colors.forEach(color => {
            const sizes = color.color_sizes.join(',');
            const color_name = color.color;
            items.push({ name, price, color_name, sizes , itemURL });
        })

        browser.close();

        return items;
    }
    catch (err) {
        console.log(err);
    }
}


async function scrapeSite(url) {
    const url_site = new URL(url);
    if (url_site.hostname === "www.footlocker.com" || url_site.hostname === "www.eastbay.com") {
        return await scrapeFootlockerAndEastbay(url);
    }
    else if (url_site.hostname === "www.dickssportinggoods.com") {
        return await scrapeDickSport(url);
    }
    else {

        console.log(url_site.hostname);
        return undefined;
    }
}

module.exports = {
    scrapeSite
}
