'use strict';
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const {PORT, CLIENT_ORIGIN} = require('./config');
const {dbConnect} = require('./db-mongoose');

const app = express();

// app.use(express.json());


//routers
const recipesRouter = require('./routers/recipes');

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
// sanity check
// app.get('/api/cheeses',(req,res) => {
//   const cheese = [
//     'Bath Blue',
//     'Barkham Blue',
//     'Buxton Blue',
//     'Cheshire Blue',
//     'Devon Blue',
//     'Dorset Blue Vinney',
//     'Dovedale',
//     'Exmoor Blue',
//     'Harbourne Blue',
//     'Lanark Blue',
//     'Lymeswold',
//     'Oxford Blue',
//     'Shropshire Blue',
//     'Stichelton',
//     'Stilton',
//     'Blue Wensleydale',
//     'Yorkshire Blue'
//   ];
//   res.json(cheese);
// });

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
