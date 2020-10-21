const csv = require('csvtojson');
const fs = require('fs');

const readStream = fs.createReadStream('../SDC-csv-files/photos.csv');
const writeStream = fs.createWriteStream('./photosToJSON.json');

readStream.pipe(csv({downstreamFormat: 'array'})).pipe(writeStream);
readStream.on('end', () => {
  console.log('Photos converted to JSON');
});