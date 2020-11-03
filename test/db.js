
const uri = "mongodb+srv://erez:erez@cluster0.rdyiz.mongodb.net/db?retryWrites=true&w=majority";

async function getAllItems() {
    const connection = await getConnection();
    const itemRepo = connection.getRepository(Item);
    const items = await itemRepo.find();
    await connection.close();
    return items;
}


async function insertItem(name, price, colors, sizes, itemURL) {
    const connection = await getConnection();

    // create
    const item = new Item();
    item.name = name;
    item.price = price;
    item.colors = colors;
    item.sizes = sizes;
    item.itemURL = itemURL;

    // save
    const itemRepo = connection.getRepository(Item);
    const res = await itemRepo.save(item).then((item) =>console.log('saved', item))
    .catch((err) => console.log(err));

    // return new list
    await connection.close();

}

async function clearTable(){
    const connection = await getConnection();


    const itemRepo = connection.getRepository(Item);
    const res = itemRepo.clear().then(() => console.log('cleared'));
    await connection.close();


}

module.exports = {
    getAllItems,
    insertItem,
    clearTable
}