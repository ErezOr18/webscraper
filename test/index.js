const scraper = require('../server/scrapers');

scraper.scrapeSite('https://www.footlocker.com/product/just-don-llc-flames-fleece-hoodie-mens/7922001D.html').then(item => console.log(item));
scraper.scrapeSite('https://www.eastbay.com/product/new-balance-327-mens/MS327KJR.html').then(item => console.log(item));
scraper.scrapeSite('https://www.dickssportinggoods.com/p/nike-mens-sportswear-club-fleece-hoodie-regular-and-big-tall-19nikmmnswclbhdpbnft/19nikmmnswclbhdpbnft?recid=home_PageElement_home3_rr_3_19283_&rrec=true')
    .then(items => {
        items.forEach((item, index) => {
            console.log(item);
        })
    });
