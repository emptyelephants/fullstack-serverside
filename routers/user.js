'use strict';
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const jsonParser = bodyParser.json();

const User = require ('../models/user.js');
const Recipe = require('../models/recipe.js');

router.post('/users',jsonParser,(req,res) => {
  //check for missing username or passowrd
  const requiredFields = ['username','password'];
  const missingField = requiredFields.find(field => !(field in req.body));
  if(missingField){
    return res.status(422).json({
      code:422,
      reason:'Validation Error',
      message:'Missing Field',
      location: missingField
    });
  }
  //check for non string in req.body
  const stringFields = ['username','password','firstName','lastName'];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string'
  );
  if(nonStringField){
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField
    });
  }
  //check for whitespace in username/password
  const explicityTrimmedFields = ['username', 'password'];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField
    });
  }

  const sizedFields = {
    username: {
      min: 1
    },
    password: {
      min: 8,
      max: 72
    }
  };
  const tooSmallField = Object.keys(sizedFields).find(
    field =>
      'min' in sizedFields[field] &&
            req.body[field].trim().length < sizedFields[field].min
  );
  const tooLargeField = Object.keys(sizedFields).find(
    field =>
      'max' in sizedFields[field] &&
            req.body[field].trim().length > sizedFields[field].max
  );

  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField]
          .min} characters long`
        : `Must be at most ${sizedFields[tooLargeField]
          .max} characters long`,
      location: tooSmallField || tooLargeField
    });
  }

  let {username, password, firstName='', lastName=''} = req.body;

  firstName = firstName.trim();
  lastName = lastName.trim();
  return User.find({username})
    .count()
    .then((count) => {
      console.log(count,'from count');
      if(count>0){
        return Promise.reject({
          code:422,
          reason:'ValidationError',
          message:'Username is already taken',
          location:'username'
        });
      }
      return User.hashPassword(password);
    })
    .then(hash => {
      return User.create({
        username,
        password:hash,
        firstName,
        lastName
      });
    })
    .then((user) => {
      console.log('what',user);
      const userId =user._id;
      const authorName = user.username;
      const firstRecipe = {
        recipeName:'Testpresso',
        espressoType:'Example',
        steps:['Brew Ratio: 31g in - 31g out','First Drop: 11s','Total Brew Time: 26 - 31 seconds'],
        blurb:'This is just an example recipe, Feel free to delete it.',
        authorId:userId,
        authorName:authorName
      };
      Recipe.create(firstRecipe);
      return res.status(201).json(user.serialize());
    })
    .catch(err => {
      // Forward validation errors on to the client, otherwise give a 500
      // error because something unexpected has happened
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({code: 500, message: 'Internal server error'});
    });


});




module.exports = router;
