'use strict';
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

//models
const Recipe = require('../models/recipe.js');

mongoose.Promise = global.Promise;


router.get('/recipes',(req, res, next) => {
  Recipe.find()
    .then((recipes) => {
      console.log('the recipes ',recipes);
      res.json(recipes);
    })
    .catch(err => next(err));
});


module.exports = router;
