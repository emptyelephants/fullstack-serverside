'use strict';
const app = require('../index.js');
const  jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiSpies = require('chai-spies');
const expect = chai.expect;
chai.use(chaiHttp);

const {TEST_DATABASE_URL, JWT_SECRET} = require('../config');
const {dbConnect, dbDisconnect} = require('../db-mongoose');


// clean up console
process.env.NODE_ENV = 'test';
process.stdout.write('\x1Bc\n');

// Models & Seed Data
const Recipe = require('../models/recipe');
const User = require('../models/user');
const recipeSeed = require('../db/mockRecipes.json');

//fake user for auth
let token;
let id;
const _id = '555555555555555555550001';
const username = 'testUsername';
const password = 'exmaplePassword';

describe('Sproify backend tests', function () {
  before(function () {
    return mongoose.connect(TEST_DATABASE_URL, {autoIndex:false});
  });
  beforeEach(function() {
    return Recipe.insertMany(recipeSeed)
      .then(() => {
        Recipe.ensureIndexes();
      })
      .then(() => {
        return User.hashPassword(password);
      })
      .then((digest) => {
        return User.create({_id, username, password:digest});
      })
      .then((user) => {
        id = user.id;
        token = jwt.sign({ user }, JWT_SECRET, { subject:user.username});
      });
  });
  afterEach(function () {
    return mongoose.connection.db.dropDatabase();
  });
  after(() => {
    return mongoose.disconnect();
  });


  describe('Reality Check', () => {
    it('true should be true', () => {
      expect(true).to.be.true;
    });

    it('2 + 2 should equal 4 (except in 1984)', () => {
      expect(2 + 2).to.equal(4);
    });
  });



});
