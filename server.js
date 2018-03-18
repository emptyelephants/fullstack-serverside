'use strict';
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');
const {localStrategy, jwtStrategy} = require('./passport/strategies');
const {PORT, CLIENT_ORIGIN} = require('./config');
const {dbConnect} = require('./db-mongoose');

const app = express();

//required routers
const authRouter = require('./routers/auth');
const recipesRouter = require('./routers/recipes');
const userRouter = require('./routers/user');

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(
  cors({
    origin:CLIENT_ORIGIN
  })
);

app.use(express.json());
app.use(morgan('common'));

passport.use(localStrategy);
passport.use(jwtStrategy);

//routers

app.use('/v1',userRouter);
app.use('/v1',authRouter);
app.use('/v1', recipesRouter);

app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: app.get('env') === 'development' ? err : {}
  });
});


function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = {app};
