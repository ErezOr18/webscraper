
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
    name: String,
    price: String,
    color: String,
    sizes: String,
    itemURL: String
});

const Item = mongoose.model('Item', ItemSchema);

module.exports = Item;
