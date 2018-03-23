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
router.get('/recipes/:id',(req,res,next) => {
  const {id} = req.params;
  Recipe.findOne({_id:id})
    .select('steps recipeName espressoType blurb authorName')
    .then((recipe) => {
      res.json(recipe);
    })
    .catch(err =>next(err));
});
const jwtAuth = passport.authenticate('jwt', { session: false });

router.get('/recipes',jwtAuth,(req, res, next) => {
  const userId = req.user.id;
  Recipe.find({authorId:userId})
    .then((recipes) => {
      res.json(recipes);
    })
    .catch(err => next(err));
});
router.get('/recipes/all',jwtAuth,(rq, res, next) => {
  Recipe.find().limit(50)
    .then((recipes) => {
      res.json(recipes);
    })
    .catch(err => next(err));
});

router.post('/recipes',jwtAuth,(req, res, next) => {
  const {recipeName, espressoType, steps, blurb} = req.body;
  const userId = req.user.id;
  const authorName = req.user.username;
  console.log(req.user);
  const newRecipe = {
    recipeName,
    espressoType,
    steps,
    blurb,
    authorId:userId,
    authorName:authorName
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
