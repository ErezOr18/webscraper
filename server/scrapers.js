
const scrapeFootlockerAndEastbay = require('./footlocker');
const scrapeDickSport = require('./dicksporting');


async function scrapeSite(url) {
    const url_site = new URL(url);
    if (url_site.hostname === "www.footlocker.com" || url_site.hostname === "www.eastbay.com") {
        return await scrapeFootlockerAndEastbay.scrapeFootlockerAndEastbay(url);
    }
    else if (url_site.hostname === "www.dickssportinggoods.com") {
        return await scrapeDickSport.scrapeDickSport(url);
    }
    else {

        console.log(url_site.hostname);
        return undefined;
    }
}

module.exports = {
    scrapeSite
}