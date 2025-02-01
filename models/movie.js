const mongoose = require('mongoose');
const Joi = require('joi');

// Define the Movie schema
const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  genre: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
      },
    }),
    required: true,
  },
  numberInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
});

// Create the Movie model
const Movie = mongoose.model('Movie', movieSchema);

// Validation function for movie
function validateMovie(movie) {
  const schema = Joi.object({
    title: Joi.string().min(5).max(50).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required(),
  });

  return schema.validate(movie);
}

exports.Movie = Movie; // Export the Movie model
exports.validate = validateMovie; // Export the validation function
