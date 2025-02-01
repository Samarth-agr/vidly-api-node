const express = require('express');
const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
const returns = require('./routes/returns');
const error = require('./middleware/error');
const Joi = require('joi');

// Initialize the app
const app = express();

// Use CORS middleware
app.use(require('cors')());

// Set up body parsing for JSON
app.use(express.json());

// Validation for ObjectId
Joi.objectId = require('joi-objectid')(Joi);

// Set up routes
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use('/api/returns', returns);
app.use(error);

// Set up logging with Winston
winston.add(new winston.transports.File({ filename: 'logfile.log' }));
winston.exceptions.handle(
  new winston.transports.Console({ format: winston.format.simple() }),
  new winston.transports.File({ filename: 'uncaughtExceptions.log' })
);
process.on('unhandledRejection', (ex) => {
  throw ex;
});

// Check if JWT private key is defined
if (!config.get('jwtPrivateKey')) {
  throw new Error('FATAL ERROR: jwtPrivateKey is not defined.');
}

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1/vidly', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB...');

    // Start the server
    app.listen(3000, () => {
      console.log('Listening on port 3000...');
    });
  })
  .catch((err) => {
    console.error('Could not connect to MongoDB...', err);
  });


