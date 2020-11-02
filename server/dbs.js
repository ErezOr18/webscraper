const typeorm = require('typeorm');

class Item {
    constructor(id, name, price, description, sizes, itemURL) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.description = description;
        this.sizes = sizes;
        this.itemURL = itemURL;
    }
}

const EntitySchema = require("typeorm").EntitySchema;


const ItemSchema = new EntitySchema({
    name: "Item",
    target: Item,
    columns: {
        id: {
            primary: true,
            type: "int",
            generated: true
        },
        name: {
            type: "varchar"
        },
        price: {
            type: "text"
        },
        description: {
            type: "text"
        },
        sizes: {
            type: "text"
        },
        itemURL: {
            type: "text"
        }
    }
});

async function getConnection() {
    return await typeorm.createConnection({
        type: "mysql",
        host: "localhost",
        port: 3306,
        username: "root",
        password: "password",
        database: "webscraper",
        synchronize: true,
        logging: false,
        entities: [
            ItemSchema
        ]
    })
}

async function getAllItems() {
    const connection = await getConnection();
    const itemRepo = connection.getRepository(Item);
    const items = await itemRepo.find();
    connection.close();
    return items;
}


async function insertItem(name, price, description, sizes, itemURL) {
    const connection = await getConnection();

    // create
    const item = new Item();
    item.name = name;
    item.price = price;
    item.description = description;
    item.sizes = sizes;
    item.itemURL = itemURL;

    // save
    const itemRepo = connection.getRepository(Item);
    const res = await itemRepo.save(item).then((item) =>console.log('saved', res))
    .catch((err) => console.log(err));

    // return new list
    const allItems = await itemRepo.find();
    connection.close();
    return allItems;

}

module.exports = {
    getAllItems,
    insertItem
}