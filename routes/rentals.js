const express = require('express');
const mongoose = require('mongoose');
const { Rental, validate } = require('../models/rental');
const { Customer } = require('../models/customer');
const { Movie } = require('../models/movie');
const router = express.Router();

router.post('/', async (req, res) => {
  // Validate request body
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Look up the customer and movie
  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(404).send('Customer not found.');

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(404).send('Movie not found.');

  // Check if the movie is available
  if (movie.numberInStock === 0) return res.status(400).send('Movie not available.');

  // Create a new rental
  const rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  // Start a session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Save the rental document
    await rental.save({ session });

    // Update the movie stock
    await Movie.updateOne(
      { _id: movie._id },
      { $inc: { numberInStock: -1 } },
      { session }
    );

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    res.send(rental);
  } catch (ex) {
    // Roll back the transaction if an error occurs
    await session.abortTransaction();
    session.endSession();
    res.status(500).send('Something failed while processing the rental.');
  }
});

module.exports = router;
