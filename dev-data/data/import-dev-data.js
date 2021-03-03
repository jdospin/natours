const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tour = require('../../models/tourModel');

dotenv.config({
  path: '../../config.env',
});

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connection successful!'));

// READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    const imported = await Tour.create(tours);
    console.log(`${imported.length} documents imported!`);
  } catch (err) {
    console.log(err);
  } finally {
    process.exit();
  }
};

// DELETE ALL DATA FROM COLLECTION
const deleteData = async () => {
  try {
    const deleted = await Tour.deleteMany();
    console.log(`${deleted.n} documents deleted!`);
  } catch (err) {
    console.log(err);
  } finally {
    process.exit();
  }
};

const numberOfArgs = process.argv.length;

if (numberOfArgs === 3 && process.argv[2] === '--import') {
  importData();
} else if (numberOfArgs === 3 && process.argv[2] === '--delete') {
  deleteData();
} else {
  console.log(
    'Usage:\nnode import-dev-data.js --import (to import the data into the DB)\nnode import-dev-data.js --delete (to delete the data in the DB)'
  );
  process.exit();
}
