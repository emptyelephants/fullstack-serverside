'use strict';
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const passport = require('passport');
// const {localStrategy, jwtStrategy} = require('../passport/strategies');

//models
const Recipe = require('../models/recipe.js');

mongoose.Promise = global.Promise;
//

// router.use(passport.authenticate('jwt', { session: false, failWithError: true }));
const jwtAuth = passport.authenticate('jwt', { session: false });

router.get('/recipes',jwtAuth,(req, res, next) => {
  console.log('what',req.user.id);
  const userId = req.userId;
  Recipe.find({userId})
    .then((recipes) => {
      res.json(recipes);
    })
    .catch(err => next(err));
});

router.post('/recipes',(req, res, next) => {
  const {recipeName, brewMethod, steps} = req.body;
  const userId = req.userId
  const newRecipe = {
    recipeName,
    brewMethod,
    steps,
    userId
  };
  Recipe.create(newRecipe)
    .then((response) => {
      if(response){
        return Recipe.find();
      }
      else{
        next();
      }
    })
    .then((recipes) => res.json(recipes))
    .catch((err) => next(err));


});

// router.put() DO THIS

router.delete('/recipes/:id',(req, res, next) => {
  const deleteId = req.params.id;

  Recipe.findByIdAndRemove(deleteId)
    .then((response) => {
      if(response){
        res.status(204).end();
      }
      else {
        next();
      }
    });

});


module.exports = router;
