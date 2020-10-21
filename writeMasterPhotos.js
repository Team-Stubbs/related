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
    console.log('MongoDB connection successful!');
    resolve(true);
  });
})

const writeStream = fs.createWriteStream('./photoDataWithStyles.json');

let photoSchema = new mongoose.Schema({});
let styleSchema = new mongoose.Schema({});
let masterSchema = new mongoose.Schema({});

const PhotosJSON = mongoose.model('PhotosJSON', photoSchema, 'photosjson');
const Style = mongoose.model('Style', styleSchema, 'styles');
const Master = mongoose.model('Master', masterSchema, 'photos');

const photoFinder = (num) => {
  return PhotosJSON.find({styleId: num});
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
  // for (var i = 1; i < 1000012; i++) {
  for (var i = 1; i < 2; i++) {
    const currentStyles = await styleProductFinder(i);
    if (currentStyles.length > 0) {
      var values = Object.values(currentStyles);
      console.log(values);
      let doc = {
        product_id: JSON.parse(JSON.stringify(values[0])).productId,
        style_ids: [],
        photos: {}
      }
      // console.log('Product: ', doc);

      // for each style,
      for (var j = 0; j < currentStyles.length; j++) {
        // save style id to array
        doc.style_ids.push(JSON.parse(JSON.stringify(values[j])).id);

        // const currentRelated = await relatedFinder(JSON.parse(JSON.stringify(currentProducts[j])).id);
        // if (currentRelated.length > 0) {
        //   for (var k = 0; k < currentRelated.length; k++){
        //     doc.related.push(JSON.parse(JSON.stringify(currentRelated[k])).related_product_id);
        //   }
        // }
      }

      // find photos associated with each style id
      for (var k = 0; k < doc.style_ids.length; k++) {
        const currentPhotos = await photoFinder(doc.style_ids[k]);
        console.log(currentPhotos);
        // for (var l = 0; l < currentPhotos.length; l++) {
        //   doc.photos[]
        // }
      }

      console.log('Product: ', doc.style_ids);
      // console.log('Product: ', doc.product_id);
      // result.push(doc);
    }
  }
  // console.log('Result array has been populated!')

  // // write product info and related products to file
  // writeStream.write(JSON.stringify(result));
  // console.log('Product and related data has been written to new file!');
}

// productCollector();
var photoTest = photoFinder("1");
console.log(photoTest);
