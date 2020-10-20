const mongoose = require('mongoose');
const fs = require('fs');
// const es = require('event-stream');
const csv = require('csv-parser');
const json = require('stream-json');
const StreamArray = require('stream-json/streamers/StreamArray');
const Promise = require('bluebird');
Promise.promisifyAll(fs);


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
// const relatedList = {};

const writeStream = fs.createWriteStream('./productDataWithRelated.json');
const readRelatedStream = fs.createReadStream('../SDC-csv-files/related.csv');
const readProductStream = fs.createReadStream('./productData.json').pipe(StreamArray.withParser());

// Read product list and add to array as objects
readProductStream
  .on('data', (pData) => {
    productList.push(pData);
  })
  .on('end', () => {
    console.log(productList);
    console.log('Product data saved in productList');
  })
  .then(
    callRelated;
  )

// Read related list and add to relatedList object
const callRelated = readRelatedStream
  .pipe(csv())
  .on('data', (data) => {
    productList[data.current_product_id - 1].value.related.push(data.related_product_id);
  })
  .on('end', () => {
    console.log('Related products added to productList')
    writeStream.write(JSON.stringify(productList))
    console.log('Product data with related products has been written to new file!');
  })


//   async function getEmpDetailsByEmailIdAndUniqueCode(fileName,emailId,uniqueCode){
//     console.log("inside getEmpDetailsByEmailIdAndUniqueCode()::"+emailId+"::"+uniqueCode);

//     return new Promise(function(resolve,reject){
//         var fetchData = [];
//         fs.createReadStream(fileName)
//             .pipe(csv())
//             .on('data', (row) => {
//                 if(row.unique_code != null && row.unique_code == uniqueCode && row.investor_email_id == emailId) {
//                     fetchData.push(row);
//                     console.log(row);
//                 }
//             })
//             .on('end', () => {
//                 console.log('CSV file successfully processed');
//                 console.log(fetchData);
//                 resolve(fetchData);
//             })
//             .on('error', reject);
//     })
// }