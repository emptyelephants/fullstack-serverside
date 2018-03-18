'use strict';
const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const config = require('../config');
const router = express.Router();

const localAuth = passport.authenticate('local',{session:false, failWithError:true});
const jwtAuth = passport.authenticate('jwt',{session:false, failWithError:true});
router.use(bodyParser.json());

function createAuthToken(user) {
  return jwt.sign({ user }, config.JWT_SECRET,{
    subject: user.username,
    expiresIn: config.JWT_EXPIRY,
    algorithm:'HS256'
  });
}

router.post('/login',localAuth,(req,res) => {
  const authToken = createAuthToken(req.user.serialize());
  res.json({authToken});
});

router.post('/refresh',jwtAuth,(req,res) => {
  const authToken = createAuthToken(req.user);
  res.json({ authToken });
});


router.use((err,req,res,next) => {
  const requiredFields = ['username','password'];
  const missingField = requiredFields.find((field) => !(field in req.body));

  if(missingField){
    return res.status(422).json({
      code:422,
      reason:'ValidationError',
      message:'Missing Field',
      location:missingField
    });
  }
  res.json(err);
});

module.exports = router;
