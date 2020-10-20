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
  // for (var i = 1; i < 100,001; i++) {
  for (var i = 1; i < 3; i++) {
    // group by product id
    const currentFeatures = await productFinder(i)
    if (currentFeatures.length > 0) {
      // TODO: look at these data structures to make sure I'm extracting the data I need correctly
      var values = Object.values(currentFeatures[0]);
      console.log('Values: ', values);
      let doc = {
        product_id: values[values.length - 2].product_id,
        features: {}
      }
      // TODO: again, look at data and update
      // for (var i = 0; i < currentFeatures.length; i++) {
      //   // doc.features[values[values.length - 2].feature_name] = values[values.length - 2].feature_value;
      //   console.log(currentFeatures[i])
      // }

      // console.log('Product: ', doc);
      // result.push(doc);
    }
  }
  // console.log('Result array has been populated!')

  // // write feature to file
  // writeStream.write(JSON.stringify(result));
  // console.log('Feature data has been written to new file!');
}

featureCollector();