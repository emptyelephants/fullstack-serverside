const mongoose = require('mongoose');
const { DATABASE_URL } = require('../config');

const Recipe = require('../models/recipe');
const seedRecipes = require('../db/mockRecipes');

mongoose.connect(DATABASE_URL)
  .then(() => {
    return mongoose.connection.db.dropDatabase()
      .then((result)=> console.log(`Dropped DB: ${result}`));
  })
  .then(() => {
    return Recipe.insertMany(seedRecipes)
      .then((results) => console.log(`Inserted: ${results.length} recipes`));
  });
