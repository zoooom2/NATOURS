/* eslint-disable no-unused-expressions */
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('../../models/tourModel');
const Review = require('../../models/reviewModel');
const User = require('../../models/userModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose.connect(DB).then(() => {
  console.log('connections established');
});

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, 'utf-8')
);
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));

const importData = async () => {
  try {
    await Tour.create(tours);
    await Review.create(reviews);
    await User.create(users, { validateBeforeSave: false });
    console.log('data sucessfully imported');
  } catch (err) {
    console.log(err);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    await Review.deleteMany();
    await User.deleteMany();
    console.log('data successfully deleted');
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

// eslint-disable-next-line no-unused-expressions
process.argv[2] === '--import' && importData();
process.argv[2] === '--delete' && deleteData();

// if (process.argv[2] === '--import') {
//   importData();
// } else if (process.argv[2] === '--delete') {
//   deleteData();
// }
