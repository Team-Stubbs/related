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
const relatedList = [];
const featuresList = [];
const photoList = [];
const reviewList = [];

// Add product list to results array as objects
fs.createReadStream('../SDC-csv-files/product.csv')
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
    console.log('Product data has been transformed!');
    console.log(productList);
    readRelated;
  });


// Add related products to relatedList
let readRelated = fs.createReadStream('../SDC-csv-files/related.csv')
  .pipe(csv())
  .on('data', (data) => {
    relatedList.push(data);
  })
  .on('end', () => {
    console.log('Related data has been transformed!');
    console.log(relatedList);
    readFeatures;
  });

// Add features to featureList
let readFeatures = fs.createReadStream('../SDC-csv-files/features.csv')
  .pipe(csv())
  .on('data', (data) => {
    featuresList.push(data);
  })
  .on('end', () => {
    console.log('Features data has been transformed!');
    console.log(featuresList);
    readPhotos;
  });

// Add photos to photoList
let readPhotos = fs.createReadStream('../SDC-csv-files/photos.csv')
  .pipe(csv())
  .on('data', (data) => {
    photoList.push(data);
  })
  .on('end', () => {
    console.log('Photos data has been transformed!');
    console.log(photoList);
    readReviews;
  });

// Add reviews to reviewList
let readReviews = fs.createReadStream('../SDC-csv-files/reviews.csv')
  .pipe(csv())
  .on('data', (data) => {
    reviewList.push(data);
  })
  .on('end', () => {
    console.log('Review data has been transformed!');
    console.log(reviewList);
    addRelated(productList, relatedList);
  })

// TODO: Add a function here that writes productList to another file

// TODO: Create a new file to run that does all these modifications to productList

// Insert related products into productList
function addRelated(products, related) {
  for (var i = 0; i < related.length; i++) {
    var id = related[i][current_product_id];
    products[id - 1].related.push(related[i][related_product_id]);
  }
  addFeatures(productList, featuresList);
}

// Insert features into productList
function addFeatures(products, features) {
  for (var i = 0; i < features.length; i++) {
    var id = features[i][product_id];
    products[id - 1].characteristics[features[i][feature_name]] = features[i][feature_value];
  }
  addPhotos(productList, photoList);
}

// Insert photo urls into productList
function addPhotos(products, photos) {
  for (var i = 0; i < photos.length; i++) {
    var id = photos[i][styleId];
    products[id - 1].photos.style_id = photos[i][styleId];
    products[id - 1].photos.url = photos[i][url];
    products[id - 1].photos.thumbnail_url = photos[i][thumbnail_url];
  }
  addReviews(productList, reviewList);
}

// Insert reviews and ratings into productList
function addReviews(products, reviews) {
  for (var i = 0; i < reviews.length; i++) {
    var id = reviews[i][product_id];
    products[id - 1].rating.reviews.push(reviews[i]);
    products[id - 1].rating.sum += reviews[i].rating;
    products[id - 1].rating.total++;
  }
  console.log(productList[0], productList[555]);
}