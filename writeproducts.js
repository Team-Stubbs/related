const mongoose = require('mongoose');
const fs = require('fs');
// const es = require('event-stream');
const csv = require('csv-parser');

let ProductSchema = mongoose.Schema({
  id: Number,
  name: String,
  category: String,
  default_price: Number,
  related: [Number],
  characteristics: Map,
  photos: Map,
  rating: Map
}, {versionKey: false});

const Product = mongoose.model('Product', ProductSchema);

let connectToDB = new Promise((resolve, reject) => {
  mongoose.connect('mongodb://127.0.0.1:27017/stubbs', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  });

  const db = mongoose.connection;
  db.catch((err) => {
    console.error('Connection error: ', err);
    reject('connection error');
  })
  db.once('open', () => {
    console.log('MongoDB connection successful! ');
    resolve(true);
  });
})

const productList = [];

const writeStream = fs.createWriteStream('./productData.json');
const readStream = fs.createReadStream('../SDC-csv-files/product.csv')

// Add product list to array as objects
readStream
  .pipe(csv())
  .on('data', (data) => {
    data.related = [];
    data.characteristics = {};
    data.photos = {};
    data.rating = {
      total: 0,
      sum: 0,
      reviews: []
    };
    productList.push(data);
  })
  .on('end', () => {
    writeStream.write(JSON.stringify(productList));
    console.log('Product data has been written to new file!');
  })
