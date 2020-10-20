const mongoose = require('mongoose');
const fs = require('fs');
// const es = require('event-stream');
// const csv = require('csv-parser');
// const json = require('stream-json');
// const StreamArray = require('stream-json/streamers/StreamArray');
// const Promise = require('bluebird');
// Promise.promisifyAll(fs);

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

let featureSchema = new mongoose.Schema({});
let masterSchema = new mongoose.Schema({});

const Feature = mongoose.model('Feature', featureSchema, 'features');
const Master = mongoose.model('Master', masterSchema, 'master');

const productFinder = (num) => {
  return Feature.find({product_id: num});
}
// const relatedFinder = (num) => {
//   return Related.find({current_product_id: num});
// }
// const masterChecker = (num) => {
//   return Master.findOne({product_id: num});
// }

const featureCollector = async () => {
  let result = [];
  // iterate over each row of data in groups of 100,000
  // for (var i = 1; i < 100,001; i++) {
  for (var i = 1; i < 2; i++) {
    // group by product id
    const currentFeatures = await productFinder(i)
    if (currentFeatures.length > 0) {
      var values = Object.values(currentFeatures[0]);
      console.log(values);
      let doc = {
        product_id: values[values.length - 2].id,
        features: {}
      }
      doc.features[feature_name] = values[values.length - 2][feature_value];
      // // for each product,
      // for (var j = 0; j < currentProducts.length; j++) {
      //   // find its related products
      //   const currentRelated = await relatedFinder(JSON.parse(JSON.stringify(currentProducts[j])).id);
      //   if (currentRelated.length > 0) {
      //     for (var k = 0; k < currentRelated.length; k++){
      //       doc.related.push(JSON.parse(JSON.stringify(currentRelated[k])).related_product_id);
      //     }
      //   }
      // }
      result.push(doc);
    }
  }
  console.log('Result array has been populated!')

  // write transformed feature data to file
  // fs.writeFile('./featuresData.json', JSON.stringify(result), 'utf-8', function (err) {
  //   if (err) {
  //     console.error(err);
  //   } else {
  //     console.log('Product and related data file has been written!')
  //   }
  // })
}

featureCollector();