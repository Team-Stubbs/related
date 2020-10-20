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

const writeStream = fs.createWriteStream('./photoDataWithStyles.json');

let photoSchema = new mongoose.Schema({});
let styleSchema = new mongoose.Schema({});

const Photo = mongoose.model('Photo', productSchema, 'photos');
const Style = mongoose.model('Style', relatedSchema, 'styles');

const photoFinder = (num) => {
  return Photo.find({styleId: num});
}
const styleFinder = (num) => {
  return Style.find({id: num});
}
const styleProductFinder = (num) => {
  return Style.find({productId: num})
}

const productCollector = async () => {
  let result = [];
  // iterate over each product in groups of 100,000
  for (var i = 1; i < 100001; i++) {
    const currentProducts = await styleProductFinder(i);
    // const currentStyles = await styleFinder(i)
    if (currentProducts.length > 0) {
      // TODO: look at this data structure to see if we're pulling in data correctly
      var values = Object.values(currentProducts[0]);
      let doc = {
        product_id: values[values.length - 2].productId,
        style_ids: [],
        photos: {}
      }
      // TODO: also check data here
      doc.style_ids.push(values[values.length - 2].styleId);

      // for each product,
      for (var j = 0; j < currentProducts.length; j++) {
        // find its related products
        const currentRelated = await relatedFinder(JSON.parse(JSON.stringify(currentProducts[j])).id);
        if (currentRelated.length > 0) {
          for (var k = 0; k < currentRelated.length; k++){
            doc.related.push(JSON.parse(JSON.stringify(currentRelated[k])).related_product_id);
          }
        }
      }
      console.log('Product: ', doc.product_id);
      result.push(doc);
    }
  }
  console.log('Result array has been populated!')

  // write product info and related products to file
  writeStream.write(JSON.stringify(result));
  console.log('Product and related data has been written to new file!');
}

productCollector();