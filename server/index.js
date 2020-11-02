
const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

const bodyParser = require('body-parser');

//TODO change imports
const scrapers = require('./scrapers');
const db = require('./db');

app.use(bodyParser.json());
/*
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // disabled for security on local
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});
*/
app.use(cors());

//TODO set new route
app.get('/creators', async (req, res) => {
    const creators = await db.getAllCreators();
    res.send(creators)
})

//TODO set new route + new data parse
app.post('/creators', async (req, res) => {
    console.log(req.body);
    const channelData = await scrapers.scrapeChannel(req.body.channelURL).catch(err => console.log(err))
    const creators = await db.insertCreator(channelData.name, channelData.avatarURL, req.body.channelURL).catch(err => console.log(err))
    res.send(creators);
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
