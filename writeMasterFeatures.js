const mongoose = require('mongoose');
const fs = require('fs');

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

const writeStream = fs.createWriteStream('./featureDataByProduct.json');

let featureSchema = new mongoose.Schema({});
let characteristicSchema = new mongoose.Schema({});

const Feature = mongoose.model('Feature', featureSchema, 'features');
const Characteristic = mongoose.model('Characteristic', characteristicSchema, 'characteristics');

const productFinder = (num) => {
  return Feature.find({product_id: num});
}

const featureCollector = async () => {
  let result = [];
  // iterate over each row of data in groups of 100,000
  // for (var i = 1; i < 1000012; i++) {
  for (var i = 10; i < 11; i++) {
    // group by product id
    const currentFeatures = await productFinder(i);
    if (currentFeatures.length > 0) {
      var values = Object.values(currentFeatures);
      // console.log('Values: ', values);
      let doc = {
        product_id: JSON.parse(JSON.stringify(values[0])).product_id,
        features: {}
      }
      for (var j = 0; j < values.length; j++) {
        doc.features[JSON.parse(JSON.stringify(values[j])).feature_name] = JSON.parse(JSON.stringify(values[j])).feature_value;
      }

      console.log('Product: ', doc.product_id);
      result.push(doc);
    }
  }
  console.log('Result array has been populated!');
  // console.log(result);

  // // write feature to file
  writeStream.write(JSON.stringify(result));
  console.log('Feature data has been written to new file!');
}

featureCollector();