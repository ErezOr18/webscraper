const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 5000;

const bodyParser = require('body-parser');

const scraper = require('./scrapers');
let Item = require('./item.model');
const { json } = require('body-parser');

app.use(bodyParser.json());
app.use(cors());

const uri = "mongodb+srv://erez:erez@cluster0.rdyiz.mongodb.net/db?retryWrites=true&w=majority";

mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})


app.get('/items', async (req, res) => {
    Item.find().then(items => res.json(items))
        .catch(err => res.status(400).json('Error: ' + err));
});


app.post('/items', async (req, res) => {
    //Dev
    console.log(req.body);

    let allItems = [];

    const items = await scraper.scrapeSite(req.body.itemURL);
    await items.forEach(item => {
        const itemDb = new Item({
            name: item.name,
            price: item.price,
            color: item.color_name,
            sizes: item.sizes,
            itemURL: item.itemURL
        });
        itemDb.save();
    });
    res.json("ok");
});

app.get('/refresh', async (req, res) => {
    Item.find().then(async allItems => {

        await Item.deleteMany({});

        const objectlist = allItems.map(item => String(item.itemURL));

        let urls = Array.from(new Set(objectlist));

        console.log(urls);

        await Promise.all(urls.map(async (url) => {
            const items = await scraper.scrapeSite(url);
            console.log(JSON.stringify(items));
            await Promise.all(items.map(async item => {
                const itemDb = new Item({
                    name: item.name,
                    price: item.price,
                    color: item.color_name,
                    sizes: item.sizes,
                    itemURL: item.itemURL
                });
                await itemDb.save();
            }));
        })).then(() =>Item.find().then(items => res.json(items)));
    });
});



app.delete('/items/:id', (req, res) => {
    Item.findByIdAndDelete(req.params.id)
        .then(() => Item.find().then(items => res.json(items)))
        .catch(err => res.status(400).json('Error: ' + err));
});

app.listen(port, () => console.log(`Scraper app listening on port ${port}!`))