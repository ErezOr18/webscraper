const puppeteer = require('puppeteer');


async function scrapeDickSport(url) {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(0);

        await page.evaluateOnNewDocument(() => {
            delete navigator.__proto__.webdriver;
        });


        await page.goto(url);


        //scrape product price

        //TODO check for special price items



        //scrape product colors

        //TODO  deal with overflow of colors
        const data = await page.evaluate(async () => {
            let colors_data = Array.from(document.querySelectorAll('div.color-attributes-container'));
            let name = document.querySelector('h1').textContent;

            let colors = [];

            let btn = Array.from(colors_data[0].querySelectorAll('button'));
            btn = btn.map((element) => {
                element.click();
                const sizes = Array.from(document.querySelectorAll('#block-attributes > div >button'));
                const true_sizes = sizes.filter(element => !element.className.includes('swatch-disabled'));
                true_sizes[0].click();


                const price = document.querySelector('span.product-price').textContent;

                colors.push({
                    name: name,
                    color: document.querySelector('span.selected-attribute-title.ng-star-inserted').textContent,
                    color_sizes: true_sizes.map(element => element.querySelector('div > span').textContent),
                    color_price: price
                });
            });

            if (colors_data.length === 2) {
                let btn = Array.from(colors_data[1].querySelectorAll('button'));
                btn = btn.map((element) => {
                    element.click();
                    const sizes = Array.from(document.querySelectorAll('#block-attributes > div >button'));
                    const true_sizes = sizes.filter(element => !element.className.includes('swatch-disabled'));
                    true_sizes[0].click();


                    const price = Array.from(document.querySelectorAll('span.product-price'))[1].textContent;

                    colors.push({
                        name: name,
                        color: document.querySelector('span.selected-attribute-title.ng-star-inserted').textContent,
                        color_sizes: true_sizes.map(element => element.querySelector('div > span').textContent),
                        color_price: price
                    });
                });
            }
            return {
                colors: colors
            };
        });

        const colors = data.colors;

        const itemURL = url;

        let items = [];

        colors.forEach(color => {
            const name = color.name
            const sizes = color.color_sizes.join(',');
            const color_name = color.color;
            const price = color.color_price;
            items.push({ name, price, color_name, sizes, itemURL });
        })

        browser.close();

        return items;
    }
    catch (err) {
        console.log(err);
    }
}


module.exports = {
    scrapeDickSport
}